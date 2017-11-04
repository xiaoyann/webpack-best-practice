import Vue from 'vue'
import Router from 'vue-router'
import Home from 'views/home'

const routes = [
  {
    path: '/',
    component: Home
  }
]

Vue.use(Router)

export default new Router({ routes })
