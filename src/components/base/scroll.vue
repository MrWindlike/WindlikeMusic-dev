<template>
  <div>
  	<slot></slot>
  </div>
</template>

<script>
import BetterScroll from 'better-scroll';
export default {

  name: 'scroll',
  
  props: {
  	probeType: {
  		type: Number,
  		default: 1
  	},
    scrollY: {
      type: Boolean,
      default: true
    },
    scrollX: {
      type: Boolean,
      default: true
    },
  	click: {
  		type: Boolean,
  		default: true
  	},
    bounce: {
      type: Boolean,
      default: true
    },
    snap: {
      type: Boolean,
      default: false
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    },
  	data: {
  		type: [Array, Object],
  		default: null
  	}
  },
  data () {
    return {
      scroll: null,
      eventList: []
    };
  },
  mounted: function(){
  	setTimeout(() => {
  	  this.initScroll();
  	}, 20);
  },
  methods: {
    initScroll: function(){
      this.scroll = new BetterScroll(this.$el, {
      	probeType: this.probeType,
      	click: this.click,
        snap: this.snap,
        scrollX: this.scrollX,
        scrollY: this.scrollY,
        bounce: this.bounce,
        pullUpLoad: this.pullUpLoad,
        threshold: 0
      });
      
      this.scroll.on('scroll', (pos)=> {
        this.$emit('scroll', pos);
      });

      this.scroll.on('scrollEnd', ()=> {
        if(this.scroll.y <= this.scroll.maxScrollY + 50){
          this.$emit('pullingUp');
          this.scroll.refresh();
        }
      });
    },
    refresh: function(){
      if(this.scroll) {
        this.scroll.refresh();
      } else {
        this.eventList.push(['refresh']);
      }
      
    },
    getCurrentPage: function(){
      if(this.scroll){
        return this.scroll.getCurrentPage();
      }
    },
    scrollToElement: function(el, time, offsetX, offsetY, easing){
      if(this.scroll) {
        this.scroll.scrollToElement(el, time, offsetX, offsetY, easing);
      } else {
        this.eventList.push(['scrollToElement', el, time, offsetX, offsetY, easing]);
      }
      
    }
  },
  watch: {
  	data: function(){
  	  this.$nextTick(()=>{
  	  	this.scroll && this.scroll.refresh();
  	  });
  	},
    scroll: function() {
      this.eventList.forEach((event)=> {
        let [e, ...params] = event;
        this[e](...params);
      })
    }
  }
};
</script>

<style lang="css" scoped>
</style>