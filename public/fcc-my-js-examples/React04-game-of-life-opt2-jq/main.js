'mode strict';

// Settings:
var a = a || {};
a.bornNeighboursSmall = 2;
a.bornNeighboursLarge = 2;
a.liveSmall = 2;
a.liveLarge = 2;
a.m = 40;
a.n = 30;
a.delay=0;

/*
////////////////////////////////////////////////////////////////////////////////
//  onReady
////////////////////////////////////////////////////////////////////////////////
*/
$(document).ready(function(){
  a.resetSize();
  a.initCells();
  a.updateWindowDimensions();

  jQuery(window).on('resize',a.updateWindowDimensions);
  // window.addEventListener('resize', a.updateWindowDimensions());
  // window.removeEventListener('resize', a.updateWindowDimensions());
});


/*
////////////////////////////////////////////////////////////////////////////////
//  Draw functions
////////////////////////////////////////////////////////////////////////////////
*/
a.updateView = function() {
  $('#generation').html(a.generation);
  $('#fps').html(a.fps);

  a.drawLives();
};


a.drawLives = function() {
  var c=a.context,lives=a.lives,m=a.m,n=a.n,
   cellWidth=a.cellWidth,cellRadius=a.cellRadius,cellYPos=a.cellYPos;
  var r=Math.floor(cellRadius);

  var colors=['#888','#fff','#f00'];
  var d=cellWidth/2-cellYPos/2;
  var twoPi = 2*Math.PI;


  //c.strokeStyle = '#000';
  for(var y=0; y<n; y++) {
    for(var color=0; color<3; color++) {
      c.fillStyle = colors[color];
      c.beginPath();
      for(var x=0; x<m; x++) {
        if(a.oldLives[y*m+x]!==a.lives[y*m+x] && lives[y*m+x]==color) {
          var xc=( (y%2==0) ? ((x+0.5)*cellWidth) : ((x+1)*cellWidth) );
          var yc=((0.5+y)*cellYPos)+d;

          //c.fillStyle = colors[lives[y*m+x]];
          //c.arc(xc,yc,cellRadius,0,2*Math.PI);
          c.arc(Math.floor(xc),Math.floor(yc),r,0,twoPi);
        }
      }
      c.fill();//c.stroke();
    }
  }
}

/*
////////////////////////////////////////////////////////////////////////////////
//  Lives initialization
////////////////////////////////////////////////////////////////////////////////
*/
a.resetSize = function() {
  if(a.m<4) a.m=4;
  if(a.n<4) a.n=4;
  if(a.m%2===1) a.m++;
  if(a.n%2===1) a.n++;

  a.lives = [];
  for(var y=0; y<a.n; y++) {
    for(var x=0; x<a.m; x++) {
      a.lives.push(0);
    }
  }
  a.oldLives = a.lives.map(function(live){ return 10; });

  a.resetGenerations();
}

a.resetGenerations = function() {
  a.time0 = Date.now();
  a.time1 = 0;
  a.generation = 0;
  a.fps = 0;
}

a.initCells = function() {
  for(var i=10; i<16 && i<a.m && i<a.n; i++) {
    a.lives[(i)*a.m+10+Math.floor(i/2)]=1;
  }
  a.resetGenerations();
}


/*
////////////////////////////////////////////////////////////////////////////////
//  Window resize handler
////////////////////////////////////////////////////////////////////////////////
*/
a.updateWindowDimensions = function() {
  var windowWidth=jQuery(window).width();//window.innerWidth;
  var windowHeight=jQuery(window).height();//window.innerHeight;

  var w=Math.min(windowWidth,windowHeight);
  a.cellWidth =w/(a.m+0.5);
  a.cellRadius=a.cellWidth/2.0;
  a.cellYPos  =Math.sqrt(3.0)/2.0*a.cellWidth;
  var d=a.cellWidth/2-a.cellYPos/2;
  var h = Math.floor(a.n*a.cellYPos)+2*d;

  $('#myCanvas').attr({width:w, height:h});
  a.context = document.getElementById('myCanvas').getContext("2d");

  a.oldLives = a.lives.map(function(live){ return 10; });
  a.updateView();
}

/*
////////////////////////////////////////////////////////////////////////////////
//  Canvas click handler
////////////////////////////////////////////////////////////////////////////////
*/
a.toggleLive = function(index) {
  a.lives[index] += 1;
  a.lives[index] %= 3;
  a.oldLives[index] = 10;
  a.updateView();
}

a.clickLive = function(event) {
  var rect = event.target.getBoundingClientRect();
  var x = event.pageX - rect.left;
  var y = event.pageY - rect.top;


  var n=a.n, m=a.m;
  var cellWidth=a.cellWidth, cellYPos=a.cellYPos;
  var d=cellWidth/2-cellYPos/2;
  function hit(dx,dy) {
    return dx*dx+dy*dy <= cellWidth*cellWidth*0.25;
  }
  var nx,ny,xc,yc;

  ny=Math.floor(y/cellYPos); yc=(0.5+ny)*cellYPos+d;
  if(ny%2==0) {
    nx=Math.floor(x/cellWidth);
    xc=(nx+0.5)*cellWidth;
    // Check main circle.
    if(nx<m && hit(xc-x,yc-y)) { a.toggleLive(ny*m+nx); return; }

    if(ny>0) {
      // Check upper left circle.
      ny=ny-1; yc=(0.5+ny)*cellYPos+d;
      nx=Math.floor(x/cellWidth-0.5);
      xc=(nx+1)*cellWidth;
      if(nx>=0 && hit(xc-x,yc-y)) { a.toggleLive(ny*m+nx); return; }

      // Check upper right circle.
      nx=nx+1;
      xc=(nx+1)*cellWidth;
      if(nx<m && hit(xc-x,yc-y)) { a.toggleLive(ny*m+nx); return; }
    }

  } else {
    nx=Math.floor(x/cellWidth-0.5);
    xc=(nx+1)*cellWidth;
    // Check main circle.
    if(nx>=0 && hit(xc-x,yc-y)) { a.toggleLive(ny*m+nx); return; }

    // Check upper left circle.
    ny=ny-1; yc=(0.5+ny)*cellYPos+d;
    nx=Math.floor(x/cellWidth);
    xc=(nx+0.5)*cellWidth;
    if(nx<m && hit(xc-x,yc-y)) { a.toggleLive(ny*m+nx); return; }

    // Check upper right circle.
    nx=nx+1;
    xc=(nx+0.5)*cellWidth;
    if(nx<m && hit(xc-x,yc-y)) { a.toggleLive(ny*m+nx); return; }

  }

}

/*
////////////////////////////////////////////////////////////////////////////////
//  Button click handlers
////////////////////////////////////////////////////////////////////////////////
*/
a.randomizeCells = function() {
  a.lives = a.lives.map(function(live){
    return Math.floor(Math.random()*3);
  });
  a.oldLives = a.lives.map(function(live){ return 10; });
  a.resetGenerations();
  a.updateView();
};

a.clearCells = function() {
  a.lives = a.lives.map(function(){return 0;});
  a.oldLives = a.lives.map(function(live){ return 10; });
  a.resetGenerations();
  a.updateView();
};

a.pauseRun = function() {
  if($('#pause').html() === 'Run') {
    // Here if <Run> was pressed
    $('#pause').html('Pause');

    var pause = (a.time1===0) ? (0) : (Date.now()-a.time1);
    a.time0 = a.time0 + pause;

    a.int = setInterval(function(){
      a.oneStep();
    },a.delay);

  } else {
    // Here if <Pause> was pressed
    $('#pause').html('Run');

    if(a.int) clearInterval(a.int);
    a.time1=Date.now();
  }
};

/*
////////////////////////////////////////////////////////////////////////////////
//  Next state function (for each cell, look up all 6 neighbours)
//  1-3% in CPU profile
////////////////////////////////////////////////////////////////////////////////
*/

// a.oneStep = function() {
//   a.oldLives = a.lives.map(function(live){ return live; });
//   var oldLives = a.oldLives;

//   var lives = a.lives;
//   var m=a.m;
//   var n=a.n;
//   for(var y=0; y<n; y++) {
//     for(var x=0; x<m; x++) {
//       var i=y*m+x; /* live index */
//       var liveNeighbours = 0;
//       var nx=0;

//       // Left neighbour:
//       if(x===0) nx = m - 1;
//       else      nx = x - 1;
//       if(oldLives[y *m + nx]) liveNeighbours++;

//       // Right neighbour:
//       if(x===m-1) nx = 0;
//       else        nx = x + 1;
//       if(oldLives[y * m + nx]) liveNeighbours++;

//       var prevY = y - 1; if(y===0)   prevY = n - 1;
//       var nextY = y + 1; if(y===n-1) nextY = 0;
//       if(y % 2 === 0) { // Even row:

//         // Upper/lower left neighbour:
//         if(x===0) nx = m - 1;
//         else      nx = x - 1;
//         if(oldLives[prevY*m+nx]) liveNeighbours++;
//         if(oldLives[nextY*m+nx]) liveNeighbours++;

//         // Upper/lower right neighbour:
//         nx = x;
//         if(oldLives[prevY*m+nx]) liveNeighbours++;
//         if(oldLives[nextY*m+nx]) liveNeighbours++;

//       } else { // Odd row:

//         // Upper/lower left neighbour:
//         nx = x;
//         if(oldLives[prevY*m+nx]) liveNeighbours++;
//         if(oldLives[nextY*m+nx]) liveNeighbours++;

//         // Upper/lower right neighbour:
//         if(x===m-1) nx = 0;
//         else        nx = x + 1;
//         if(oldLives[prevY*m+nx]) liveNeighbours++;
//         if(oldLives[nextY*m+nx]) liveNeighbours++;

//       }



//       if(oldLives[i]) {
//         // Here if oldLives[i]===1 or 2
//         if(liveNeighbours>=a.liveSmall && liveNeighbours<=a.liveLarge) {
//           lives[i]=2;
//         } else {
//           lives[i]=0;
//         }
//       } else {
//         // Here if oldLives[i]===0
//         if( liveNeighbours>=a.bornNeighboursSmall &&
//             liveNeighbours<=a.bornNeighboursLarge
//         )
//         {
//           lives[i]=1;
//         }
//       }

//     }
//   } /* End of loop */

//   a.generation++;
//   a.fps = Math.floor(a.generation / (Date.now() - a.time0)* 1000 * 100) / 100;

//   a.updateView();
// };

/*
////////////////////////////////////////////////////////////////////////////////
//  Next state function (for each live cell, add 1 to all its neighbours)
//  1-3% in CPU profile
////////////////////////////////////////////////////////////////////////////////
*/

a.oneStep = function() {
  var neighb = a.lives.map(function(live){ return 0; });
  a.oldLives = a.lives.map(function(live){ return live; });
  var oldLives = a.oldLives;

  var lives = a.lives;
  var m=a.m;
  var n=a.n;
  for(var y=0; y<n; y++) {
    for(var x=0; x<m; x++) {
      var i=y*m+x; /* live index */
      if(lives[i]) {
        var nx;

        // Left neighbour:
        if(x===0) nx = m - 1;
        else      nx = x - 1;
        neighb[y * m + nx]++;

        // Right neighbour:
        if(x===m-1) nx = 0;
        else        nx = x + 1;
        neighb[y * m + nx]++;


        var prevY = y - 1; if(y===0)   prevY = n - 1;
        var nextY = y + 1; if(y===n-1) nextY = 0;
        if(y % 2 === 0) { // Even row:

          // Upper/lower left neighbour:
          if(x===0) nx = m - 1;
          else      nx = x - 1;
          neighb[prevY*m+nx]++;
          neighb[nextY*m+nx]++;

          // Upper/lower right neighbour:
          nx = x;
          neighb[prevY*m+nx]++;
          neighb[nextY*m+nx]++;

        } else { // Odd row:

          // Upper/lower left neighbour:
          nx = x;
          neighb[prevY*m+nx]++;
          neighb[nextY*m+nx]++;

          // Upper/lower right neighbour:
          if(x===m-1) nx = 0;
          else        nx = x + 1;
          neighb[prevY*m+nx]++;
          neighb[nextY*m+nx]++;

        }

      }
    }
  }


  for(var y=0; y<n; y++) {
    for(var x=0; x<m; x++) {
      var i=y*m+x; /* live index */

      if(oldLives[i]) {
        // Here if oldLives[i]===1 or 2
        if(neighb[i]>=a.liveSmall && neighb[i]<=a.liveLarge) {
          lives[i]=2;
        } else {
          lives[i]=0;
        }
      } else {
        // Here if oldLives[i]===0
        if( neighb[i]>=a.bornNeighboursSmall &&
            neighb[i]<=a.bornNeighboursLarge
        )
        {
          lives[i]=1;
        }
      }
    }
  }

  a.generation++;
  a.fps = Math.floor(a.generation / (Date.now() - a.time0)* 1000 * 100) / 100;

  a.updateView();
};
