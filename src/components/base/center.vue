<template>
  <div class="center">
  	<div class="bg"></div>
  	<slot></slot>
  </div>
</template>

<script>
export default {

  name: 'center',

  data () {
    return {

    };
  }
};
</script>

<style lang="scss" scoped>
.center {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  @at-root
  .bg {
  	width: 100%;
  	height: 100%;
  	background: rgba(black, .65);
  }
}
</style>