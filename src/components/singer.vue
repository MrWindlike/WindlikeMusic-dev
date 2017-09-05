<template>
	<div class="singer">
		<loading v-show="loading"></loading>
		<div class="topTag" v-show="showTopTag" :style="{top: topTagPos+'px'}">{{topTag}}</div>
		<scroll 
		class="scroll" 
		@scroll="scroll"
		@scrollend="scrolling=false;"
		:data="singers" :probeType="3"  :click="true" 
		:isListenScroll="true"
		ref="scroll">
			<div>
				<div class="sort" v-for="(sorts, tag) of singers" ref="sorts">
					<div class="tag">{{tag === 'hot' ? '热门' : tag === 'other' ? '#' : tag}}</div>
					<div class="singerMsg" v-for="singer of sorts" @click="toSingerList(singer)">
						<img v-lazy="singer.img" alt="" class="singerImg"><!-- 
					 --><div class="singerName">{{singer.name}}</div>
					</div>
				</div>
			</div>
		</scroll>
		<div class="index-group">
			<div class="index" 
			v-for="(sorts, tag, i) of singers" 
			@touchstart="scrolling=false;touchStartIndex=index=i;touchStartY=$event.touches[0].pageY"
			@touchmove="scrolling=false;touchNowY=$event.touches[0].pageY"
			@touchend="touchStartIndex=index"
			ref="indexs"
			:class="{active: index === i}">{{tag === 'hot' ? '热' : tag === 'other' ? '#' : tag}}</div>
		</div>
	</div>
</template>

<script>
import jsonp from 'jsonp';
import listBus from '../api/list-bus.js'

import scroll from './base/scroll.vue'
import loading from './base/loading.vue'
		
const URL = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg?channel=singer&page=list&key=all_all_all&pagesize=100&pagenum=1&g_tk=5381&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0';
const SINGERPAGE = 1;

export default {

  name: 'singer',
  props: {
    currentPage: {
    	type: Number,
    	default: 0
    },
    singerPageNum: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      singers: null,
      index: 0,
      sortHeights: [],
      touchStartIndex: 0,
      touchStartY: 0,
      touchNowY: 0,
      loading: true,
      scrolling: false,
      showTopTag: false,
      topTagPos: 0
    };
  },
  methods: {
    getData: function(){
      jsonp(URL, {param: 'jsonpCallback'}, (err, data)=> {
        if(data.code === 0){
          this.initSingers(data.data.list);
          this.loading = false;
        }
      });
    },
    initSingers: function(singersData){
      let singers = {};

      singers.hot = [];
      
      const LASTINDEX = 'Z'.charCodeAt();

      for(let index = 'A'.charCodeAt(); index <= LASTINDEX; index++){
      	singers[String.fromCharCode(index)] = [];
      }
      singers.other = [];

      this.sortSingers(singers, singersData);

      this.$nextTick(()=> {
      	this.getSortHeights();
      });
      
    },
    sortSingers: function(singers, singersData){
      /* add hot singers */
      for(let i = 0;i < 10;i++) {
      	singers.hot[i] = this.getSingerMsg(singersData[i]);
      }

      /* add and sort all singers */
      singersData.forEach((singer)=> {
      	let singerMsg = this.getSingerMsg(singer);
      	if('A' <= singerMsg.index && singerMsg.index <= 'Z'){
      	  if(!singers[singerMsg.index]){
      	  	singers[singerMsg.index] = [];
      	  }
      	  singers[singerMsg.index].push(singerMsg);
      	} else {
      	  singers.other.push(singerMsg);
      	}
      });

      for(let key in singers){
      	if(singers[key].length === 0){
      	  delete singers[key];
      	}
      }
      
      this.singers = singers;
      
    },
    getSingerMsg: function(singer){
      return {
      	rank: singer.Fsort,
      	index: singer.Findex,
      	name: singer.Fsinger_name,
        singermid: singer.Fsinger_mid,
      	img: `https://y.gtimg.cn/music/photo_new/T001R150x150M000${singer.Fsinger_mid}.jpg?max_age=2592000`
      };
    },
    getSortHeights: function(){
      let height = 0;
      this.$refs.sorts.forEach((sort)=> {
      	height += sort.clientHeight;
      	this.sortHeights.push(height);
      });
    },
    toSingerList: function(singer) {
      listBus.set(singer, 'singer');
      location.hash = '#/list';
    },
    scroll: function(pos){
      let posY = pos.y;
      this.scrolling = true;

      
      for(let [index, height] of this.sortHeights.entries()){
      	/* change top tag */
      	if(height + posY <= 20 && height + posY >= 0) {
      	  this.topTagPos = height + parseInt(posY) - 20;
      	} else {
      	  this.topTagPos = 0;
      	}

      	/* change index */
      	if(index >= this.index && posY <= -height){
      	  this.index = index + 1;
      	  break;
      	} else if(index <= this.index && posY >= -height) {
      	  this.index = index;
      	  break;
      	} 

      }

      /* hide top tag */
      this.showTopTag = posY > 0 ? false : true;
    }
    
  },
  computed: {
  	topTag: function(){
  	  if(this.singers){
  	  	let topTag = Object.keys(this.singers)[this.index];
  	  	
  	    return topTag === 'hot' ? '热门' : topTag === 'other' ? '#' : topTag
  	  }
  	}
  },
  watch: {
  	currentPage: function(newVal){
  	  if(newVal === SINGERPAGE && this.singers === null) {
        this.getData();
  	  }
  	},
  	touchNowY: function(newVal){
      let num = (newVal - this.touchStartY)/16.5;
      const length = Object.getOwnPropertyNames(this.singers).length;

      if(this.touchStartIndex + parseInt(num) < 0){
      	this.index = 0;
      } else if(this.touchStartIndex + parseInt(num) >= length - 1){
      	this.index = length - 2;
      } else{
      	this.index = this.touchStartIndex + parseInt(num);
      }
      
  	},
  	index: function(newVal){
  	  if(this.scrolling === false){
  	    this.$refs.scroll.scrollToElement(this.$refs.sorts[newVal], 0);
	  }
  	}
  },
  components: {
  	scroll,
  	loading
  }
};
</script>

<style lang="scss" scoped>
.singer {
	display: inline-block;
	position:relative;
	width: 25%;

	@at-root
	.topTag {
		position: absolute;
		top: 0;
		left: 0;
		background: #222;
		box-sizing: border-box;
		color: rgba(255, 255 ,255 ,.5);
		font-size: .65em;
		height: 20px;
		width: 100%;
		margin-bottom: 10px;
		line-height: 20px;
		padding-left: 1.5em;
		z-index: 2;
	}

	@at-root
	.scroll {
		height: calc(100vh - 148px);
		

		@at-root
		.sort {
			padding-bottom: 20px;

			@at-root
			.tag {
				background: #222;
				box-sizing: border-box;
				color: rgba(255, 255 ,255 ,.5);
				font-size: .65em;
				height: 20px;
				margin-bottom: 10px;
				line-height: 20px;
				padding-left: 1.5em;
			}

			@at-root
			.singerMsg {
				height: 70px;
				width: 100%;

				@at-root
				.singerImg {
					border-radius: 50%;
					height: 50px;
					margin: 10px 25px;
					width: 50px;
				}

				@at-root
				.singerName {
					color: rgba(white, .5);
					display: inline-block;
					font-size: .7em;
					line-height: 70px;
					vertical-align: top;
				}
			}
		}
	}

	@at-root
	.index-group {
		background: rgba(black, .5);
		border-radius: 20px;
		padding: .5rem 0;
		position: absolute;
		right: 0;
		top: 50%;
		transform: translate(0, -50%);
		z-index: 3;

		@at-root
		.index {
			font-size: .6rem;
			color: rgba(white, .5);
			padding:.1em .25rem;
			text-align: center;
		}

		@at-root
		.active {
			color: #ffcd32;
		}
	}
	
}
</style>