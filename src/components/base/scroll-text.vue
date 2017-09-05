<template>
<div 
class="marquee"
:style="{textAlign:align}"
@click="click"
@touchend="touchend">
  <div class="scroll">
    <slot></slot>
  </div>
</div>
  
</template>

<script>
import TextScroll from '../../api/TextScroll.js'

export default {

  name: 'scroll-text',
  props: {
  	data: {
  		default: null
  	},
    behavior: {
      type: String,
      default: 'alternate'
    },
    scrollamount: {
      type: Number,
      default: 0.5
    },
    align: {
      type: String,
      default: 'center'
    },
    isPlay: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      textScroll: null
    };
  },
  mounted() {
    this.textScroll = new TextScroll(this.$el, this.behavior, this.scrollamount);
    if(!this.isPlay) {
      this.textScroll.pause();
    }
  },
  methods: {
    click() {
      this.$emit('click');
    },
    touchend() {
      this.$emit('touchend');
    }
  },
  watch: {
  	data(newVal) {
  	  this.$nextTick(()=>{
  	  	this.textScroll.update();
  	  });
  	},
    isPlay(newVal) {
      this.$nextTick(()=>{
        if(newVal) {
          this.textScroll.update();
        } else {
          this.textScroll.pause();
        }
        
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.marquee {
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
  vertical-align: top;

  @at-root
  .scroll {
  	display: inline-block;
  	vertical-align: top;
    margin: 0 auto;
  }
}
</style>