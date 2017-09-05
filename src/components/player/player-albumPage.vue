<template>
  <div class="albumPage">
    <transition name="scale" @after-enter="rotate=true" @leave="rotate=false">
      <img 
      class="albumPic" 
      v-show="show"
      v-lazy="currentSong.albumImg_big"
      :class="{rotate: isPlaying && rotate, pause: !isPlaying && rotate}">
    </transition>
    <div class="lyric">{{currentLyric}}</div>
  </div>
</template>

<script>
export default {

  name: 'player-albumPage',
  props: {
  	currentSong: {
  	  type: Object,
  	  default: null
  	},
  	isPlaying: {
  	  type: Boolean,
  	  default: false
  	},
  	show: {
  	  type: Boolean,
  	  default: false
  	},
    currentLyric: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      rotate: false
    };
  }
};
</script>

<style lang="scss" scoped>
.albumPage {
	display: inline-block;
	width: 100%;
	text-align: center;
	align-self: center;
	
	@at-root
	.albumPic {
	  margin: 5% 17.5% 6% 17.5%;
	  border-radius: 50%;
	  width:65%;
	  box-shadow:0 0 0 .5em rgba(white, .2);
	}

	@at-root
	.lyric {
	  color: #00ff83;
	  font-size: .8em;
    margin: auto;
    max-width: 80%;
	}

	@at-root
	.rotate {
		animation:rotate 30s linear infinite;
		-webkit-animation-play-state:running; /* Safari 和 Chrome */
		animation-play-state:running;
	}

	.pause {
		animation:rotate 30s linear infinite;
		-webkit-animation-play-state:paused; /* Safari 和 Chrome */
		animation-play-state:paused;
	}
}

@keyframes rotate {
	from { transform:translate3d(0,0,0) rotate(0deg); }
	to { transform:translate3d(0,0,0) rotate(360deg); }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
  transform: translate3d(0,0,0);
}
.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translate3d(0,0,0);
}

.scale-enter-active, .scale-leave-active {
  transition: transform .6s;
  transform: translate3d(0,0,0);
}
.scale-enter, .scale-leave-to {
  transform: translate3d(-175px, 460px, 0) scale(0.148);
}
</style>