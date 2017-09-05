<template>
  <transition name="slide">
  <div class="list">
    <img :src="imgUrl" class="coverPic" :style="{filter: 'blur('+blur+'px)'}">
    <div class="coverBG"></div>
  	<div class="header">
  	  <i class="exitBtn icon" @click="exit">&#xe605;</i><!-- 
   --><scrollText :data="title" class="scroll-wrap">
        <div class="title">{{title}}</div>
      </scrollText>
  	</div>
	<scroll 
  :data="list.songList" :probeType="3" 
  class="scroll" 
  @scroll="getBlur" @pullingUp="getList">
	  	<div class="song-box" ref="songBox">
	  	  <div 
	  	  class="song" 
	  	  @click="play(song)"
	  	  v-for="(song,index) of list.songList">
	  	    <img :src="rank[index]" 
	  	    class="rank" 
	  	    v-if="index < 3 && data.type==='rank'"><!-- 
	  	 --><div class="rank" v-else-if="index >= 3 && data.type==='rank'">{{index+1}}</div><!-- 
	  	 --><div class="songMsg">
	  	  	  <div class="songName">{{song.songname}}</div>
	  	  	  <div class="other">{{getOtherMsg(song)}}</div>
	  	  	</div>
	  	  </div>
        <loading v-show="!loadend"></loading>
	  	</div>
	</scroll>
  <keep-alive>
    <router-view 
    @update:playerPage="updatePlayerPage"
    :playerPage="playerPage" 
    style="height:calc(100% + 60px)"></router-view>
  </keep-alive>
  </div>
  </transition>
</template>

<script>
import scroll from './base/scroll.vue'
import scrollText from './base/scroll-text.vue'
import loading from './base/loading.vue'

import jsonp from 'jsonp'
import listBus from '../api/list-bus.js'
import bus from '../api/bus.js'

import rank0 from '../assets/rank0.png'
import rank1 from '../assets/rank1.png'
import rank2 from '../assets/rank2.png'

let entry = location.hash;

export default {

  name: 'list',
  props: {
    playerPage: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      data: {},
      list: {
        songList: []
      },
      imgUrl: '',
      title: '',
      blur: 0,
      total: 0,
      pagenum: 0,
      loadend: true
    };
  },
  beforeRouteEnter (to, from, next) {
    next((vm)=> {
      vm.total = 0;
      vm.pagenum = 0;
      vm.list = {
        songList: []
      };
      vm.data = listBus.get();
      vm.getList();
      vm.rank = [rank0, rank1, rank2];
    });
  },
  methods: {
    getList() {
      if(this.data.type === 'rank'){
        this.getRankList();
      } else if(this.data.type === 'singer') {
        this.getSingerList();
      } else if(this.data.type === 'diss') {
        this.getDissList();
      }
    },
  	getRankList() {
  	  const URL = `https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&tpl=3&page=detail&type=top&topid=${this.data.id}&_=1503320629451`;

  	  jsonp(URL, {param: 'jsonpCallback'}, (err, data)=> {
  	  	if(!err) {
          let songList = [];
          for(let song of data.songlist) {
            songList.push(song.data);
          }

  	  	  this.list.songList = songList;
          this.imgUrl = data.topinfo.pic_v12;
          this.title = data.topinfo.ListName;
  	  	}
  	  })
  	},
    getSingerList() {
      let mid = this.data.mid ? this.data.mid : this.data.singermid;

      const URL = `https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg?g_tk=5381&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&singermid=${mid}&order=listen&begin=${this.pagenum*30}&num=30&songstatus=1`;
      
      jsonp(URL, {param: 'jsonpCallback'}, (err, data)=> {
        if(!err) {

          for(let song of data.data.list) {
            this.list.songList.push(song.musicData);
          }

          this.imgUrl = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${data.data.singer_mid}.jpg?max_age=2592000`;
          this.title = data.data.singer_name;
          this.total = data.data.total;

          if((this.pagenum + 1)*30 <= this.total) {
            this.pagenum++;
            this.loadend = false;
          } else {
            this.loadend = true;
          }

        }
      })
    },
    getDissList() {
      const URL = `https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg?type=1&json=1&utf8=1&onlysong=0&disstid=${this.data.dissid}&format=jsonp&g_tk=5381&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0`;

      jsonp(URL, {param: 'jsonpCallback', name: 'jsonpCallback'}, (err, data)=> {
        if(!err) {
          this.list.songList = data.cdlist[0].songlist;
          this.imgUrl = data.cdlist[0].logo;
          this.title = data.cdlist[0].dissname;
        } else {
          console.log(err)
        }
      });
    },
  	getOtherMsg(song) {
      if(this.data.type === 'singer') {
        if(song.albumname !== '空'){
          return `${song.albumname}`;
        } else {
          return '';
        }
      } else {
        let singers = '';
        song.singer.forEach((singer, index)=> {
          if(index > 0) {
            singers += '&';
          }

          singers += singer.name;
        });

        return `${singers}·${song.albumname}`;
      }
  	},
  	getBlur() {
  	  let songBox = this.$refs.songBox,
          transform = songBox.style.transform || songBox.style.webkitTransform,
          moveWidth = '', flag = false;

      for(let char of transform) {
      	if(flag) {
      	  if(char === 'p') {
      	  	break;
      	  } else {
      	  	moveWidth += char;
      	  }
      	}
      	if(char === ',') {
      	  flag = true;
      	}
      }
      
      let rate = -moveWidth/(document.body.clientWidth*0.6);

      this.blur =  rate > 1 ? 1 : 0;
  	},
  	play(song) {
      bus.$emit('ctrl', 'clear');

      setTimeout(()=> {
      	this.list.songList.forEach((songData)=> {
      		bus.playSong(songData);
      	});

      	bus.playSong(song);
      }, 20);
  	  
  	},
  	exit() {
  	  if(entry === '#/' || entry === '') {
  	  	this.show = false;
  	  	window.history.back();
  	  } else {
  	  	location.hash = '#/';
  	  	entry = '#/';
  	  }
  	},
    updatePlayerPage(playerPage) {
      this.$emit('update:playerPage', playerPage);
    }
  },
  components: {
  	scroll,
    scrollText,
    loading
  }
};
</script>

<style lang="scss" scoped>
.list {
  background: #222;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100% - 60px);
  z-index: 3;

  @at-root
  .coverPic {
  	width: 100%;
  }

  @at-root
  .coverBG {
    width: 100%;
    padding-top: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(black, .2);
  }

  @at-root
  .header {
  	position: absolute;
  	top: 0;
  	left: 0;
	  width: 100%;
	  margin-top: .5rem;
	  z-index:1;

  	@at-root
  	.exitBtn {
  	  color: #ffcd32;
  	  margin: 0 .5rem;
	    position: absolute;
	    top: 0;
	    left: 0;
  	}
    @at-root
    .scroll-wrap {
      width: 70%;
      margin: 0 auto;

      @at-root
      .title {
        color: #ffcd32;
        text-align: center;
      }
    }
  }
  @at-root
  .scroll {
    position: absolute;
    top: 2rem;
    bottom: 0;
    width: 100%;
    overflow: hidden;
	  padding-top: 60%;

  	@at-root
    .song-box {
	  	background: #222;
	  	padding-bottom: calc(60% + 1rem);

  		@at-root
  		.song {
  		  height: 60px;
        border-bottom: 1px rgba(gray, .3) solid;

  		  @at-root
  		  .rank {
  		  	color: #ffcd32;
  		  	display: inline-block;
  		    width: 30px;
  		    height: 30px;
  		    margin: 15px 1rem;
  		    text-align: center;
  		    line-height: 30px;
  		    font-weight: bold;

  		    @at-root
  		    .songMsg {
  		      display: inline-block;
  		      margin: 15px 1rem;
  		      position: relative;
  		      vertical-align: top;
  		      width: calc(100% - 30px - 4rem);

  		      @at-root
  		      .songName {
  		      	color: white;
  		      	font-size: .7rem;
  		      	overflow: hidden;
  		      	white-space: nowrap;
  		      	text-overflow: ellipsis;
  		      	max-width: 100%;
  		      }

  		      @at-root
  		      .other {
  		      	color: rgba(white, .6);
  		      	font-size: .6rem;
  		      	margin-top: 5px;
  		      	overflow: hidden;
  		      	white-space: nowrap;
  		      	text-overflow: ellipsis;
  		      	max-width: 100%;
  		      }
  		    }
  		  }
  		}
    }
  }
  
}

.slide-enter-active, .slide-leave-active {
  transition: transform .3s;
  transform: translate3d(0,0,0);
}
.slide-enter, .slide-leave-to {
  transform: translate3d(100%,0,0);
}
</style>