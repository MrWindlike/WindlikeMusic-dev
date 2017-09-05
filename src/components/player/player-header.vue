<template>
  <div class="header">
  	<i class="exitButton icon" @click="exit">&#xe60d;</i>
	<scrollText 
	class="songName" 
	:data="currentSong.songName" :behavior="'scroll'">{{currentSong.songName}}</scrollText>
	<div class="singer">— {{currentSong.singer}} —</div>
  </div>
</template>

<script>
import scrollText from '../base/scroll-text.vue'
let entry = location.hash;

export default {

  name: 'player-header',
  props: {
  	currentSong: {
  	  type: Object,
  	  default: null
  	},
  	show: {
  	  type: Boolean,
  	  default: false
  	}
  },
  data () {
    return {

    };
  },
  methods: {
  	exit() {
  	  if(entry === '#/') {
  	    window.history.back();
  	  } else {
  	    location.hash = '#/';
  	    entry = '#/';
  	  }
  	}
  },
  components: {
  	scrollText
  }
};
</script>

<style lang="scss" scoped>
.header {
	width: 100%;
	text-align: center;

	@at-root
	.exitButton {
	  position:absolute;
	  top: 0;
	  left:0;
	  color: white;	
	  margin:5% 1rem;
	}

	@at-root
	.songName {
	  color: white;
	  display: inline-block;
	  margin-top: 5%;
	  margin-bottom: 2%;
	  width:calc(100% - 150px);
	  text-align: center;
	}

	@at-root
	.singer {
	  width:60%;
	  color: rgba(white, .8);
	  font-size: .8rem;
	  margin: 0 auto;
	  overflow: hidden;
	  white-space: nowrap;
	  text-overflow: ellipsis;
	}
}
</style>