<template>
  <div id="app">
    <music-header :currentPage.sync="currentPage"></music-header>
    <page-slider :currentPage.sync="currentPage"></page-slider>
    <mini-player></mini-player>
    <keep-alive>
      <router-view :playerPage.sync="playerPage"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import header from './components/header.vue';
import pageSlider from './components/page-slider.vue';
import miniPlayer from './components/player/mini-player.vue'

export default {
  name: 'app',
  data () {
    return {
      currentPage: 0,
      index: 0,
      playerPage: 0
    };
  },
  components: {
    musicHeader: header,
    pageSlider,
    miniPlayer
  }
};
</script>

<style lang="scss">
@font-face {
  font-family: 'iconfont';  /* project id 386864 */
  src: url('//at.alicdn.com/t/font_386864_xiht2betxbnjyvi.eot');
  src: url('//at.alicdn.com/t/font_386864_xiht2betxbnjyvi.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/font_386864_xiht2betxbnjyvi.woff') format('woff'),
  url('//at.alicdn.com/t/font_386864_xiht2betxbnjyvi.ttf') format('truetype'),
  url('//at.alicdn.com/t/font_386864_xiht2betxbnjyvi.svg#iconfont') format('svg');
}

*{
  margin:0;
  padding: 0;
}

html,
body {
  font-size: 20px;
  background: #111;
  height: 100%;
  overflow: hidden;
}

a {
  text-decoration: none;
}

#app {
  width: 100%;
  height: 100%;
}

.icon {
  font-family: iconfont;
  font-style: normal;
}

</style>
