<template>
  <div class="search-results">
    <div 
    class="result-singer" 
    v-for="singer of searchResults.singer">
      <img 
      v-lazy="'https://y.gtimg.cn/music/photo_new/T001R150x150M000'+singer.mid+'.jpg?max_age=2592000'" 
      class="singerimg"><!-- 
   --><div class="singermsg" @click="toSingerList(singer)">
        <div class="singername">{{singer.name}}</div>
        <div class="singerdata" v-show="singer.songnum">单曲:{{singer.songnum}} 专辑:{{singer.albumnum}}</div>
      </div>
    </div>
    <div class="result-song" v-for="song of searchResults.song.list" @click="play(song)">
      <i class="songicon icon">&#xe680;</i><!-- 
   --><div class="songmsg">
        <div class="songname">{{formatText(song.songname)}}</div>
        <div class="singername">{{formatText(song.singer[0].name)}}</div>
      </div>
    </div>
    <loading v-show="!loadend"></loading>
  </div>
</template>

<script>
import bus from '../../api/bus.js';
import listBus from '../../api/list-bus.js';
import decode from '../../api/decode.js';

import loading from '../base/loading.vue'

export default {

  name: 'search-result',
  props: {
  	searchResults: {
  		type: Object,
  		default: null
  	},
    loadend: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {

    };
  },
  methods: {
  	play(song) {
  	  bus.playSong(song);
  	},
    formatText(text) {
      return decode(text);
    },
    toSingerList(singer) {
      listBus.set(singer, 'singer');
      location.hash = '#/list';
    },
  },
  components: {
    loading
  }
};
</script>

<style lang="scss" scoped>
.search-results {

  @at-root
  .result-song {
    height: 55px;
    width: 100%;

    .songicon {
      display: inline-block;
      color: rgba(white, .4);
      font-size: 22px;
      text-align: center;
      line-height: 40px;
      width: 40px;
      height: 40px;
      margin: 7.5px;
    }

    .songmsg {
      display: inline-block;
      width: calc(90% - 55px);
      vertical-align: top;

      .songname { 
        color: rgba(white, .6);
        font-size: .8rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin: .35rem 0;
      }

      .singername {
        color: rgba(white, .4);
        font-size: .65rem;
      }
    }
  }

  @at-root
  .result-singer {
  	height: 55px;
    width: 100%;

    .singerimg {
      border-radius: 50%;
      color:rgba(white, .4);
      display: inline-block;
      width: 40px;
      height: 40px;
      margin: 7.5px;
    }

    .singermsg {
	  display: inline-block;
	  width: calc(90% - 55px);
      vertical-align: top;

      .singername {
      	color: rgba(white, .6);
      	font-size: .8rem;
      	margin: .35rem 0;
      }

      .singerdata {
		color: rgba(white, .4);
        font-size: .65rem;
      }

    }
  }
}
</style>