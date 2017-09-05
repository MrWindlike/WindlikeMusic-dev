<template>
	<div class="hotlist">
		<div class="title">热门歌单推荐</div>
		<div class="list-group">
			<div class="list" v-for="list of musicList" @click="toDissList(list)">
				<img class="musicImg" v-lazy="list.imgurl">
				<span class="message">
					<div class="listName">{{list.dissname}}</div>
					<div class="listIntroduct">{{list.creator.name}}</div>
				</span>
			</div>
			<loading></loading>
		</div>
	</div>
</template>

<script>
import loading from './base/loading.vue'

import listBus from '../api/list-bus.js'

export default {

  name: 'hotlist',
  props: {
  	musicList: {
  	  type: Array,
  	  default: null
  	}
  },
  data () {
    return {
      
    };
  },
  methods: {
  	toDissList(list) {
  	  listBus.set(list, 'diss');
  	  location.hash = '#/list';
  	}
  },
  components: {
  	loading
  }
};
</script>

<style lang="scss" scoped>
.hotlist {
  width: 100%;

  @at-root
  .loadingContaner {
  	margin: 2em;
  }

  @at-root
  .title {
  	background: #000;
  	color: #ffcd32;
  	font-size: .7em;
  	width: 100%;
  	height: 61px;
  	line-height: 61px;
  	text-align: center;
  }

  @at-root
  .list-group {

  	@at-root
  	.list {
  	  box-sizing: border-box;
	  width: 100%;
	  padding: 10px 20px;
	  border-bottom: 2px rgba(gray, .1) solid;

	  @at-root
	  .musicImg {
	  	height: 60px;
        width: 60px;
	  }

	  @at-root
	  .message {
	  	display: inline-block;
	  	margin: 10px 5px;
	  	width: calc(100% - 90px);
	  	vertical-align: top;
	  }

	  @at-root
	  .listName {
	  	color: rgb(232, 233, 234);
	  	font-size: .7em;
	  	margin-bottom: 10px;
	  }

	  @at-root
	  .listIntroduct {
	  	color: rgba(232, 233, 234, .7);
	  	font-size: .65em;
	  }
  	}
  }
}
</style>