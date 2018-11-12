<template>
  <v-container>
    <v-layout  class="mb-2 row wrap">
        
      <v-flex class="xs12 sm6 md4 lg3 xl2 mt-3"  v-for="meetup in meetups" :key="meetup.id">
          <v-card >
            <v-card-media 
            :src="meetup.imageUrl[0]"
                height="210px"
            >
                <v-container fill-height fluid>
                    <v-layout fill-height >
                        <v-flex xs12 align-end flexbox>
                            <span class="headline black white--text pt-2 pb-2 pl-2 pr-2">{{ meetup.title }}</span>
                        </v-flex>
                    </v-layout>
            </v-container>
            </v-card-media>
          <v-card-text class="pt-1 pb-1 pl-0 pr-0">
              <v-container pt-0 pb-0 pl-0 pr-0>
                  <v-layout  row wrap>
                      <v-flex class="xs6">
                        <v-btn flat class="left">
                            <img src="/static/som.jpg" height="15px" class="pr-2">
                            {{ meetup.price }} сом
                        </v-btn>
                      </v-flex>
                      <v-flex class="xs6">
                        <v-btn class="right mr-2" primay route :to="'/meetups/'+meetup.id">Подробнее</v-btn>
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
export default {
  computed: {
    meetups() {
      // console.log(this.$store.getters.loadedMeetups)
      return this.$store.getters.loadedMeetups;
    }
  }
};
</script>
