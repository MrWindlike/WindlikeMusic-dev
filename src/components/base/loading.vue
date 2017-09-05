<template>
	<div class="loading">
		<img src="../../assets/loading.gif" alt="" class="loadingImg">
		<div class="text">加载中...</div>
	</div>
</template>

<script>
export default {

  name: 'loading',

  data () {
    return {

    };
  }
};
</script>

<style lang="scss" scoped>
.loading {
	text-align: center;

	@at-root
	.loadingImg {
		width: 1.2em;
		height: 1.2em;
		margin: .2em 0;
	}

	@at-root
	.text {
		font-size: .7em;
		color: gray;
	}
}
</style>