<template>
  <transition name="fade">
    <center>
          <transition name="scale">
            <div class="alert-box" v-show="show">
              <div class="text">{{msg}}</div>
              <div class="button-box">
                <div class="cancel-Btn" @click="cancel" v-show="type === 0">取消</div>
                <div class="confirm-Btn" @click="confirm">确定</div>
              </div>
            </div>
          </transition>
    </center>
  </transition>
</template>

<script>
import center from './center.vue'

let entry = location.hash;

export default {

  name: 'alert',
  props: {
    // type:
    // 0: 取消-确定
    // 1: 确定
    type: {
      type: Number,
      default: 0
    },
    msg: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      show: false
    };
  },
  beforeRouteEnter (to ,from, next) {
    next((vm)=> {
      vm.show = true;
    });
  },
  methods: {
  	cancel() {
  	 if(entry === '#/' || entry === '') {
  	 	this.show = false;
  	 	window.history.back();
  	 } else {
  	 	location.hash = '#/';
  	 	entry = '#/';
  	 }
  	},
  	confirm() {
  	  this.$emit('confirm');
  	  this.cancel();
  	}
  },
  components: {
    center
  }
};
</script>

<style lang="scss" scoped>
.alert-box {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background: #222;
	border-radius: 5px;
	transition: transform .15s;

	@at-root
	.text {
	  border-top: .2rem #ffcd32 solid;
	  border-top-left-radius: 5px;
	  border-top-right-radius: 5px;
    padding:1.5rem 2rem;
    color: rgba(white, .8);
    font-size: .9rem;
    white-space: pre;
	}

	@at-root
	.button-box {
  display: flex;
  

	  @at-root
	  .cancel-Btn,
	  .confirm-Btn {
	  	display: inline-block;
	flex: 1;
	font-size: .8rem;
	padding: .65rem 0;
	text-align: center;
	color: #DDD;
	border-top: 1px #DDD solid;
	  }

	  .cancel-Btn {
	  	color: #ffcd32;
	  	border-right: 1px #DDD solid;
	  }
	}
}


.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
  transform: translate3d(0,0,0);
}
.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translate3d(0,0,0);
}

.scale-enter-active, .scale-leave-active {
  transition: transform .2s;
  transform: translate3d(-50%, -50%,0)  scale(1.1);
}
.scale-enter, .scale-leave-to {
  transform-origin: 50% 50%;
  transform: translate3d(-50%, -50%,0) scale(0.1);
}
</style>