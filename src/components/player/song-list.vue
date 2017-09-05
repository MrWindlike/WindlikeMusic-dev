<template>
  <transition name="fade">
	  <div class="songList-box">
	  	  <div class="songList-bg" @click="close"></div>
	  	  <transition name="scroll">
			  <div class="songList" v-show="show">
			  	<div class="top-box">
			  	  <i 
			  	  class="playModeBtn icon" 
			  	  v-show="playMode === 0" 
			  	  @click="ctrl('changePlayMode')">&#xe66c;</i><!-- 
			   --><i 
			      class="playModeBtn icon" 
			      v-show="playMode === 1" 
			      @click="ctrl('changePlayMode')">&#xe604;</i><!-- 
			   --><i 
			      class="playModeBtn icon" 
			      v-show="playMode === 2" 
			      @click="ctrl('changePlayMode')">&#xe6f1;</i><!-- 
			   --><div class="playModeText" @click="ctrl('changePlayMode')">{{playModeText}}</div><!-- 
			   --><div class="btn-box">
			  	  	<i class="downloadBtn icon">&#xe606;</i><!-- 
			  	 --><i class="clearBtn icon" @click="toAlert">&#xe602;</i>
			  	  </div>
			  	</div>
				<scroll class="scroll" :data="songList" ref="scroll">
				  	<div class="song-box">
				  	  <div 
				  	  class="song" 
				  	  v-for="(song, index) of songList" :key="song.songid"
				  	  ref="song">
				  	    <i 
				  	     class="playIcon icon" 
				  	     @click="ctrl('play', index)"
				  	    :style="{opacity:currentIndex===index?1:0}">&#xe61a;</i><!-- 
				  	 --><scroll-text 
				  	    class="songMsg-box" 
				  	    :align="'left'"
				  	    :isPlay="currentIndex===index"
				  	    @click="ctrl('play', index)">
							<div 
					  	 	class="songName" 
					  	 	 @click="ctrl('play', index)"
					  	 	:class="{active:currentIndex === index}">{{song.songName}}</div><!-- 
					  	 --><div 
					  	 	class="singer"
					  	 	 @click="ctrl('play', index)"
					  	 	:class="{active:currentIndex === index}"> - {{song.singer}}</div>
				  	  	</scroll-text><!-- 
				  	 --><div class="btn-box">
				  	 	  <i class="likeBtn icon">&#xe6ca;</i><!-- 
					   --><i class="deleteBtn icon" @click.stop="ctrl('deleteSong',index)">&#xe622;</i>
				  	 	</div> 
				  	  </div>
				  	</div>
			  	</scroll>
			  	<div class="closeBtn" @click="close">关闭</div>
			  </div>
		  </transition>
		  <router-view @confirm="ctrl('clear')" :msg="'确定清空所有歌曲？'"></router-view>
	  </div>
  </transition>
</template>

<script>
import scroll from '../base/scroll.vue'
import scrollText from '../base/scroll-text.vue'
let entry = location.hash;
		
import bus from '../../api/bus.js';

const ALLLOOP    = 0,
	  SINGLELOOP = 1,
	  RANDOM     = 2;

export default {

  name: 'song-list',

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
      show: false
    };
  },
  beforeCreate() {
  	bus.$on('props', ([key, value])=> {
  	  this[key] = value;
  	});
  },
  beforeRouteEnter (to ,from, next) {
    next((vm)=> {
      vm.show = true;
      bus.$emit('requestProps');
      vm.$nextTick(()=> {
      	vm.$refs.scroll.refresh();
        if(vm.currentIndex !== -1) {
        	vm.$refs.scroll.scrollToElement(vm.$refs.song[vm.currentIndex], 0);
        }
      });
    });
  },
  beforeRouteLeave (to, from, next) {
    this.show = false;
    next();
  },
  methods: {
  	ctrl(name, ...params) {
  	  if(params) {
  	  	bus.$emit('ctrl', [name,...params]);
  	  } else {
  	  	bus.$emit('ctrl', name);
  	  }
  	},
  	toAlert() {
  	  location.hash = location.hash.replace('songList', 'songList/alert');
  	},
  	close() {
  	  if(entry === '#/' || entry === '') {
  	  	this.show = false;
  	  	window.history.back();
  	  } else {
  	  	location.hash = '#/';
  	  	entry = '#/';
  	  }
  	}
  },
  computed: {
  	playModeText() {
  	  return this.playMode === ALLLOOP ? '循环播放' :
  	  		 this.playMode === SINGLELOOP ? '单曲循环' : '随机播放';
  	}
  },
  watch: {
  	songList(newVal) {
  	  if(newVal.length === 0 && location.hash.indexOf('player') !== -1) {
  	    window.history.go(-2);
  	  }
  	}
  },
  components: {
  	scroll,
  	scrollText,
  }
};
</script>

<style lang="scss" scoped>
.songList-box{
	position: absolute;
	top: 0;
	left: 0;
	height:100%;
	width:100%;
	z-index:3;
    
	@at-root
	.songList-bg {
	  height:100%;
	  width:100%;
	  background:rgba(#111, .5);
	}

    @at-root
	.songList {
	  background: rgba(#333,.8);
	  position: absolute;
	  bottom: 0;
	  left: 0;
	  width: 100%;
	  height: 270px;
	  
	  @at-root
	  .top-box {
	  	height: 20px;
	  	padding:15px 1rem;
	  	border-bottom: 1px rgba(gray, .2) solid;
	  	
	  	@at-root
	  	.playModeBtn,
	  	.playModeText {
	  	  display: inline-block;
	  	  color:rgba(white, .85);
	  	  margin: 0 .2rem;
	  	}
	  	
	  	@at-root
		.btn-box {
		  display: inline-block;
		  float: right;
		  
		  @at-root
		  .downloadBtn,
	  	  .clearBtn {
		    display: inline-block;
	  	    color: rgba(white,.7);
	  	    margin: 0 .5rem;
	  	  }
		}
	  	
	  }
	 
	  @at-root
	  .scroll {
	  	height: 170px;
	  	overflow: hidden;

	  	@at-root
	  	.song-box {
	  		
	  		@at-root
	  		.song {
	  		  height: 1rem;
	  		  padding:.5rem;
	  		  padding-right:1rem;

			  @at-root
			  .playIcon {
			  	display: inline-block;
			  	color:#ffcd32;
			  	font-size: .8rem;
			  	margin:.25rem 0;
			  	margin-right: .5rem;
			  	vertical-align: top;
			  }

	  		  @at-root
	  		  .songMsg-box {
				display: inline-block;
				width:calc(100% - 126px - 1rem);
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				vertical-align: top;

	  		    @at-root
	  		    .songName {
	  		    	color: rgba(white, .85);
	  		    	display: inline-block;
	  		    	font-size: .8rem;
	  		    	margin:0;
	  		    }
	  		    
	  		    @at-root
	  		    .singer {
	  		    	color: rgba(white, .5);
	  		    	display: inline-block;
	  		    	font-size: .6rem;
	  		    }

	  		    @at-root
	  		    .active {
	  		    	color: #ffcd32;
	  		    }
	  		  }
	  		  
	  		  
	  		  @at-root
	  		  .likeBtn,
	  		  .deleteBtn {
	  		  	display: inline-block;
	  		  	font-size: .8rem;
	  		  	color: rgba(white,.5);
	  		  	margin: 0 .6rem;
	  		  }
	  		}
	  	}
	  }
	  
	  
	  @at-root
	  .closeBtn {
	  	color: rgba(white,.85);
		background: rgba(#222, .8);
		height: 50px;
		line-height: 50px;
		text-align: center;
	  }
	}
}

.scroll-enter-active, .scroll-leave-active {
  transition: transform .5s;
  transform: translate3d(0, 0, 0);
}

.scroll-enter, .scroll-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translate3d(0, 270px, 0);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
  transform: translate3d(0, 0, 0);
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translate3d(0, 0, 0);
}
</style>