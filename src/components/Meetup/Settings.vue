<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <h4>Аукцион</h4>
        <span>Настройки</span>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <form @submit.prevent="onCreateMeetup">
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                type="number"
                name="duration"
                label="Длительность лота (в минутах)"
                id="duration"
                v-model="auction.duration"
                required></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                type="number"
                name="pause"
                label="Пауза между лотами (в минутах)"
                id="pause"
                v-model="auction.pause"
                required></v-text-field>
            </v-flex>
          </v-layout>
          
          
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-btn
                class="primary"
                :disabled="!formIsValid"
                type="submit">Set Settings</v-btn>
                 <v-btn
                  class="primary"
                  @click.prevent="startAU"
                >Start auction</v-btn>
            </v-flex>
          </v-layout>
          <v-layout row class="mb-2">
             <v-flex xs12 sm6 offset-sm3>
               <table style="width:100%; text-align: left">
                <tr >
                  <th>ID</th>
                  <th>Лот</th>
                  <th>Статус</th> 
                  <th>Победитель</th>
                </tr>
                <tr v-for="lot in lots" class="mb-2 pb-4">
                  <td>{{lot['.key']}}</td>
                  <td>{{lot.title}}</td>
                  <td >{{ counter }}</td> 
                  <td>Нет</td>
                </tr>
                
              </table>
             </v-flex>
           
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import * as firebase from 'firebase'
let interval = null;

  export default {
    data () {
      return {
        duration: '',
        pause: '',
        date: new Date(),
        time: new Date(),
        currentLot: null,
        counter: 0
      }
    },
    firebase:{
      auction: {
        source: firebase.database().ref('auction'),
        asObject: true
      },
      lots:{
        source: firebase.database().ref('lots')
      }
    },
    computed: {
      formIsValid () {
        return this.duration !== '' &&
          this.pause !== '' &&
          this.time !== '' &&
          this.date !== ''
      },
      submittableDateTime () {
        const date = new Date(this.date)
        if (typeof this.time === 'string') {
          let hours = this.time.match(/^(\d+)/)[1]
          const minutes = this.time.match(/:(\d+)/)[1]
          date.setHours(hours)
          date.setMinutes(minutes)
        } else {
          date.setHours(this.time.getHours())
          date.setMinutes(this.time.getMinutes())
        }
        return date
      }
    },
    methods: {
      onCreateMeetup () {
        if (!this.formIsValid) {
          return
        }
        const meetupData = {
          duration: this.duration,
          pause: this.pause,
          date: this.submittableDateTime
        }
        this.$store.dispatch('setSettings', meetupData)
        this.$router.push('/settings')
      },
      makeActiveLot: function(id){
        console.log(id);
        firebase.database().ref('auction/current_lot').set(id);
        firebase.database().ref('auction/open').set(true);
        firebase.database().ref('auction/pause_status').set(false);
        firebase.database().ref('lots/'+this.lots[id]['.key']+'/status').set('started');
        
      },
      pauseLot: function(id){
        console.log('Перевел на паузу лот '+id);
        firebase.database().ref('auction/pause_status').set(true);
        firebase.database().ref('auction/open').set(false);
        firebase.database().ref('lots/'+this.lots[id]['.key']+'/status').set('finished');
        
      },
      startAU: function(){
        var step = 0;
        firebase.database().ref('auction/au_status').set('going');
        
        var lot_length = this.lots.length;
        var minutes = (this.auction.duration + this.auction.pause)*60;
       
        this.makeActiveLot(step);
        
        interval = setInterval(() => {
          minutes--;
            this.counter = minutes
            if(minutes > this.auction.pause*60){
              var ccc = minutes-this.auction.pause*60;
              firebase.database().ref('auction/counter').set(ccc);
            }
            if(minutes == this.auction.pause*60){
              this.pauseLot(step)
              console.log(this.lots[step]['.key']);
              firebase.database().ref('auction/counter').set(minutes);
              

            }
            else if(minutes == 0){
              if(step == lot_length-1){
                firebase.database().ref('auction/counter').set(0);
                firebase.database().ref('auction/au_status').set('finished');
                clearInterval(interval);
                
              }else{
                step++;
                this.makeActiveLot(step)
                minutes = (this.auction.duration+this.auction.pause)*60;
              }
              
            }
            else if(minutes<this.auction.pause*60){
              firebase.database().ref('auction/counter').set(minutes);
            }
        }, 1000)
        console.log(interval)
      },
      
    },
    created(){
      
      console.log('Настройки аукциона');
      console.log(this.auction);
      console.log(this.lots);
      console.log('Конец аукциона');
    }
  }
</script>
