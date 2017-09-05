<template>
  <header>
  	<div class="header"><i class="icon">&#xe603;</i> WindlikeMusic</div>
  	<div class="menus">
  		<div 
  		class="menu" 
  		v-for="(name, index) of menuNames"
  		@click="active = index;changePage(index)">
  		  <span :class="{activeMenu: active === index}">{{name}}</span>
  		</div>
  	</div>
  </header>
</template>

<script>
export default {

  name: 'header',
  props: {
  	currentPage: {
    	type: Number,
    	default: 0
    }
  },
  data () {
    return {
      menuNames: ['推荐', '热门歌手', '排行', '搜索'],
      active: 0
    };
  },
  methods: {
  	changePage: function(pageIndex){
  	  this.$emit('update:currentPage', pageIndex);
  	}
  },
  watch: {
  	currentPage: function(newVal){
  	  this.active = newVal;
  	}
  }
};
</script>

<style lang="scss" scoped>
header{

	@at-root 
	.header,
	.menus {
	  width: 100%;
	  height: 44px;
	  position: relative;
	  z-index: 2;
	}

	@at-root
	.header {
		background: #333;
		color: #ffcd32;
		font-weight: bold;
		line-height: 44px;
		text-align: center;
	}
	
	@at-root 
	.menus {
	  background: #333;
	  border-bottom: 3px #111 solid;

	  @at-root 
	  .menu {
	  	box-sizing: border-box;
	  	color: rgba(255, 255, 255, .5);
	  	display: inline-block;
	  	font-size: .75em;
	  	height: 44px;
	  	line-height: 44px;
	  	text-align: center;
	  	vertical-align: baseline;
	  	width: 25%;
	  }

	  @at-root 
	  .activeMenu {
	  	border-bottom:2px #ffcd32 solid;
	  	color: #ffcd32;
	  	padding-bottom: 5px;
	  }
	}

}
</style>