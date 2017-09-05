<template>
	<div class="recommend">
		<scroll class="scroll" :data="listData" @pullingUp="pullUpLoad" ref="scroll">
			<div class="recommend-content">
				<carousel 
        :carouselData="carouselData" :slider="slider" :currentPage="currentPage"
        @loadend.once="refreshScroll"></carousel>
				<hotlist :musicList="listData"></hotlist>
			</div>
		</scroll>
	</div>
</template>

<script>
import carousel from './carousel.vue'
import hotlist from './hotlist.vue'
import scroll from './base/scroll.vue'

import jsonp from 'jsonp';
import axios from 'axios';
const CAROUSELURL = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg?g_tk=1527565213&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1';
const LISTURL = 'http://112.74.38.137:8080/getHotlist';
const listParams = {
  rnd:Math.random(),
  g_tk:5381,
  jsonpCallback:'getPlaylist',
  loginUin:0,
  hostUin:0,
  format:'json',
  inCharset:'utf8',
  outCharset:'utf-8',
  notice:0,
  platform:'yqq',
  needNewCode:0,
  categoryId:10000000,
  sortId:5,
  sin:0,
  ein:29
}
axios.get('http://112.74.38.137:8080');
export default {

  name: 'recommend',
  props: {
  	slider: {
      type: Object,
      default: null
  	},
    currentPage: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      carouselData: [],
      listData: [],
      pagenum: 0
    };
  },
  created: function(){
  	this.getCarouselData();
  	this.getListData();
  },
  methods: {
  	getCarouselData: function(){
  	  jsonp(CAROUSELURL, {param: 'jsonpCallback'}, (err, data) => {
  	    this.carouselData = data.data.slider;
  	  });
  	},
  	getListData: function(){
      let params = Object.assign({}, listParams, {sin: this.pagenum*30, ein: (this.pagenum+1)*30-1});
  	  axios.get(LISTURL, {params: params}).then((data)=> {
        if(this.listData.length === 0){
          this.listData = data.data.data.list;
        } else {
          for(let list of data.data.data.list) {
            this.listData.push(list);
          }
        }
  	  });
  	},
  	refreshScroll: function(){
      this.$refs.scroll.refresh();
  	},
    pullUpLoad: function() {
      this.pagenum++;
      this.getListData();
    }
  },
  components: {
  	carousel,
  	hotlist,
  	scroll
  }
};
</script>

<style lang="scss" scoped>
.recommend {
  display: inline-block;
  width: 25%;
  height: 100%;
  vertical-align: top;

  @at-root
  .scroll{
  	height: calc(100% - 60px);
  	overflow: hidden;
  }
}


</style>