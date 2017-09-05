<template>
	<div class="rank">
    <loading v-show="loading"></loading>
    <scroll class="scroll" :data="rankData">
      <div>
        <div class="rank-box" v-for="(rank, index) of rankData" @click="toRankList(index)">
          <img v-lazy="rank.picUrl" alt="" class="rank-img"><!-- 
       --><div class="rank-text">
            <div class="rank-title">{{rank.topTitle}}</div>
            <div class="music" v-for="(song,index) of rank.songList">{{index+1}} {{song.songname}} - {{song.singername}}</div>
          </div>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import scroll from './base/scroll.vue'
import loading from './base/loading.vue'
    
import listBus from '../api/list-bus.js'

import jsonp from 'jsonp';
const URL = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg?g_tk=5381&uin=0&format=jsonp&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&_=1502811630866';
const RANKPAGE = 2;

export default {

  name: 'rank',
  props: {
    currentPage: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      rankData: null,
      loading: true
    };
  },
  methods: {
    getData() {
      jsonp(URL, {param: 'jsonpCallback'}, (err, data)=> {
        if(err === null && data.code === 0){
          this.rankData = data.data.topList;
          this.loading = false;
        }
      })
    },
    toRankList(index) {
      listBus.set(this.rankData[index], 'rank');
      location.hash = '#/list';
    }
  },
  watch: {
    currentPage(newVal) {
      if(newVal === RANKPAGE && this.rankData === null){
        this.getData();
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
.rank {
  display: inline-block;
  width: 25%;
  vertical-align: top;

  @at-root
  .scroll {
    width: 100%;
    height: calc(100vh - 148px - 1.6em);

    @at-root
    .rank-box {
      display: block;
      background: #222;
      height: 5.5em;
      margin: .8em 2.5%;
      width: 95%;

      @at-root
      .rank-img {
        display: inline-block;
        height: 5.5em;
        width: 5.5em;
      }

      @at-root
      .rank-text {
        display: inline-block;
        vertical-align: top;
        margin-left: 1em;
        width: calc(100% - 5.5em - 1em);

        @at-root
        .rank-title {
          color: rgba(white, .7);
          font-size: .8em;
          margin-top: .5em;
          margin-bottom: .5em;
          vertical-align: top;
        }

        @at-root
        .music {
          color: rgba(white, .6);
          font-size: .7em;
          padding: .25em 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          
          &:first-letter {
            color: rgba(white, .9);
          }
        }
      }

      
    }
  }
}
</style>