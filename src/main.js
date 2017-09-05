// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import router from './router';
import lazyload from 'vue-lazyload'
import fastclick from 'fastclick';
import './styles/normalize.css';

Vue.config.productionTip = false;

/* lazyload */
Vue.use(lazyload, {
	loading: require('assets/lazy.png'),
	error: require('assets/lazy.png'),
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});

/* fastclick */
// fastclick.attach(document.body);
