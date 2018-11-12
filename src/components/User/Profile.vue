<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm10 offset-sm1 md8 offset-md2  lg4 offset-lg4>
        <v-card>
          <v-card-title class="pb-0">
            <h6 class="primary--text">
              Ваши ставки
            </h6>
          </v-card-title>
         
          <v-card-text class="pt-2 pb-2 pl-0 pr-0">
             <v-container pt-0 pb-0 pl-0 pr-0>
                  <v-layout  row wrap>
                      <v-flex class=" xs12 pt-2 pb-2 pl-4 pr-4">
                       <h5 class="darken-4" style="color:#424242">
                           Вы не сделали ни одной ставки
                        </h5>
                        
                      </v-flex>
                     
                      
                      
                  </v-layout>
              </v-container>
              
          </v-card-text>
          
        </v-card>
        
        
      </v-flex>
      
    </v-layout>
   
  </v-container>
</template>
