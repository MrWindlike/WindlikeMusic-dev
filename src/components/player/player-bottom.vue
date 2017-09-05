<template>
  <div class="bottom-box">
    <div class="dot-box">
  	  <div class="dot" v-for="i of 2" :class="{active: i - 1 === pageIndex}"></div>
    </div>
    <div class="timeLine-box">
      <div class="center-box">
        <div class="time">{{formatTime(currentTime)}}</div><!-- 
     --><div class="progressBar-box">
        	<div 
        	class="progressBar" 
        	:style="{width:getProgress}"></div>
        	<div class="progressButton" :style="{left:getProgress}"></div>
        	<div class="progressBar-ctrl" @click="changeProgress($event)"></div>
        </div><!-- 
     --><div class="time">{{formatTime(currentSong.duration)}}</div>
      </div>
    </div>
    <div class="button-box">
      <i class="playModeBtn icon" @click="changePlayMode" v-show="playMode===0">&#xe66c;</i><!-- 
   --><i class="playModeBtn icon" @click="changePlayMode" v-show="playMode===1">&#xe604;</i><!-- 
   --><i 
     style="margin-top:.55rem" 
     class="playModeBtn icon" 
     @click="changePlayMode" 
     v-show="playMode===2">&#xe6f1;</i><!-- 
   --><i class="preBtn icon" @click="pre">&#xe64f;</i><!-- 
   --><i class="togglePlayBtn icon" @click="togglePlay" v-show="!isPlaying">&#xe61a;</i><!-- 
   --><i class="togglePlayBtn icon" @click="togglePlay" v-show="isPlaying">&#xe601;</i><!-- 
   --><i class="nextBtn icon" @click="next">&#xe64d;</i><!-- 
   --><span @click="toSongList" class="listBtn icon">&#xe69a;</span>
    </div>
    <div class="button-box">
      <i class="likeBtn icon">&#xe6ca;</i>
      <a :href="currentSong.songUrl" class="downloadBtn icon">&#xe606;</a>
	  <i class="shareBtn icon" @click="share">&#xe62c;</i>
    <div class="hide" type="text" ref="copyobject">{{href}}</div>
    </div>
  </div>
</template>

<script>
import bus from '../../api/bus.js';
import router from '../../router/index.js';

const ALLLOOP    = 0,
      SINGLELOOP = 1,
      RANDOM     = 2;

export default {

  name: 'player-bottom',
  props: {
    pageIndex: {
      type: Number,
      default: 0
    },
  	currentSong: {
  	  type: Object,
  	  default: null
  	},
  	currentTime: {
  	  type: Number,
  	  default: 0
  	},
  	isPlaying: {
  	  type: Boolean,
  	  default: false
  	},
  	playMode: {
  	  type: Number,
  	  default: ALLLOOP
  	},
    href: {
      type: String,
      default: ''
    }
  },
  data () {
    return {

    };
  },
  methods: {
    share() {
      if (document.body.createTextRange) {
          var range = document.body.createTextRange();
          range.moveToElementText(this.$refs.copyobject);
          range.select();
      } else if (window.getSelection) {
          var selection = window.getSelection();
          var range = document.createRange();
          range.selectNodeContents(this.$refs.copyobject);
          selection.removeAllRanges();
          selection.addRange(range);
      } 

      // this.$refs.copyobject.select();
      document.execCommand("Copy");  
      if (document.selection) { 
        document.selection.empty(); 
      } else if (window.getSelection) { 
        window.getSelection().removeAllRanges(); 
      } 

      location.hash = location.hash.replace('player', 'player/alert');
    },
  	changePlayMode() {
  	  bus.$emit('ctrl', 'changePlayMode');
  	},
  	togglePlay() {
  	  bus.$emit('ctrl', 'togglePlay');
  	},
  	pre() {
      bus.$emit('ctrl', 'pre');
  	},
  	next() {
  	  bus.$emit('ctrl', 'next');
  	},
  	changeProgress(event) {
  	  let progress;

  	  if(event.target.classList[0] === 'progressBar-ctrl'){
  	  	progress = event.offsetX/event.target.clientWidth;
  	  	bus.$emit('ctrl', ['changeProgress', progress]);
  	  }
  	},
  	formatTime(time) {
      if(time) {
        let m = 0, s = 0;
      
        m = parseInt(time/60);
        s = parseInt(time) - m*60;

        return s > 9 ? `${m}:${s}` : `${m}:0${s}`
      } else {
        return '0:00';
      }
  	},
    toSongList() {
      location.hash = location.hash.replace('player', 'player/songList');
    }
  },
  computed: {
  	getProgress() {
      if(this.currentSong.duration) {

  	    return `${parseInt(
  	  			    this.currentTime/this.currentSong.duration*100
  	  		      )}%`;
      } else {
        return this.currentTime*0;
      }
  	}
  }
};
</script>

<style lang="scss" scoped>
.bottom-box {
  position:absolute;
  bottom: 0;
  left:0;
  width: 100%;
  height: 175px;

  @at-root
  .dot-box {
    margin:.3rem auto 0 auto;
    text-align: center;

    @at-root
    .dot {
      margin:0 .2rem;
      display: inline-block;
      background: rgba(white, .65);
      border-radius: 50%;
      height: .5em; 
      width: .5em;
      transition: all .3s ease;
    }

    @at-root
    .active {
      background: rgba(white, .8);
      border-radius: 20px;
      width:1em;
    }
  }

  @at-root
  .timeLine-box {
    position:relative;
  	margin-bottom: .5rem;
    text-align: center;

    @at-root
    .center-box {
      display: inline-block;
      margin:0 auto;
      width: 90%;

      @at-root
      .time {
        display: inline-block;
        color: white;
        font-size: .75rem;
        margin: 0 .75rem;
      }

      @at-root
      .progressBar-box {
        border-radius: 1px;
        background: rgba(white, .5);
        display: inline-block;
        height: 4px;
        width: 60%;
        margin: .5rem 0;
        position: relative;
        vertical-align: top;

        @at-root
        .progressBar,
        .progressBar-ctrl {
          background: #ffcd32;
          height: 100%;
        }

        @at-root
        .progressBar-ctrl {
          height: 6px;
          width:100%;
          opacity: 0;
          position:absolute;
          top:-1px;
          left:0;
        }

        @at-root
        .progressButton, {
          background: #ffcd32;
          border-radius: 50%;
          box-shadow:0 0 0 .2em white;
          height: .5em;
          width: .5em;
          position: absolute;
          top: -.2em;
          left: 0;
        }
      }
    }
  	
  }

  @at-root
  .button-box {
	margin-top: .5rem;
	text-align: center;

	@at-root
  	.playModeBtn,
  	.listBtn {
  	  color: rgba(white, .8);
  	  display: inline-block;
  	  vertical-align: top;
  	}

  	@at-root
  	.listBtn {
	  font-size: 1.6rem;
	  margin:.6rem .6rem;
  	}

  	@at-root
  	.playModeBtn {
	  font-size: 1.3rem;
  	  margin:.7rem .7rem;
  	}

  	@at-root
  	.preBtn,
  	.nextBtn {
  	  color: #ffcd32;
  	  display: inline-block;
  	  font-size: 2rem;
  	  vertical-align: top;
  	  margin:.25rem .6rem;
  	}

  	@at-root
  	.togglePlayBtn {
  	  color: #ffcd32;
  	  display: inline-block;
  	  font-size: 2.5rem;
  	  vertical-align: top;
  	  margin:0 .6rem;
  	}

  	@at-root
  	.likeBtn,
  	.downloadBtn,
  	.shareBtn {
  	  color: rgba(white, .8);
  	  font-size: 1.3rem;
  	  vertical-align: top;
  	  margin:0 1.6rem;
  	}

    @at-root
    .hide {
      position:absolute;
      clip: rect(0,0,0,0);
    }
  }
  
}
</style>