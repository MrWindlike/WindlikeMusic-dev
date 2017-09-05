import Vue from 'Vue';
import Song from '../class/song.js';

let bus = new Vue({});

bus.playSong = function(song) {
  this.$emit('play', new Song(song));
}

export default bus;