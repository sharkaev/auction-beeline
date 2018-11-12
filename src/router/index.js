import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Meetups from '@/components/Meetup/Meetups'
import CreateMeetup from '@/components/Meetup/CreateMeetup'
import Profile from '@/components/User/Profile'
import Signup from '@/components/User/Signup'
import Signin from '@/components/User/Signin'
import Settings from '@/components/Meetup/Settings'
import Auction from '@/components/Meetup/Auction'
import Meetup from '@/components/Meetup/Meetup'
import AuthGuard from './auth-guard'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            name: 'Meetups',
            component: Meetups,
            redirect: '/meetups'
        },
        {
            path: '/meetups',
            name: 'Meetups',
            component: Meetups
        },
        {
            path: '/meetup/new',
            name: 'CreateMeetup',
            component: CreateMeetup,
            beforeEnter: AuthGuard
        },
        {
            path: '/auction',
            name: 'Auction',
            component: Auction,
            beforeEnter: AuthGuard
        },
        {
            path: '/meetups/:id',
            name: 'Meetup',
            props: true,
            component: Meetup
        },
        {
            path: '/profile',
            name: 'Profile',
            component: Profile,
            beforeEnter: AuthGuard
        },
        {
            path: '/signup',
            name: 'Signup',
            component: Signup
        },
        {
            path: '/signin',
            name: 'Signin',
            component: Signin
        },
        {
            path: '/settings',
            name: 'Settings',
            component: Settings
        }
    ],
    mode: 'history'
})