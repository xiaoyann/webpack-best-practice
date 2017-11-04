import Vue from 'vue'
import router from './router'
import App from 'views/app'

// promise polyfill
require('es6-promise').polyfill()

window.app = new Vue({ el: '#app', router, ...App })
