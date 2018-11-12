<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm10 offset-sm1 md8 offset-md2 lg4 offset-lg4 >
        <v-card>
          <v-card-title class="pb-0">
            <h6 class="primary--text pb-0">{{ meetup.title }}</h6>
              <v-spacer></v-spacer>
              <v-btn fab accent  @click="deleteMeetup" v-if="(this.userIsAuthenticated && this.$store.getters.user.id == 'hQJwVxof1sfO9ksz4cY7nAgGotT2') || (this.userIsAuthenticated && this.$store.getters.user.id == 'sunMPhRCznNMxcJaVPsUoEF3Vg33') || (this.userIsAuthenticated && this.$store.getters.user.id == 'VW4hrWrW0hNlOvCtYSbNQp40CSz2')">
               <v-icon>delete</v-icon>
              </v-btn>
              <app-edit-meetup-details-dialog :meetup="meetup" v-if="(this.userIsAuthenticated && this.$store.getters.user.id == 'hQJwVxof1sfO9ksz4cY7nAgGotT2') || (this.userIsAuthenticated && this.$store.getters.user.id == 'sunMPhRCznNMxcJaVPsUoEF3Vg33') || (this.userIsAuthenticated && this.$store.getters.user.id == 'VW4hrWrW0hNlOvCtYSbNQp40CSz2')"></app-edit-meetup-details-dialog>
          </v-card-title>
            <v-carousel style="height: 450px !important">
              <v-carousel-item v-for="(item, key, index) in meetup.imageUrl" v-bind:src="item" :key="index"></v-carousel-item>
            </v-carousel>
          <v-card-text class="pt-2 pb-0 pl-0 pr-0">
             <v-container pt-0 pb-0 pl-0 pr-0>
                  <v-layout  row wrap>
                      <v-flex class="xs12 pt-2 pb-2 pl-3 pr-3">
                       <h5 class="darken-4" style="color:#424242">
                            Минимальная ставка :
                            <b class="black--text">{{ meetup.price }} сом</b>
                        </h5>
                      </v-flex>
                      <v-flex xs12 >
                        <v-expansion-panel>
                        <v-expansion-panel-content>
                          <div slot="header"><v-icon>info</v-icon>Детали лота</div>
                          <v-card>
                            <v-card-text class="grey lighten-3" >
                              <div v-html="meetup.description"></div>
                            </v-card-text>
                          </v-card>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                      </v-flex>
                      
                      
                  </v-layout>
              </v-container>
              
          </v-card-text>

        </v-card>
        <v-card v-if=" auction.au_status == 'finished' " class="mt-2">
         
          <v-card-text class="pt-2 pb-2 pl-0 pr-0">
             <v-container pt-0 pb-0 pl-0 pr-0>
                  <v-layout  row wrap>
                      <v-flex class=" xs12 pt-2 pb-2 pl-4 pr-4">
                        <h5 class="darken-4" style="color:#424242">
                          Победитель:
                        </h5>
                         {{winnerIs}}
                       <h5 class="darken-4" style="color:#424242">
                           Ставки:
                        </h5>
                        <table v-if="meetup.bets" style="width:100%; text-align: left">
                          <tr >
                            <th>Логин</th>
                            <th>Ставка</th>
                            
                          </tr>
                          <tr v-for="(value, key) in meetup.bets" class="mb-2 pb-4">
                            <td>{{key}}</td>
                            <td>{{value}}</td>
                          </tr>
                          
                        </table>
                        <p v-else>Нет ставок</p>
                      </v-flex>
                      
                      
                      
                  </v-layout>
              </v-container>
              
          </v-card-text>
          
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import * as firebase from "firebase";

export default {
  props: ["id"],

  firebase: {
    auction: {
      source: firebase.database().ref("auction"),
      asObject: true
    },
    lots: {
      source: firebase.database().ref("lots")
    }
  },
  created() {
    // console.log('Митап');
    // console.log(this.meetup);
  },
  computed: {
    meetup() {
      return this.$store.getters.loadedMeetup(this.id);
    },
    winnerIs() {
      let max = 0;
      let winnerLogin = null;

      let bettos = this.meetup.bets;
      if (bettos !== undefined && bettos !== null) {
        Object.keys(bettos).forEach(function(key) {
          if (parseInt(bettos[key]) > parseInt(max)) {
            max = bettos[key];
            winnerLogin = key;
          }
        });
        return winnerLogin + " со ставкой " + bettos[winnerLogin] + " сом";
      } else {
        return "Нет победителя. Никто не поставил";
      }
    },
    userIsAuthenticated() {
      return (
        this.$store.getters.user !== null &&
        this.$store.getters.user !== undefined
      );
    }
  },
  methods: {
    deleteMeetup() {
      firebase
        .database()
        .ref("lots")
        .child(this.id)
        .remove()
        .then(() => this.$router.push("/meetups"));
    }
  }
};
</script>

<style>
h1 {
  font-size: 2rem;
  color: black;
}
</style>