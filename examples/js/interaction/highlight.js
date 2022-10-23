//Two approaches, 
//  1. Fill the board with highlight squares, when piece is clicked, make visible those with valid moves    //easier
//  2. Duplicate the highlight squares dynamically, with the respect to piece clicked and valid moves   //saves space

AFRAME.registerComponent("logic-square", {
    init: function(){
        
        this.el.addEventListener('mousedown',function(obj){
            if (!obj.detail.intersection) //if there's no intersection(if you don't click on the board) it yeets you
                return;
        })
    }
})