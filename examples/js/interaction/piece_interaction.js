// The cursor listener represents the "whole" chessboard as a plane.
// It's a 4x4 plane tiled sideways, so Z is "upwards" instead of Y.
AFRAME.registerComponent('cursor-listener', {
    init: function () {
        // Grab a reference to the plane we'll use to signify when
        // we highlight a piece. It starts invisible, but well
        // make it visible when we click on it
        //<<<<<<< HEAD
        const highlightPlane = document.querySelector('#highlight-plane');  
        //#highlight-plane is a html element, that we are assigning to highlightPlane, which is a js element. 
        //Note for Jose, understand what querySelector means. 
        
        

        
        // SUGGESTION: mousevents are oldschool. consider pointer events
        // https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events
        /// o: I will let my mate know!
        

        //<<<<<<< HEAD
        const object3D = this.el.object3D; //Jose: make sure you go back and understand 

        // This function converts any position in the world
        // to a position in "chess space" (aka A4, B2, E8 that kinda thing)
        // (and does no checks, you can get insane chess position if you put
        // garbage in here - TODO: add a limit maybe to you can only pick one of
        // the valid 8x8 spaces?)

        // returns a Vector2 (since chess is 2 dimensional)
        // https://threejs.org/docs/index.html?q=vect#api/en/math/Vector2
        const worldToBoard = (worldVector) => {//Javascript is rood at times 
            // Convert to "world space", relative to the center of the universe
            // to "local space", where this position is described as
            // "relative" to the center of the board.
            // (note that the board is tiled "sideways" via the rotate attribute,
            // to make it horizontal since by default <a-plane> is like upright
            // instead of flat.)
            const localIntersection = object3D.worldToLocal(worldVector);

            // Normalize to 0 - 1 (the board is 4 units wide and positions go into the negative)
            // Also discard the "z-axis" here - chess isn't 3d.
            const boardPosition = new THREE.Vector2(
                (localIntersection.x / 4) + 0.5,
                (localIntersection.y / 4) + 0.5
            );
            // Multiply by all the chess positions (chess boards are 8x8)
            boardPosition.multiplyScalar(8);
            // Round to a whole number (chess isnt fractional)
            boardPosition.ceil();
            
            return boardPosition;
        }
        // Opposite of the function above, get the "world space" position
        // from a "chess space" position
        const boardToWorld = (boardPosition) => {
            // Start by figuring out our "local position" from the center of the board.
            const localPosition = new THREE.Vector3(boardPosition.x, boardPosition.y, 0);
            // divide by 4 so that our chess position range go from (1 - 8) to (1 - 2)
            localPosition.multiplyScalar(1/4)
            // subtract -1 to that is goes (-1 to +1)
            localPosition.add(new THREE.Vector3(-1, -1, 0))
            // and now it goes from (-2 to +2) (which is the size of our board - we're almost done)
            localPosition.multiplyScalar(2)
            // and since we rounded the number down, we need to add
            // a bit to make it to the middle of the square
            localPosition.add(new THREE.Vector3(-0.25, -0.25, 0))
            // And turn it into a world space vector!
            return object3D.localToWorld(localPosition)
        };
        // convert a "chess space" position to a string like "C4", "D1"
        const boardToChessTerm = (boardPosition) => {
            // Chess board looks like
            // https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Starting_position_in_a_chess_game.jpg/1920px-Starting_position_in_a_chess_game.jpg
            const letters = new Map([
                [1, 'a'],
                [2, 'b'],
                [3, 'c'],
                [4, 'd'],
                [5, 'e'],
                [6, 'f'],
                [7, 'g'],
                [8, 'h'],
            ]);

            const columnLetter = letters.get(boardPosition.x);
            const rowNumber = boardPosition.y;
            return `${columnLetter}${rowNumber}`;
        }


        this.el.addEventListener('mousedown', function (obj) {  //this.el points to what element you are about to click on, you're attaching event listen to that, mousedown fires the the 
            //function following it. this.el gets assigned to obj as, like a reference? we think. 
            if (!obj.detail.intersection) //if there's no intersection(if you don't click on the board) it yeets you
                return;
                
            //<<<<<<< HEAD this was left over after a merge, might have messed things up by removing it, might have not. Not sure tbh. 

            const startPosition = worldToBoard(obj.detail.intersection.point) //"obj.detail.intersection.point" understand and document this better, appears to grab the position
            //translates from the world to the board. 
            
            highlightPlane.object3D.visible = true; //while mouse is down, the following three thigns happen. First the highlight becomes visible. 
            highlightPlane.setAttribute("color", "blue"); //next it becomes blue 
            highlightPlane.object3D.position.copy(boardToWorld(startPosition)) //This gives the first position to the highlight plane

            console.log('Moving from: ', boardToChessTerm(startPosition)) //This lets us know where that is, helps with debuggin

            const onMouseUp = (evt) => { //understand the javascript stuff going on here. 
                // Cleanup event handlers so we don't get _another_
                // listener every time we click
                this.removeEventListener('mouseup', onMouseUp); //ask about this. to whatever subject matter expert we can find 

                const endPosition = worldToBoard(evt.detail.intersection.point) //When you mouse up, that position is coppied to end position
                console.log('Moving to: ', boardToChessTerm(endPosition))
                
                rook_w_r.object3D.position.copy(boardToWorld(endPosition)) //potiential idea for implementation, give each piece it's own js function like here? 
                highlightPlane.object3D.position.copy(boardToWorld(endPosition))  
                highlightPlane.setAttribute("color", "red");
            };

          this.addEventListener('mouseup', onMouseUp);
      });
     
    }
});