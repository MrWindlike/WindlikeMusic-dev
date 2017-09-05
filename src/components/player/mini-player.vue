<template>
  <div class="miniPlayer">
  	<audio class="audio" 
  	:src="currentSong.songUrl"
  	@timeupdate="getCurrentTime"
  	@pause="isPlaying=false"
    @play="isPlaying=true"
  	@playing="isPlaying=true"
    @loadstart="isPlaying=false"
  	@ended="playEnd"
  	@loadedmetadata="sendProps"
  	ref="audio">
  	</audio>
  <span @click="toPlayer">
	  <img 
	  v-lazy="currentSong.albumImg_small" :class="{rotate: isPlaying}"
	  class="songImg" 
	  v-show="currentSong.albumImg_small">
	  <i 
	  class="songIcon icon" 
	  v-show="!currentSong.albumImg_small">&#xe603;</i>
    <div class="songMsg-box">
	    <scrollText class="songName" 
      :data="currentSong.songName" :align="'left'" :behavior="'scroll'">
		    {{currentSong.songName ? currentSong.songName : 'Windlie Music'}}
	    </scrollText>
	    <div class="singer">
	  	  {{currentSong.singer ? currentSong.singer : '听想听的音乐'}}
	    </div>
	  </div>
  </span>
	<div class="button-box">
	  <svg class="circleProgress" width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
	    <circle class="circle" cx="22" cy="20.5" r="17.5" stroke="#ffcd32" stroke-width="2.5" fill="transparent" :stroke-dashoffset="progressLength" stroke-dasharray="113">
	    </circle>
	  </svg>
	  <i class="button icon" @click="togglePlay">{{isPlaying ? '&#xe601;' : '&#xe61a;'}}</i><!-- 
   --><span @click="toSongList" class="button icon">&#xe69a;</span>
	</div>
  </div>
</template>

<script>
/**
/* 该组件为控制音乐总组件
/* 其他组件通过bus触发事件操控
/* bus.$emit('ctrl', ['该组件函数名', 参数...])
/* 获取该组件数据：
/* bus.$emit('requestProps')
**/
import scrollText from '../base/scroll-text.vue'

import axios from 'axios';
import {Base64} from 'js-base64';
import bus from '../../api/bus.js';
import Cookies from '../../api/cookies.js';
import router from '../../router/index.js';

const ALLLOOP    = 0,
	  SINGLELOOP = 1,
	  RANDOM     = 2;
const URL = 'http://112.74.38.137:8080/getLyric';
const params = {
  jsonpCallback:'MusicJsonCallback_lrc',
  pcachetime:new Date().getTime(),
  g_tk:5381,
  loginUin:0,
  hostUin:0,
  format:'jsonp',
  inCharset:'utf8',
  outCharset:'utf-8',
  notice:0,
  platform:'yqq',
  needNewCode:0
}
export default {

  name: 'mini-player',

  data () {
    return {
      songList: [],
      currentSong: {
      	songid: 0,
      	songmid: '',
      	albumImg_small: '',
      	albumImg_big: '',
      	songUrl: '',
      	songName: '',
      	singer: '',
      	albumname: '',
      	duration: 0,
      	currentTime: 0,
        lyric: ''
      },
      currentIndex: -1,
      isPlaying: false,
      playMode: ALLLOOP
    };
  },
  created() {
    // 将本地缓存取出添加到歌单列表
    if(localStorage.songList) {
      this.songList = JSON.parse(localStorage.songList);
    }

  	bus.$on('play', (song)=> {
      this.add(song);
      this.play();
      
  	});

    bus.$on('add', (song)=> {
      this.add(song);
    });

  	bus.$on('ctrl', (ctrl)=> {
  	  if(typeof(ctrl) === 'string'){
        this[ctrl]();
      } else {
      	let [func, ...params] = ctrl;
      	this[func](params);
      }
  	});

  	bus.$on('requestProps', ()=>{
  	  this.sendProps();
  	});

    /*let i = 0;
    let song = JSON.parse(Cookies.get(`song${i}`));
    while(song){
      this.songList.push(song);
      i++;
      song = JSON.parse(Cookies.get(`song${i}`))
    }*/
    
  },
  methods: {
  	play(index) {
      if(typeof index !== 'undefined') {
        let [i] = index;
        this.changeSong([i]);
      }

  	  if(this.currentIndex !== -1) {
        setTimeout(()=> {
          this.$refs.audio.play().catch((err)=> {});
          bus.$emit('changeProgress', this.$refs.audio.currentTime);
        }, 20);
  	  }
  	},
    add(song) {
      let isExits = false, index;
      for(let [i, music] of this.songList.entries()) {
        if(Number(music.songid) === Number(song.songid)) {
          index = i;
          isExits = true;
          break;
        }
      }

      if(isExits) {
        this.changeSong([index]);
      } else {
        this.songList.push(song);
        this.changeSong([this.songList.length - 1]);
      }
    },
  	pause() {
  	  this.$refs.audio.pause();
  	},
  	togglePlay() {
  	  if(this.isPlaying) {
  	  	this.pause();
  	  } else {
  	  	this.play();
  	  }
  	},
  	playEnd() {
  	  switch(this.playMode) {
  	  	case ALLLOOP: {
  	  	  this.next();
  	  	  break;
  	  	}
  	  	case SINGLELOOP: {
  	  	  this.play();
  	  	  break;
  	  	}
  	  	case RANDOM: {
  	  	  let random, index;
  	  	  while((random = Math.random()) === 0);
  	  	  index = Math.ceil(random*this.songList.length) - 1;
  	  	  if(this.currentIndex === index) {
  	  	  	this.$refs.audio.currentTime = 0;
  	  	  	this.$refs.audio.play().catch((err)=> {});
  	  	  } else {
  	  	  	this.currentIndex = index;
  	  	  }
          this.play();

  	  	  break;
  	  	}
  	  }
  	},
  	deleteSong([index]) {
  	  this.songList.splice(index, 1);

  	  /* change current index */
  	  if(index < this.currentIndex) {
  	  	this.currentIndex--;
  	  } else if(index === this.currentIndex) {
  	  	  /* if list is empty */
  	  	  if(this.songList.length === 0) {
  	  	  	this.clear();
  	  	  	return ;
  	  	  }
  	  	  /* if delete last one */
  	  	  else if(this.currentIndex === this.songList.length) {
  	  	  	this.currentIndex = 0;
  	  	  }

  	  	this.currentSong = this.songList[this.currentIndex];
        this.play();
  	  }
  	},
  	changeSong([index]) {
      this.currentIndex = index;
  	},
  	next() {
  	  if(this.songList.length === 1) {
  	  	this.$refs.audio.currentTime = 0;
  	  	this.play();
  	  	return ;
  	  }
  	  this.currentIndex = this.currentIndex + 1 >= this.songList.length ?
  	  					  0 : this.currentIndex + 1;
      this.play();
  	},
  	pre() {
  	  if(this.songList.length === 1) {
  	  	this.$refs.audio.currentTime = 0;
  	  	this.play();
  	  	return ;
  	  }
      this.currentIndex = this.currentIndex - 1 < 0 ?
  	  					  this.songList.length - 1 : this.currentIndex - 1;
      this.play();
  	},
  	changePlayMode() {
      this.playMode = this.playMode < RANDOM ? this.playMode + 1 : ALLLOOP;
      bus.$emit('props', ['playMode', this.playMode]);
  	},
  	changeProgress([progress]) {
      this.$refs.audio.currentTime = this.currentSong.duration*progress;
      bus.$emit('changeProgress', this.$refs.audio.currentTime);
  	},
  	clear() {
  	  this.pause();

	    this.songList = [];
	    this.currentSong = {
	  	  songid: 0,
	  	  songmid: '',
		    albumImg_small: '',
		    albumImg_big: '',
		    songUrl: '',
		    songName: '',
		    singer: '',
		    albumname: '',
		    duration: 0,
		    currentTime: 0
	    };
	    this.currentIndex = -1;
	    this.isPlaying = false;
	    this.sendProps();
  	  
  	},
  	getCurrentTime() {
      if(this.currentSong) {
        this.currentSong.currentTime = this.$refs.audio.currentTime;
        bus.$emit('props', ['currentTime', this.currentSong.currentTime]);
      }
  	},
    getLyric() {
      let newParams = Object.assign({}, params, {songmid: this.currentSong.songmid});

      return axios.get(URL, {params: newParams}).then((data)=> {

        let formatDataStr = data.data.replace('MusicJsonCallback_lrc','')
                           .replace('(','').replace(')','');
        let dataObj = JSON.parse(formatDataStr);

        dataObj.lyric = Base64.decode(dataObj.lyric);

        if(dataObj.lyric !== '�w^~)�t') {
          this.currentSong.lyric = dataObj.lyric;
        } else {
          this.currentSong.lyric = '此歌暂无歌词。';
        }
      }).catch(()=> {
        this.currentSong.lyric = '此歌暂无歌词。';
      });
    },
  	sendProps() {
	  	if(this.currentIndex !== -1){
	  	  this.currentSong.duration = this.$refs.audio.duration;
	  	}
      bus.$emit('props', ['songList', this.songList]);
      bus.$emit('props', ['currentIndex', this.currentIndex]);
      bus.$emit('props', ['currentSong', this.currentSong]);
      bus.$emit('props', ['isPlaying', this.isPlaying]);
      bus.$emit('props', ['playMode', this.playMode]);
      bus.$emit('props', ['currentTime', this.currentSong.currentTime]);
  	},
    toSongList() {
      let path = (location.hash + '/songList').replace('#/', '');
      router.push(path);
      
    },
    toPlayer() {
      if(this.currentIndex !== -1){
        let path = (location.hash + '/player').replace('#/', '');
      router.push(path);
      }
    }
  },
  watch: {
  	currentIndex(newVal) {
      this.currentSong.lyric = '';

      if(newVal !== -1) {
        this.currentSong = this.songList[newVal];
        this.getLyric().then(()=>{
          bus.$emit('changeProgress', 0);
          bus.$emit('props', ['currentSong', this.currentSong]);
        }).catch((err)=> {
          console.log(err)
        });

        document.title = `${this.currentSong.songName} - ${this.currentSong.singer}`;
      }
  	  
      bus.$emit('changeProgress', 0);
      bus.$emit('props', ['currentSong', this.currentSong]);
  	  bus.$emit('props', ['currentIndex', newVal]);
  	},
  	isPlaying(newVal) {
      bus.$emit('props', ['isPlaying', newVal]);
      bus.$emit('changeProgress', this.$refs.audio.currentTime);
      bus.$emit('props', ['currentTime', this.$refs.audio.currentTime]);
  	},
    songList(newVal) {
      localStorage.songList = JSON.stringify(newVal);
    }
  },
  computed: {
  	progressLength() {
      const CIRCLELENGTH = 113;

  	  return CIRCLELENGTH - this.currentSong.currentTime/this.currentSong.duration*CIRCLELENGTH;
  	},
  },
  components: {
  	scrollText
  }
};
</script>

<style lang="scss" scoped>
.miniPlayer {
  background: #333;
  width:100%;
  height: 60px;
  position: absolute;
  bottom: 0;
  left: 0;

  @at-root
  .audio {
  	display: none;
  }

  @at-root
  .songImg,
  .songIcon {
  	display: inline-block;
  	color: rgba(white, .5);
  	font-size: 40px;
  	width: 40px;
  	height: 40px;
  	border-radius: 50%;
  	animation: rotate 30s linear infinite;
  	-webkit-animation-play-state:paused; /* Safari 和 Chrome */
  	animation-play-state:paused;
  }

  @at-root
  .rotate {
  	-webkit-animation-play-state:running; /* Safari 和 Chrome */
  	animation-play-state:running;
  }

  @at-root
  .songImg {
  	margin: 10px;
  }

  @at-root
  .songIcon {
  	margin: 5px 10px;
  }

  @at-root
  .songMsg-box {
  	display: inline-block;
	  vertical-align: top;
	  padding-top: 10px;
	  width:calc(100% - 172px);
	  overflow: hidden;

  	@at-root
  	.songName {
  	  width: 100%;
  	  height: 1rem;
  	  color: rgba(white,.8);
  	  font-size: .8em;
  	  margin-bottom: 5px;
  	}

  	@at-root
  	.singer {
  	  overflow: hidden;
  	  white-space: nowrap;
  	  text-overflow: ellipsis;
	    color: rgba(white, .5);
	    font-size: .65em;
  	}
  }

  @at-root
  .button-box {
  	position:absolute;
  	right: 0;
  	top:9px;

	@at-root
	.circleProgress {
	  pointer-events:none;
	  position:absolute;
	  left:-3px;
	  top: 0;
	  width: 42px;
	  height: 42px;

	   @at-root
	   .circle {
	   	transform: rotate(-90deg);
	   	transform-origin: 50% 50%;
	   }
	}

  	@at-root 
  	.button {
  	  display: inline-block;
  	  color:#ffcd32;
  	  margin-right: 10px;
  	  font-size: 36px;
  	}
  }
}

@keyframes rotate {
	from { transform:rotate(0deg); }
	to { transform:rotate(360deg); }
}
</style>