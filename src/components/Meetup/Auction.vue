<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm10 offset-sm1 md8 offset-md2  lg4 offset-lg4>
        <v-card v-if="auction.au_status == 'going'" class="mb-2"> 
          <v-card-title class="pb-0">
            
            <h6 v-if="auction.open" class="green--text">
              Осталось {{auction.counter}} сек.
            </h6>
            <h6 v-if="!auction.open" class="primary--text">
              Осталось {{auction.counter}} сек.
            </h6>
          </v-card-title>
        </v-card>
        <v-card v-if="auction.au_status == 'not_started'">
          <v-card-title class="pb-0">
            
            <h6 class="primary--text">
              Аукцион еще не начался
            </h6>
          </v-card-title>
         
          <v-card-text class="pt-2 pb-2 pl-0 pr-0">
             <v-container pt-0 pb-0 pl-0 pr-0>
                  <v-layout  row wrap>
                      <v-flex class=" xs12 pt-2 pb-2 pl-4 pr-4">
                       <h5 class="darken-4" style="color:#424242">
                           Аукцион начнется {{auction.start_at}} в 15:00
                        </h5>
                      </v-flex>
                     
                      
                      
                  </v-layout>
              </v-container>
              
          </v-card-text>
          
        </v-card>
        <v-card v-if="auction.current_lot !== false && auction.open == true  && auction.au_status == 'going' ">
          <v-card-title class="pb-0">
            <h6 class="primary--text">
              {{lots[auction.current_lot].title}}
            </h6>
          </v-card-title>
         
          <v-carousel>
              <v-carousel-item :src="lots[auction.current_lot].imageUrl[0]" ></v-carousel-item>
              <v-carousel-item :src="lots[auction.current_lot].imageUrl[1]" ></v-carousel-item>
              <v-carousel-item :src="lots[auction.current_lot].imageUrl[2]" ></v-carousel-item>
            </v-carousel>
          <v-card-text class="pt-2 pb-2 pl-0 pr-0">
             <v-container pt-0 pb-0 pl-0 pr-0>
                  <v-layout  row wrap>
                      <v-flex class=" xs12 pt-2 pb-2 pl-4 pr-4">
                       <h5 class="darken-4" style="color:#424242">
                            Минимальная ставка :
                            <b class="black--text">{{ lots[auction.current_lot].price }} сом</b>
                        </h5>
                        <h5  v-if="!bets">
                          Ваша ставка: <b class="black--text">{{lots[auction.current_lot].bets[login]}}</b>

                        </h5>
                        
                      </v-flex>
                      <v-flex xs12 >
                        <v-expansion-panel>
                        <v-expansion-panel-content>
                          <div slot="header">Детали лота</div>
                          <v-card>
                            <v-card-text class="grey lighten-3" >
                              <div v-html="lots[auction.current_lot].description"></div>
                            </v-card-text>
                          </v-card>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                      </v-flex>
                     
                      
                      
                  </v-layout>
              </v-container>
              
          </v-card-text>
        <v-btn block large primary v-if="bets" xs12  @click="dialog = true"  slot="activator">Поставить</v-btn>
          
        </v-card>
        <v-card v-if="auction.current_lot !== false && auction.au_status == 'going' && auction.pause_status == true">
          
          <v-card-title class="pb-0">
            <h6 class="primary--text">
              Пауза
            </h6>
          </v-card-title>
       
          <v-card-text class="pt-2 pb-2 pl-0 pr-0">
             <v-container pt-0 pb-0 pl-0 pr-0>
                  <v-layout  row wrap>
                      <v-flex class=" xs12 pt-2 pb-2 pl-4 pr-4">
                        <h5 class="darken-4" style="color:#424242">
                          Победитель
                          
                        </h5>
                         {{winnerIs}}
                       <h5 class="darken-4" style="color:#424242">
                           Ставки:
                        </h5>
                        <table v-if="lots[auction.current_lot].bets" style="width:100%; text-align: left">
                          <tr >
                            <th>email</th>
                            <th>Ставка</th>
                            
                          </tr>
                          <tr v-for="(value, key) in lots[auction.current_lot].bets" class="mb-2 pb-4">
                            <td>{{key}}</td>
                            <td>{{value}} сом</td>
                          </tr>
                          
                        </table>
                        <p v-else>Нет ставок</p>
                        {{sortead}}
                      </v-flex>
                      
                      
                      
                  </v-layout>
              </v-container>
              
          </v-card-text>
          
        </v-card>
        <v-card v-if="auction.au_status == 'finished'">
          
          <v-card-title class="pb-0">
            <h6 class="primary--text">
              Аукцион закончился
            </h6>
          </v-card-title>
       
          
          
        </v-card>
        
      </v-flex>
      
    </v-layout>
    <v-dialog v-if="dialog" v-model="dialog" persistent>
        
          <v-card>
            <v-card-title class="headline">Минимальная цена: {{lots[auction.current_lot].price}} сом</v-card-title>
            <v-card-text>
                <v-text-field
                  name="input-1"
                  label="Ваша цена"
                  id="bet_price"
                  v-model="ur_price"
                  type="number"
                ></v-text-field>
                <v-checkbox v-if="parseInt(ur_price) >= parseInt(lots[auction.current_lot].price)" v-model="agreed" label="Сумма указана верно"></v-checkbox>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat @click.native="dialog=false">Отмена</v-btn>
              <v-btn class="green--text darken-1" flat="flat" :disabled="!agreed" @click.native="newBet">Поставить</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  </v-container>
  
</template>

<script>
import * as firebase from "firebase";

export default {
  data() {
    return {
      agreed: false,
      dialog: false,
      ur_price: null
    };
  },
  firebase: {
    auction: {
      source: firebase.database().ref("auction"),
      asObject: true
    },
    lots: {
      source: firebase.database().ref("lots")
    },
    bets: {
      source: firebase.database().ref("lots" + this.login)
    }
  },

  computed: {
    login: function() {
      var user = this.$store.getters.user;
      return user.email.split("@")[0];
    },
    bets() {
      if (this.auction.open == true) {
        if (this.lots[this.auction.current_lot].bets == undefined) {
          return true;
        } else if (this.lots[this.auction.current_lot].bets !== undefined) {
          if (
            this.lots[this.auction.current_lot].bets[this.login] !== undefined
          ) {
            this.dialog = false;

            return false;
          } else {
            return true;
          }
        } else {
          return false;
          this.dialog = false;
        }
      } else {
        return true;
      }
    },
    sortead() {
      this.dialog = false;
    },
    winnerIs() {
      let max = 0;
      let winnerLogin = null;
      let bettos = this.lots[this.auction.current_lot].bets;
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
    ifBetted() {
      if (this.lots[this.auction.current_lot].bets[this.login] !== undefined) {
        return true;
      }
      return false;
    }
  },
  methods: {
    newBet() {
      var t_lot_key = this.lots[this.auction.current_lot][".key"];

      firebase
        .database()
        .ref("lots/" + t_lot_key + "/bets/" + this.login)
        .set(this.ur_price);
      // если уже есть
      this.dialog = false;
      this.ur_price = 0;
      this.agreed = 0;
    }
  },

  created() {
    console.log("started here");
    // console.log(this.login)
  }
};
</script>