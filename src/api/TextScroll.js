export default class TextScroll {
  constructor(el, behavior, speed) {
    if(el){
      this.el = el;
    } else {
      throw new Error('Request a element as a param!');
    }

    this.options = {
      behavior: behavior || 'alternate',
      speed: speed || 0.5
    };

    this._init();
  }

  _init() {
  	const LEFT  = 0,
  	      RIGHT = 1;

  	let childrenWidth = 0, childrenNum = this.el.children.length;

    Array.from(this.el.children).forEach((child)=> {
  	  childrenWidth += child.clientWidth;
  	});

  	if(childrenWidth > this.el.clientWidth) {
      this.isPlay = true;
  	  this.direction = LEFT;
      this.position = 0;
      this.childrenNum = childrenNum;
  	  this.childrenWidth = childrenWidth;

  	  if(this[this.options.behavior]) {
  	    this[this.options.behavior]();

  	  } else {
  	  	throw new Error('Wrong behavior!')
  	  }
  	}
  }

  _run() {
    Array.from(this.el.children).forEach((child)=> {
      child.style.transform = `translate3d(${this.position}px, 0, 0)`;
    });
    
  }

  alternate() {
  	const LEFT  = 0,
  	      RIGHT = 1;
        
    if(this.direction === LEFT && this.position <= this.el.clientWidth - this.childrenWidth) {
      this.direction = RIGHT;
    } else if(this.direction === RIGHT && this.position >= 0) {
      this.direction = LEFT;
    }

    if(this.direction === LEFT) {
      this.position -= this.options.speed;
    } else {
      this.position += this.options.speed;
    }

    this._run();

    this.animator = requestAnimationFrame( () => {this.alternate()} );
  }

  scroll() {
    if(this.position <= -this.childrenWidth) {
      this.position = this.el.clientWidth;
    } else {
      this.position -= this.options.speed;
    }


    this._run();

    this.animator = requestAnimationFrame( () => {this.scroll()} );
  }

  update() {
    this.pause();
    this.position = 0;
    this._run();
    this._init();
  }

  play() {
    if(this.isPlay === false) {
      this.isPlay = true;
      cancelAnimationFrame(this.animator);
      this.animator = requestAnimationFrame( () => {this[this.options.behavior]()} );
    }
    
  }

  pause() {
    this.isPlay = false;
    cancelAnimationFrame(this.animator);
  }
}