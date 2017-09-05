import decode from '../api/decode.js';

export default function(song) {
  this.songid = song.songid;
  this.songmid = song.songmid;
  this.albummid = song.albummid;
  this.albumImg_small = `https://y.gtimg.cn/music/photo_new/T002R68x68M000${song.albummid}.jpg?max_age=2592000`;
  this.albumImg_big = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${song.albummid}.jpg?max_age=2592000`;
  this.albumname = decode(song.albumname);
  this.songUrl = `http://ws.stream.qqmusic.qq.com/${song.songid}.m4a?fromtag=46`;
  this.songName = decode(song.songname);
  this.singer = '';
  song.singer.forEach((singer, index)=> {
    if(index > 0){
      this.singer += '&';
    }
  	this.singer += decode(singer.name);
  });
  this.currentTime = 0;
};