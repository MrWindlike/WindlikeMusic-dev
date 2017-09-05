<template>
  <transition name="fade">
  <div class="player">
  	<img v-lazy="currentSong.albumImg_big" class="bg">
    <transition name="scrollDown">
  	  <player-header :currentSong="currentSong" :show.sync="show" v-show="show"></player-header>
    </transition>
    <div class="middle-box">
      <player-albumPage 
      :show="show" 
      :currentSong="currentSong" 
      :isPlaying="isPlaying"
      :currentLyric="currentLyric"
      :style="{opacity:ablunmOpacity}"></player-albumPage>
      <div class="slider" ref="slider">
        <div 
        class="slider-box" 
        ref="sliderBox"
        @touchmove="getAblunmOpacity">
          <div class="emptyPage"
           ></div><!-- 
       --><player-lyricPage 
          :lyric="currentSong.lyric"
          :currentTime="currentTime"
          :isPlaying="isPlaying"
          @updateLyric="getCurrentLyric"></player-lyricPage>
        </div>
      </div>
    </div>
    <transition name="scrollUp">
  	  <player-bottom
      :playMode="playMode" 
      :currentSong="currentSong" 
      :currentTime="currentTime"
      :isPlaying="isPlaying"
      :pageIndex="playerPage"
      :href="href"
      v-show="show"></player-bottom>
    </transition>
    <keep-alive>
      <router-view :msg="'已复制到剪贴板！\n快去分享给朋友吧！'" :type="1"></router-view>
    </keep-alive>
  </div>
  </transition>
</template>

<script>
import playerHeader from './player-header.vue';
import playerAlbumPage from './player-albumPage.vue';
import playerLyricPage from './player-lyricPage.vue';
import playerBottom from './player-bottom.vue';

import bus from '../../api/bus.js';
import BetterScroll from 'better-scroll';
import {Base64} from 'js-base64';
import router from '../../router/index.js';

export default {

  name: 'player',
  props: {
    playerPage: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      songList: null,
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
        lyric: ''
      },
      currentIndex: -1,
      isPlaying: false,
      playMode: 0,
      currentTime: 0,
      currentLyric: '',
      show: false,
      ablunmOpacity: 1,
      href: ''
    };
  },
  mounted() {
    bus.$on('props', ([key, value])=> {
      this[key] = value;

      if(location.hash.indexOf('player') !== -1 && key === 'currentSong' && value.songmid) {
        this.$nextTick(()=> {
          this.replaceHash();
        })
      }
    });
  },
  beforeRouteEnter (to ,from, next) {
    next((vm)=> {
      bus.$emit('requestProps');
      vm.initSlider();
      vm.playSong();
      vm.show = true;
    });
  },
  beforeRouteLeave (to, from, next) {
    this.show = false;
    next();
  },
  methods: {
    initSlider() {
      this.slider = new BetterScroll(this.$refs.slider, {
          probeType: 3,
          scrollX: true,
          scrollY: false,
          momentum: false,
          bounce: false,
          snap: true,
          snapLoop: false,
          snapThreshold: 0.3,
          snapSpeed: 400,
          click: true,
          HWCompositing: true
        });

      this.slider.on('scroll', ()=> {
        this.getAblunmOpacity();
      });

      this.slider.on('scrollEnd', ()=> {
        this.$emit('update:playerPage', this.slider.getCurrentPage().pageX);
      });

      this.slider.goToPage(this.playerPage, 0, 0);
      this.getAblunmOpacity();
    },
    getAblunmOpacity() {
      let sliderBox = this.$refs.sliderBox,
          transform = sliderBox.style.transform || sliderBox.style.webkitTransform,
          moveWidth = Math.abs(transform.replace('translate(','').replace('px, 0px) translateZ(0px)',''));
      this.ablunmOpacity = 1 - moveWidth / document.body.clientWidth;
      
    },
    getCurrentLyric(lyric) {
      this.currentLyric = lyric;
    },
    playSong() {
      if(location.hash.lastIndexOf('#')) {
        let msg = Base64.decode(
                                  location.hash.match(/\#[^\/]\S*/)[0]
                                  .replace('#', '')
                                  .replace('%2F', '/')
                                  .replace('%40', '+')
                               ).split('&');
        let song = {
          songid: msg[0],
          songUrl: `http://ws.stream.qqmusic.qq.com/${msg[0]}.m4a?fromtag=46`,
          songmid: msg[1],
          albummid: msg[2],
          albumImg_small: `https://y.gtimg.cn/music/photo_new/T002R68x68M000${msg[2]}.jpg?max_age=2592000`,
          albumImg_big: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${msg[2]}.jpg?max_age=2592000`,
          songName: msg[3],
          singer: msg[4],
          currentTime: 0
        };

        bus.$emit('add', song);  
      }
    },
    replaceHash() {
      let code = Base64.encode(`${this.currentSong.songid}&${this.currentSong.songmid}&${this.currentSong.albummid}&${this.currentSong.songName}&${this.currentSong.singer}`).replace('+', '%40');
      try {
        router.replace(`#${code}`);
        this.href = location.href;
      } catch(e) {

      }
    }
  },
  components: {
  	playerHeader,
  	playerAlbumPage,
    playerLyricPage,
  	playerBottom
  }
};
</script>

<style lang="scss" scoped>
.player {
  background: #666;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width:100%;
  overflow: hidden;
  z-index: 4;

  @at-root
  .bg {
  	filter:blur(20px);
  	position:absolute;
  	top: 0;
  	left: 0;
  	width:100%;
  	height: 100%;
  	opacity: .6;
  	z-index: -1;
  } 

  @at-root
  .middle-box {
    position:relative;
    margin-top: 20px;
    height: calc(100% - 266px);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    @at-root
    .slider {
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
    
      @at-root
      .slider-box {
        height: 100%;
        width: 200%;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;

        @at-root
        .emptyPage {
          display: inline-block;
          width: 50%;
          height: 100%;
        }
      }
    }
  }

}

.fade-enter-active, .fade-leave-active {
  transition: opacity .8s;
  transform: translate3d(0,0,0);
}
.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translate3d(0,0,0);
}

.scrollDown-enter-active, .scrollDown-leave-active {
  transition: transform .8s;
  transform: translate3d(0,0,0);
}
.scrollDown-enter, .scrollDown-leave-to {
  transform: translate3d(0, -71px, 0);
  opacity: 0;
}

.scrollUp-enter-active, .scrollUp-leave-active {
  transition: transform .8s;
  transform: translate3d(0,0,0);
}
.scrollUp-enter, .scrollUp-leave-to {
  transform: translate3d(0, 175px, 0);
  opacity: 0;
}
</style>