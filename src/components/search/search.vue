<template>
  <div class="search" @touchend="blur">
    <div class="search-box">
      <input type="text" class="search-input" placeholder="搜索歌曲,歌手" 
      v-model.trim="searchText" ref="input">
      <div 
      v-show="searchText"
      @click="searchText=''"
      class="close-icon icon">&#xe622;</div>
    </div>
    <scroll 
    @pullingUp="pullUpLoad"
    class="scroll needsclick" 
    :data="searchResults.song.list" :click="true"
    :pullUpLoad="true"
    v-show="searchText && currentPage === 3">
      <search-result :searchResults="searchResults" :loadend="loadend"></search-result>
    </scroll>
    <div class="hotsearch-group">
      <div class="title">热门搜索</div>
      <div 
      class="searchname special" 
      v-if="hotSearchData.special_key"
      @touchend="searchText=hotSearchData.special_key.trim()">{{hotSearchData.special_key}}</div><!-- 
   --><div class="searchname"
      v-if="index < 9"
      v-for="(text,index) of hotSearchData.hotkey"
      @touchend="searchText=text.k.trim()">{{text.k}}</div>
    </div>
  </div>
</template>

<script>
import scroll from '../base/scroll.vue'
import searchResult from './search-result.vue'
    

import jsonp from 'jsonp';
const HOTURL = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&_=1502855869973';
const SEARCHPAGE = 3;

export default {

  name: 'search',
  props: {
    currentPage: {
      type: Number,
      default: 0
    },
    slider: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      hotSearchData: {
        hotkey: null,
        special_key: null
      },
      searchResults: {
        song: {
          list: null
        },
        zhida: {
          type: null
        }
      },
      page: 1,
      total: 0,
      loadend: false,
      searchText: null
    };
  },
  methods: {
    blur() {
      this.$refs.input.blur();
    },
    search(word) {
      const SEARCHURL = `https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp?g_tk=5381&uin=0&format=jsonp&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&w=${encodeURI(word)}&zhidaqu=1&catZhida=1&t=0&flag=1&ie=utf-8&sem=1&aggr=0&perpage=20&n=20&p=${this.page}&remoteplace=txt.mqq.all&_=1502862347761`;
      const SEARCHSINGERURL = `https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg?is_xml=0&format=jsonp&key=${encodeURI(word)}&g_tk=5381&jsonpCallback=SmartboxKeysCallbackmod_search169&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0`;

      let promise = new Promise((resolve, reject)=> {
        jsonp(SEARCHURL, {param: 'jsonpCallback'}, (err, data)=>{
          if(data.code === 0){
            this.total = data.data.song.totalnum;

            if(this.searchResults.song.list) {
              for(let song of data.data.song.list){
                this.searchResults.song.list.push(song);
              }
            } else {
              this.searchResults = data.data;
            }

            resolve(data.data.zhida);
          }
        });
      });

      promise.then((firstSinger)=> {
        jsonp(SEARCHSINGERURL, {param: 'jsonpCallback'}, (err, data)=>{
          if(firstSinger.type === 0) {
            return ;
          }
          
          let singers = [];

          singers[0] = {
            mid: firstSinger.singermid,
            name: firstSinger.singername,
            songnum: firstSinger.songnum,
            albumnum: firstSinger.songnum
          };
          if(data.data.singer) {
            for(let singer of data.data.singer.itemlist) {
              if(singer.mid !== singers[0].mid){
                singers.push(singer);
              }
            }
          }

          this.$set(this.searchResults, 'singer', singers);
        });
      }).catch((err)=> { console.log(err) });

    },
    pullUpLoad() {
      if(this.total - this.page*20 > 0){
        this.page++;
        this.search(this.searchText);
      } else {
        this.loadend = true;
      }
    }
  },
  watch: {
    currentPage(newVal) {
      if(newVal === SEARCHPAGE) {
        /* init data */
        if(this.hotSearchData.hotkey === null) {
          jsonp(HOTURL, {param: 'jsonpCallback'}, (err, data)=> {
            if(data.code === 0) {
              this.hotSearchData = data.data;
            }
          });
        }

        /* disable slider */
        if(this.searchText) {
          this.slider.disable();
        }
        
      } else {
        this.slider.enable();
      }
    },
    searchText(newVal) {
      this.page = 1;
      this.loadend = false;

      if(newVal) {
        this.searchResults = {
          song: {
            list: null
          },
          zhida: {
            type: null
          }
        };
        this.search(newVal);
        this.slider.disable();
      } else {
        this.total = 0;
        this.slider.enable();
      }
    }
  },
  components: {
    scroll,
    searchResult
  }
};
</script>

<style lang="scss" scoped>
.search {
  position: relative;
  display: inline-block;
  height: 100vh;
  width: 25%;
  vertical-align: top;

  @at-root
  .search-box {
    display: relative;

    @at-root
    .search-input {
      box-sizing: border-box;
      border-radius: .3rem;
      color:rgba(white, .5);
      font-size: .8rem;
      height: 40px;
      width: 95%;
      background: #222;
      padding:0 1rem;
      margin:1rem 2.5%;
      outline: 0;
      border:0;

      &:focus {
        background: #333;
      }
    }

    @at-root
    .close-icon {
      color: white;
      font-size: .8em;
      position:absolute;
      top: 1.8em;
      right: 1rem;
      width: 1.2rem;
      height: 1.2rem;
      background: #444;
      text-align: center;
      line-height: 1.3em;
      border-radius:50%;
    }
  }

  

  @at-root
  .scroll {
    background: #222;
    position: fixed;
    width:25%;
    top:80px;
    bottom: 60px;
    overflow: hidden;
  }
  

  @at-root
  .hotsearch-group {
    width:90%;
    margin:0 5%;
    @at-root
    .title {
      color: rgba(white, .6);
      font-size: .75em;
      margin-bottom: .5rem;
    }

    @at-root
    .searchname {
      color: rgba(white, .4);
      background: #333;
      border-radius: .2rem;
      display: inline-block;
      font-size: .7rem;
      margin: .3rem;
      padding: .3rem.5rem;
    }

    @at-root
    .special {
      color: rgba(#ffcd32, .8);
    }
  }
}
</style>