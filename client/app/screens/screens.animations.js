import { TweenMax } from 'gsap';

export function layer() {
  return {
    enter(element, done) {
      TweenMax.set(element, {opacity: 0});
      TweenMax.to(element, 2, {opacity: 1, onComplete: done});
    },

    // move: function(element, done) {
    //   console.log(element);
    //   done();
    // },

    leave(element, done) {
      TweenMax.to(element, 2, {opacity: 0, onComplete: done});
    }
  };
}
