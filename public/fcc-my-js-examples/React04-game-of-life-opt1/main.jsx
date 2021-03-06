// Settings:
let a = a || {};
a.bornNeighboursSmall = 2;
a.bornNeighboursLarge = 2;
a.liveSmall = 2;
a.liveLarge = 2;
a.m = 40;
a.n = 30;
a.delay=300;

class CellsContainer extends React.Component {

  myDraw(c) {
    let lives=this.props.lives,
      oldLives=this.props.oldLives,
      m=this.props.m,
      n=this.props.n,
      cellWidth=this.props.cellWidth,
      cellRadius=this.props.cellRadius,
      cellYPos=this.props.cellYPos;

    //c.strokeStyle = '#000';
    let colors=['#888','#fff','#f00'];
    let d=cellWidth/2-cellYPos/2;
    for(let y=0; y<n; y++) {
      for(let x=0; x<m; x++) {
        if(oldLives[y*m+x]!==lives[y*m+x]) {
          let xc=( (y%2==0) ? ((x+0.5)*cellWidth) : ((x+1)*cellWidth) );
          let yc=((0.5+y)*cellYPos)+d;

          c.fillStyle = colors[lives[y*m+x]];
          c.beginPath();
          c.arc(xc,yc,cellRadius,0,2*Math.PI);
          c.fill();//c.stroke();
        }
      }
    }
  }

  click(event) {
    var rect = event.target.getBoundingClientRect();
    var x = event.pageX - rect.left;
    var y = event.pageY - rect.top;

    let n=this.props.n, m=this.props.m;
    let cellWidth=this.props.cellWidth, cellYPos=this.props.cellYPos;
    let d=cellWidth/2-cellYPos/2;
    function hit(dx,dy) {
      return dx*dx+dy*dy <= cellWidth*cellWidth*0.25;
    }
    let nx,ny,xc,yc;

    ny=Math.floor(y/cellYPos); yc=(0.5+ny)*cellYPos+d;
    if(ny%2==0) {
      nx=Math.floor(x/cellWidth);
      xc=(nx+0.5)*cellWidth;
      // Check main circle.
      if(nx<m && hit(xc-x,yc-y)) { this.props.onClick(ny*m+nx); return; }

      if(ny>0) {
        // Check upper left circle.
        ny=ny-1; yc=(0.5+ny)*cellYPos+d;
        nx=Math.floor(x/cellWidth-0.5);
        xc=(nx+1)*cellWidth;
        if(nx>=0 && hit(xc-x,yc-y)) { this.props.onClick(ny*m+nx); return; }

        // Check upper right circle.
        nx=nx+1;
        xc=(nx+1)*cellWidth;
        if(nx<m && hit(xc-x,yc-y)) { this.props.onClick(ny*m+nx); return; }
      }

    } else {
      nx=Math.floor(x/cellWidth-0.5);
      xc=(nx+1)*cellWidth;
      // Check main circle.
      if(nx>=0 && hit(xc-x,yc-y)) { this.props.onClick(ny*m+nx); return; }

      // Check upper left circle.
      ny=ny-1; yc=(0.5+ny)*cellYPos+d;
      nx=Math.floor(x/cellWidth);
      xc=(nx+0.5)*cellWidth;
      if(nx<m && hit(xc-x,yc-y)) { this.props.onClick(ny*m+nx); return; }

      // Check upper right circle.
      nx=nx+1;
      xc=(nx+0.5)*cellWidth;
      if(nx<m && hit(xc-x,yc-y)) { this.props.onClick(ny*m+nx); return; }

    }

  }

  render() {

    if(this.myCanvas) {
      this.myDraw(this.myCanvas.getContext("2d"));
    }

    return (
      <canvas id='myCanvas'
        ref={(myCanvas) => { this.myCanvas = myCanvas; }}
        width={this.props.w} height={this.props.h}
        onClick={this.click.bind(this)}>
      </canvas>
    );
  }
}


/*
////////////////////////////////////////////////////////////////////////////////
//  MainApp
////////////////////////////////////////////////////////////////////////////////
*/
class MainApp extends React.Component {
  constructor() {
    super();

    this.state = { 
      lives: [],
      oldLives: [],
      m: 20,
      n: 10,
      generation: 0,
      time0: Date.now(), // To calculate running time
      time1: 0, // To calculate recent pause time
      btnPauseRunText: 'Run',

      w:100,
      h:100,
      cellWidth:10,
      cellRadius:10,
      cellWidth:10,
      cellYPos:10,
    };

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

  }

  resetSize(m,n,callback) {
    if(m<4) m=4;
    if(n<4) n=4;
    if(m%2===1) m++;
    if(n%2===1) n++;

    let lives = [];

    for(let y=0; y<n; y++) {
      for(let x=0; x<m; x++) {
        lives.push(0);
      }
    }

    let oldLives = lives.map(function(live){ return 10; });

    let windowWidth=window.innerWidth;
    let windowHeight=window.innerHeight;
    let w=Math.min(windowWidth,windowHeight);
    let cellWidth =w/(a.m+0.5);
    let cellRadius=cellWidth/2.0;
    let cellYPos  =Math.sqrt(3.0)/2.0*cellWidth;
    let d=cellWidth/2-cellYPos/2;
    let h = Math.floor(a.n*cellYPos)+2*d;

    this.setState({
      lives: lives,
      oldLives: oldLives,
      m: m,
      n: n,

      w:w,
      h:h,
      cellWidth:cellWidth,
      cellRadius:cellRadius,
      cellWidth:cellWidth,
      cellYPos:cellYPos,
    },callback);
  }

  initCells(callback) {
    let m=this.state.m;
    let n=this.state.n;
    for(let i=10; i<16 && i<m && i<n; i++) {
      this.state.lives[(i)*m+10+Math.floor(i/2)]=1;
    }

    this.setState({
      lives: this.state.lives,
      time0: Date.now(),
      time1: 0,
      generation: 0,
    },callback);
  }

  randomizeCells() {
    let lives = this.state.lives.map(function(live){
      live = Math.floor(Math.random()*3);
      return live;
    });
    let oldLives = lives.map(function(live){ return 10; });

    this.setState({
      lives: lives,
      oldLives: oldLives,
      time0: Date.now(),
      time1: 0,
      generation: 0,
    });
  }

  clearCells() {
    let lives = this.state.lives.map(function(){return 0;});
    let oldLives = lives.map(function(live){ return 10; });

    this.setState({
      lives: lives,
      oldLives: oldLives,
      time0: Date.now(),
      time1: 0,
      generation: 0,
    });
  }

  oneStep(check) {
    var oldLives = this.state.lives.map(function(live){ return live; });

    var lives = this.state.lives;
    var m=this.state.m;
    var n=this.state.n;
    for(var y=0; y<n; y++) {
      for(var x=0; x<m; x++) {
        var i=y*m+x; /* live index */
        var liveNeighbours = 0;
        var nx=0;

        // Left neighbour:
        if(x===0) nx = m - 1;
        else      nx = x - 1;
        if(oldLives[y *m + nx]) liveNeighbours++;

        // Right neighbour:
        if(x===m-1) nx = 0;
        else        nx = x + 1;
        if(oldLives[y * m + nx]) liveNeighbours++;

        var prevY = y - 1; if(y===0)   prevY = n - 1;
        var nextY = y + 1; if(y===n-1) nextY = 0;
        if(y % 2 === 0) { // Even row:

          // Upper/lower left neighbour:
          if(x===0) nx = m - 1;
          else      nx = x - 1;
          if(oldLives[prevY*m+nx]) liveNeighbours++;
          if(oldLives[nextY*m+nx]) liveNeighbours++;

          // Upper/lower right neighbour:
          nx = x;
          if(oldLives[prevY*m+nx]) liveNeighbours++;
          if(oldLives[nextY*m+nx]) liveNeighbours++;

        } else { // Odd row:

          // Upper/lower left neighbour:
          nx = x;
          if(oldLives[prevY*m+nx]) liveNeighbours++;
          if(oldLives[nextY*m+nx]) liveNeighbours++;

          // Upper/lower right neighbour:
          if(x===m-1) nx = 0;
          else        nx = x + 1;
          if(oldLives[prevY*m+nx]) liveNeighbours++;
          if(oldLives[nextY*m+nx]) liveNeighbours++;

        }



        if(oldLives[i]) {
          // Here if oldLives[i]===1 or 2
          if(liveNeighbours>=a.liveSmall && liveNeighbours<=a.liveLarge) {
            lives[i]=2;
          } else {
            lives[i]=0;
          }
        } else {
          // Here if oldLives[i]===0
          if( liveNeighbours>=a.bornNeighboursSmall &&
              liveNeighbours<=a.bornNeighboursLarge
          )
          {
            lives[i]=1;
          }
        }

      }
    } /* End of loop */

    this.setState({
      lives: lives,
      oldLives: oldLives,
      generation: this.state.generation+1,
    });
  }

  pauseRun() {
    let self = this;
    if(this.state.btnPauseRunText === 'Run') {
      // Here if <Run> was pressed
      let pause = (this.state.time1===0) ? (0) : (Date.now()-this.state.time1);
      let time0 = this.state.time0 + pause;

      this.setState({btnPauseRunText:'Pause', time0:time0},function(){
        a.int = setInterval(function(){
          self.oneStep();
        },a.delay);
      });
    } else {
      // Here if <Pause> was pressed
      if(a.int) clearInterval(a.int);
      this.setState({btnPauseRunText:'Run', time1:Date.now()});
    }
  }

  componentDidMount() {
    //this.resetSize(a.m,a.n,this.randomizeCells);
    this.resetSize(a.m,a.n,this.initCells);

    window.addEventListener('resize', this.updateWindowDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions.bind(this));
  }

  updateWindowDimensions() {
    let windowWidth=window.innerWidth;
    let windowHeight=window.innerHeight;
    let w=Math.min(windowWidth,windowHeight);
    let cellWidth =w/(this.state.m+0.5);
    let cellRadius=cellWidth/2.0;
    let cellYPos  =Math.sqrt(3.0)/2.0*cellWidth;
    let d=cellWidth/2-cellYPos/2;
    let h = Math.floor(this.state.n*cellYPos)+2*d;

    this.setState({
      w:w,
      h:h,
      cellWidth:cellWidth,
      cellRadius:cellRadius,
      cellWidth:cellWidth,
      cellYPos:cellYPos,
    });
  }

  onClick(index) {
    this.state.lives[index] += 1;
    this.state.lives[index] %= 3;
    this.state.oldLives[index] = 10;
    
    this.setState({
      lives:this.state.lives,
      oldLives: this.state.oldLives,
    });
  }

  render() {
    let fps = Math.floor(
      this.state.generation / (Date.now() - this.state.time0)
      * 1000 * 100) / 100;
    let badgeStyle = {'font-size': '13px', 'background-color': '#600'};

    return (
      <div>
        <div classname='row'>
          <CellsContainer
            lives={this.state.lives}
            oldLives={this.state.oldLives}
            m={this.state.m}
            n={this.state.n}
            w={this.state.w}
            h={this.state.h}
            cellWidth={this.state.cellWidth}
            cellRadius={this.state.cellRadius}
            cellWidth={this.state.cellWidth}
            cellYPos={this.state.cellYPos}
            onClick={this.onClick.bind(this)}
          />
        </div>
        <button className='col-xs-2 col-xs-offset-1 btn btn-primary'
          onClick={this.randomizeCells.bind(this)}>
          Rand
        </button>
        <button className='col-xs-2 btn btn-primary'
          onClick={this.pauseRun.bind(this)}>
          {this.state.btnPauseRunText}
        </button>
        <button className='col-xs-2 btn btn-primary'
          onClick={this.clearCells.bind(this)}>
          Clear
        </button>
        <label className='label label-default col-xs-2'> Generation: <br/>
          <span className="badge" style={badgeStyle}>{this.state.generation}</span>
        </label>
        <label className='label label-default col-xs-2'> FPS: <br/>
          <span className="badge" style={badgeStyle}>{fps} </span>
        </label>
      </div>
    );
  }
}

React.render(<MainApp  />,document.getElementById('myrootcomponent'));
