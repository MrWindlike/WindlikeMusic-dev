/**
/* 若要改变页面数
/* 请修改
/* page-slider.vue: .slider的width为页面数*100%
/* 各页面组件的width为(100%/页面数)
/*

<template>
  <div class="slider-wrap">
    <div class="slider">
      <recommend :slider="slider" :currentPage="currentPage"></recommend><!-- 
   --><singer :currentPage="currentPage"></singer><!-- 
   --><rank :currentPage="currentPage"></rank><!-- 
   --><search :currentPage="currentPage" :slider="slider"></search>
    </div>
  </div>
</template>

<script>
import recommend from './recommend.vue';
import singer from './singer.vue';
import rank from './rank.vue';
import search from './search/search.vue';

import BetterScroll from 'better-scroll'

export default {

  name: 'page-slider',
  props: {
    currentPage: {
    	type: Number,
    	default: 0
    }
  },
  data () {
    return {
      slider: null
    };
  },
  mounted: function(){
  	setTimeout(()=>{
  	  this.initPageSlider();
  	}, 20);
  },
  methods: {
  	initPageSlider: function(){
      this.slider = new BetterScroll(this.$el, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        bounce: false,
        snap: true,
        snapLoop: false,
        snapThreshold: 0.3,
        snapSpeed: 400
  	  });

  	  this.slider.on('scrollEnd', ()=>{
        this.$emit('update:currentPage', this.slider.getCurrentPage().pageX);
  	  });
  	}
  },
  watch: {
  	currentPage: function(newVal){
      this.slider.goToPage(newVal, 0, 400);
  	}
  },
  components: {
  	recommend,
    singer,
    rank,
    search
  }
};
</script>

<style lang="scss" scoped>
.slider-wrap {
  width: 100%;
  height: calc(100vh - 88px);

  @at-root
  .slider {
  	height: 100%;
    width: 400%;
  }

}
</style>