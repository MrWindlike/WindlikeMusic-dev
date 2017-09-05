import Vue from 'vue';
import Router from 'vue-router';
import player from '../components/player/player.vue'
import songList from '../components/player/song-list.vue'
import list from '../components/list.vue'
import alert from '../components/base/alert.vue'
		
import bus from '../api/bus.js'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '*/list',
      name: 'list',
      component: list,
      children:[
        { 
          path: 'songList', 
          component: songList,
          children: [{ path: 'alert', component: alert }] 
        },
        { 
          path: 'player', 
          component: player, 
          children: [
            { 
              path: 'songList', 
              component: songList,
              children: [{ path: 'alert', component: alert }]
            },
            { 
              path: 'alert', 
              component: alert,
            }
          ] 
        },
      ]
    },
    {
      path: '*/player',
      name: 'player',
      component: player,
      children:[
        { 
          path: 'songList', 
          component: songList,
          children: [{ path: 'alert', component: alert }] 
        },
        { 
          path: 'alert', 
          component: alert,
        }
      ]
    },
    {
      path: '*/songList',
      name: 'song-list',
      component: songList,
      children: [{ path: 'alert', component: alert }]
    },
    
  ]
});
