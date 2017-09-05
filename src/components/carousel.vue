<template>
	<div class="carousel">
		<div class="carousel-group" :style="{ width: pageWidth*pageLength + 'px' }">
			<a 
			class="carousel-item"
			:style="{ width: 100 / pageLength + '%' }"
			v-for="data of carouselData"
			:href="data.linkUrl">
				<img 
        @load.once="loadend"
				class="image"
				:src="data.picUrl">
			</a>
		</div>
		<div class="dot-group">
			<div 
			class="dot" 
			:class="{active: pageIndex === index}"
			v-for="(dot, index) of dotLength"></div>
		</div>
	</div>
</template>

<script>
import betterScroll from 'better-scroll';

const RECOMMENTPAGE = 0;

export default {

  name: 'carousel',
  props: {
    carouselData: {
      type: Array,
      default: null
    },
    slider: {
      type: Object,
      default: null
    },
    interval: {
      type: Number,
      default: 4000
    },
    autoPlay: {
	  type: Boolean,
	  default: true
    },
    loop: {
      type: Boolean,
      default: true
    },
    currentPage: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      dotLength: 0,
      pageWidth: 0,
      pageLength: 0,
      pageIndex: 0,
      timer: null,
      carousel: null
    };
  },
  watch: {
    carouselData: function(){
      if(this.carousel) {
        this.carousel.refresh();
      } else {
        setTimeout(()=>{
          this.initCarousel();
        }, 20);
      }
    },
    currentPage: function(newVal){
      if(newVal === RECOMMENTPAGE) {
        this.play();
      } else {
        this.stop();
      }
    }
  },
  methods: {
    initCarousel: function() {
    	/* init length */
    	this.dotLength = this.carouselData.length;
    	this.pageLength = this.loop ? 
    					  this.carouselData.length + 2 :
    					  this.carouselData.length;

    	/* init page width */
    	this.pageWidth = this.$el.clientWidth;

    	this.$nextTick(() => {
    	  /* init carousel scroll events */
    	  this.carousel = new betterScroll(this.$el, {
		      scrollX: true,
		      scrollY: false,
		      momentum: false,
		      snap: true,
		      snapLoop: this.loop,
		      snapThreshold: 0.3,
		      snapSpeed: 400,
          click: true
    	  });

    	  this.carousel.on('scrollEnd', () => {
          this.slider.enable();
    	  	if(this.loop) {
	    	    this.pageIndex = this.carousel.getCurrentPage().pageX - 1;
    	  	} else {
    	  	  this.pageIndex = this.carousel.getCurrentPage().pageX;
    	  	}

    	  	if(this.autoPlay) {
    	  		this.play();
    	  	}
    	  });

    	  this.carousel.on('beforeScrollStart', () => {
          this.slider.disable();
    	    if (this.autoPlay) {
    	      clearTimeout(this.timer);
    	    }
    	  });
    	});

    	/* play */
    	this.play();
    },
    play: function() {
      let pageIndex = this.loop ? this.pageIndex + 2 : this.pageIndex + 1;
	  this.timer = setTimeout(() => {
        this.carousel.goToPage(pageIndex, 0, 400)
      }, this.interval)
    },
    stop: function(){
      clearTimeout(this.timer);
    },
    loadend: function(){
      this.$emit('loadend');
    }
  }
};
</script>

<style lang="scss" scoped>
.carousel {
  width: 100%;
  position: relative;

  @at-root
  .carousel-group {
  	line-height: 0;
	width: 700%;
	
	@at-root
	.carousel-item {
	  display: inline-block;
	  line-height: 0;
	  width: calc(100% / 7);
	  position: relative;

	  @at-root
	  .image {
	  	width: 100%;
	  }
	}

  	@at-root
  	.dot-group {
  		left: 50%;
  		bottom: 5%;
  		transform: translate(-50%);
  		position: absolute;

  		@at-root
  		.dot {
  			border-radius: 50%;
  			background: rgba(255, 255, 255, .5);
  			display: inline-block;
  			margin: 0 3px;
  			height: 8px;
  			width: 8px;
  			z-index: 1;
  		}

  		@at-root
  		.active {
  			border-radius: 4px;
  			background: rgba(255, 255, 255, .8);
  			width: 16px;
  		}
  	}
  }
  
}
</style>