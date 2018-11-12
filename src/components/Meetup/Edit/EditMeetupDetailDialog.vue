<template>
  <v-dialog width="550px" persistent v-model="editDialog">
    <v-btn fab accent slot="activator">
      <v-icon>edit</v-icon>
    </v-btn>
    <v-card>
      <v-container>
        <v-layout raw wrap>
          <v-flex xs12>
            <v-card-title>Изменить информацию лота</v-card-title>
          </v-flex>
          </v-layout>
          <v-divider></v-divider>
          <v-layout row wrap>
            <v-flex xs12>
              <v-card-text>
                <v-text-field
              name="title"
              label="Title"
              id="title"
              v-model="editedTitle"
              required
              ></v-text-field>
               <v-text-field
              name="price"
              label="Price"
              id="price"
              v-model="editedPrice"
              required
              ></v-text-field>
                <vue-editor v-model="editedDescription"></vue-editor>
              </v-card-text>
            </v-flex>
          </v-layout>
          <v-divider></v-divider>
          <v-layout row wrap>
            <v-flex xs12>
              <v-card-actions>
                <v-btn flat class="blue--text darken-1" @click="editDialog = false">Close</v-btn>
                <v-btn flat class="blue--text darken-1" @click="onSaveChanges">Save</v-btn>
              </v-card-actions>
            </v-flex>
          </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
 import { VueEditor } from 'vue2-editor'
  export default {
      components: {
      VueEditor
   },
    props: ['meetup'],
    data () {
      return {
        editDialog: false,
        editedTitle: this.meetup.title,
        editedPrice: this.meetup.price,
        editedDescription: this.meetup.description
      }
    },
    methods: {
      onSaveChanges () {
        if (this.editedTitle.trim() === '' || this.editedPrice.trim() === '' || this.editedDescription.trim() === '') {
          return
        }
        this.editDialog = false
        this.$store.dispatch('updateMeetupData', {
          id: this.meetup.id,
          title: this.editedTitle,
          price: this.editedPrice,
          description: this.editedDescription
        })
      }
    }
  }
</script>