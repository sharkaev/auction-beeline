import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App'
import * as firebase from 'firebase'
import router from './router'
import { store } from './store'
import DateFilter from './filters/date'
import AlertCmp from './components/Shared/Alert.vue'
import VueFire from 'vuefire'
import EditMeetupDetailDialog from './components/Meetup/Edit/EditMeetupDetailDialog.vue'


Vue.use(VueFire)
Vue.use(Vuetify)
Vue.config.productionTip = false

Vue.filter('date', DateFilter)
Vue.component('app-alert', AlertCmp)
Vue.component('app-edit-meetup-details-dialog', EditMeetupDetailDialog)


/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
    created() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.$store.dispatch('loadAuction');
                this.$store.dispatch('autoSignIn', user)
            }
        })
        this.$store.dispatch('loadMeetups')
    }
})