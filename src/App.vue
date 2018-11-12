<template>
  <v-app>
    <v-navigation-drawer temporary v-model="sideNav">
      <v-list>
        <v-list-tile
          v-for="item in menuItems"
          :key="item.title"
          :to="item.link">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          v-if="userIsAuthenticated"
          @click="onLogout">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Выйти</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar  class="yellow accent-2">
      <v-toolbar-side-icon
        @click.stop="sideNav = !sideNav"
        class="hidden-sm-and-up "></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">{{ title }}</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn
          flat
          v-for="item in menuItems"
          :key="item.title"
          :to="item.link">
          <v-icon left dark>{{ item.icon }}</v-icon>
          {{ item.title }}

        </v-btn>
        <v-btn
          v-if="userIsAuthenticated"
          flat
          @click="onLogout">
          <v-icon left dark>exit_to_app</v-icon>
          Выйти

        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <main>
      <router-view></router-view>
    </main>
  </v-app>
</template>

<script>
import Firebase from "firebase";
let config = {};

let app = Firebase.initializeApp(config);
let db = app.database();
let auctionRef = db.ref("auction");
export default {
  data() {
    return {
      sideNav: false,
      title: "Начало в 15:00"
    };
  },
  firebase: {
    todos: auctionRef
  },
  computed: {
    menuItems() {
      let menuItems = [
        { icon: "face", title: "Регистрация", link: "/signup" },
        { icon: "lock_open", title: "Вход", link: "/signin" }
      ];
      if (this.userIsAuthenticated) {
        menuItems = [
          {
            icon: "supervisor_account",
            title: "Список лотов",
            link: "/meetups"
          },
          { icon: "person", title: "Аукцион", link: "/auction" }
        ];
      }
      if (
        (this.userIsAuthenticated &&
          this.$store.getters.user.id == "hQJwVxof1sfO9ksz4cY7nAgGotT2") ||
        (this.userIsAuthenticated &&
          this.$store.getters.user.id == "sunMPhRCznNMxcJaVPsUoEF3Vg33") ||
        (this.userIsAuthenticated &&
          this.$store.getters.user.id == "VW4hrWrW0hNlOvCtYSbNQp40CSz2")
      ) {
        menuItems = [
          {
            icon: "supervisor_account",
            title: "Список лотов",
            link: "/meetups"
          },
          { icon: "person", title: "Аукцион", link: "/auction" },
          { icon: "room", title: "Добавить лот", link: "/meetup/new" },
          { icon: "settings", title: "Settings", link: "/settings" }
        ];
      }
      return menuItems;
    },
    userIsAuthenticated() {
      return (
        this.$store.getters.user !== null &&
        this.$store.getters.user !== undefined
      );
    }
  },
  methods: {
    onLogout() {
      this.$store.dispatch("logout");
    }
  }
};
</script>

<style lang="stylus">
@import './stylus/main';
</style>
