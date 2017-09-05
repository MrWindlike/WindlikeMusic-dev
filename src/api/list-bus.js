import Vue from 'Vue';

let bus = new Vue({
  data: {
  	data: {}
  },
  methods: {
  	set(data, type) {
      this.data = data;
      this.data.type = type;
    },
    get() {
      return this.data;
    }
  }
});

export default bus;