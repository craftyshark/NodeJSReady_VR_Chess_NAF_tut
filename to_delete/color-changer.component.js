/* global AFRAME, NAF */
//really wishing this was better commented 
//so of course, everything has to be correctly be a registered component in a frame, color changer is the 
//function (I think) name here. 

AFRAME.registerComponent('color-changer', {
  //then we have something called events, im guessing that lets
  events: {
    //this fire when a click happens, which starts another function, goes to evt (im guessing 
    //environmen? )
    'click': function (evt) {
      //okay, top part is easy, changes material color
      this.el.setAttribute('material', { color: this.getRandomColor() });

      //however, what the flying pig is this. 
      //gives ownership to the clicker person maybe? hm. 
      NAF.utils.takeOwnership(this.el);
    }
  },

  getRandomColor: function() {
    return `hsl(${Math.random() * 360}, 100%, 50%)`;
  }
});
