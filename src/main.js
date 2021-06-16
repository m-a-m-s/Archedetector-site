import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import moment from 'moment'
import VueRouter from "vue-router";

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)

// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.use(VueRouter)

Vue.config.productionTip = false
Vue.prototype.moment = moment

import Home from './components/Home'
import MailingList from "@/components/MailingList";
import Mailbox from "@/components/Mailbox";

const routes = [
    {
        name: "Home",
        path: '/',
        component: Home,
    },
    {
        name: "MailingList",
        path: "/mailing-list",
        component: MailingList,
        children: [
            {
                name: "Mail",
                path: ":id/page/:page",
                component: Mailbox
            },
            {

                name: "Search",
                path: ":id/search/:query/page/:page",
                component: Mailbox
            }
        ]
    },
    {
        path: '*',
        redirect: '/'
    }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
