<template>
  <div class="lyricPage">
	<scroll class="scroll" ref="scroll">
	  <div class="lyric-box">
	  	<div 
	  	ref="lyric"
	  	class="lyric" 
	  	:class="{active: index === currentLine}"
	  	v-for="(lyric,index) of lyricParser.lines">{{lyric.txt}}</div>
      <div 
       v-show="lyricParser.lines.length===0 && lyricParser.lrc"
       ref="lyric"
       class="lyric active">{{lyricParser.lrc.replace('[00:00:00]','')}}</div>
	  </div>
  	</scroll>
  </div>
</template>

<script>
import scroll from '../base/scroll.vue'
		
import bus from '../../api/bus.js';
import Lyric from 'lyric-parser';

export default {

  name: 'lyricPage',
  props: {
  	lyric: {
  	  type: String,
  	  default: ''
  	},
  	currentTime: {
  	  type: Number,
  	  default: 0
  	},
  	isPlaying: {
  		type: Boolean,
  		default: false
  	}
  },
  data () {
    return {
      lyricParser: {
      	lines: [],
        lrc: '',
        seek: function(){},
        stop: function(){}
      },
      currentLine: 0
    };
  },
  created() {
  	bus.$on('changeProgress', (time)=> {
  	  if(this.lyricParser.lines.length){
  	    this.lyricParser.seek(time*1000);
  	  }
    });

    this.lyricParser = new Lyric('', ({lineNum, txt})=>{
      this.$nextTick(()=> {
        if(this.$refs.scroll){
          this.$refs.scroll.scrollToElement(this.$refs.lyric[lineNum], 400);
        }
      });
    
      this.currentLine = lineNum;
      this.$emit('updateLyric', this.lyricParser.lines[lineNum].txt);
    });
  },
  methods: {
    getCurrentTime() {
      if(this.currentTime) {
        return Promise.resolve(this.currentTime);
      }

      return new Promise((res, rej)=> {
        setTimeout(()=> {
          res(this.getCurrentTime());
        }, 20);
      });
    }
  },
  watch: {
    /*******************/
    /**                */
    /* update lyric:   */
    /* 1.fullscreen    */
    /* 2.change song   */
    /**                */
    /*******************/
  	lyric(newVal, oldVal) {
      /* change lrc */
      this.lyricParser.stop()
      this.lyricParser.lrc = newVal;
      this.lyricParser.tags = {};
      this.lyricParser.lines = [];
      this.lyricParser.state = 0;
      this.lyricParser.curLine = 0;
      this.lyricParser._init.call(this.lyricParser);

  	  if(oldVal) {
        /* change song */
        this.currentLine = 0;
        this.lyricParser.seek(0);
      } else {
        /* fullscreen */
        this.getCurrentTime().then((currentTime)=> {
          this.lyricParser.seek(currentTime*1000);
          if(!this.isPlaying) {
            this.lyricParser.stop();
          }
        }).catch((err)=> { console.log(err) });
      }

      /* update first lrc */
	  	if(this.lyricParser.lines.length){
        this.$emit('updateLyric', this.lyricParser.lines[this.currentLine].txt);
	  	} else {
        if(this.lyricParser.lines){
          this.$emit('updateLyric', this.lyricParser.lrc.replace('[00:00:00]', ''));
        }
      }
  	},
  	isPlaying(newVal) {
  	  if(newVal === false) {
        this.lyricParser.seek(this.currentTime*1000);
  	  	this.lyricParser.stop();
  	  }
  	}
  },
  components: {
  	scroll
  }
};
</script>

<style lang="scss" scoped>
.lyricPage {
  display: inline-block;
  width: 50%;
  height: 100%;
  margin-top: 45%;
  vertical-align: top;
  align-self: center;
  
  .scroll {
  	height: calc(30% - 2rem);
  	align-self: center;

  	.lyric-box {
  	  
  	  .lyric {
  	  	color: rgba(white, .6);
  	  	font-size: .85rem;
  	  	text-align: center;
  	  	margin: auto;
  	  	margin-bottom: 2rem;
  	  	max-width: 80%;
  	  }

  	  .active {
		color: #00ff83;
  	  }
  	}
  }
  
}
</style>