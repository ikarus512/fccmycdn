// Settings:
let a = a || {};
a.bornNeighboursSmall = 2;
a.bornNeighboursLarge = 2;
a.liveSmall = 2;
a.liveLarge = 2;
a.m = 15;
a.n = 10;
a.delay=500;

class Cell extends React.Component {
  render() {
    let cellStyle={
      position: 'absolute',
      'box-sizing': 'border-box',
      top:  this.props.cell.top,
      left: this.props.cell.left,
      width:  this.props.cell.width,
      height: this.props.cell.width,
      border: '1px solid black',
      'border-radius': this.props.cell.radius,
    };

    if(this.props.cell.live==2)
      cellStyle['background-color']='red';
    else if(this.props.cell.live==1)
      cellStyle['background-color']='white';
    else
      cellStyle['background-color']='grey';

    return (
      <div style={cellStyle} onClick={this.props.onClick.bind(this,this.props.cell.index)} >
        {this.props.cell.neighbours}
      </div>
    );
  }
}

class CellsContainer extends React.Component {
  render() {
    let self=this;
    let cellsList = this.props.cells.map(function(cell,idx) {
      return (
        <Cell
          cell={cell}
          onClick={self.props.onClick}
        />
      );
    });
    let containerStyle={
      position: 'relative',
      width: this.props.width,
      height: this.props.height,
      margin: this.props.margin,
      'background-color': 'grey',
    };

    return (
      <div style={containerStyle}>
        {cellsList}
      </div>
    );
  }
}



class MainApp extends React.Component {
  constructor() {
    super();
    this.state = { 
      cells: [],
      m: 20,
      n: 10,
      generation: 0,
      time0: Date.now(), // To calculate running time
      time1: 0, // To calculate pause time
      btnPauseRunText: 'Run',
      containerWidth: 0,
      containerHeight: 0,
      containerMargin: 0,
    }
  }

  resetSize(m,n,callback) {
    if(m<4) m=4;
    if(n<4) n=4;
    if(m%2===1) m++;
    if(n%2===1) n++;

    let vmin = function(x) {return x+'vmin';};
    let fullWidth=90.0;
    let cellWidth =fullWidth/m;
    let cellRadius=cellWidth/2.0;
    let cellYPos  =Math.sqrt(3.0)/2.0*cellWidth;

    let cells = [];
    let containerWidth  = vmin(fullWidth + (1.5) * cellWidth - cellYPos-0.25);
    let containerHeight = vmin((n-1)*cellYPos + cellWidth+0.25);
    let containerMargin = vmin((100.0-fullWidth)/2);

    for(let y=0; y<n; y++) {
      for(let x=0; x<m; x++) {
        cells.push({
          live:0,
          neighbours:'',
          index: cells.length,
          x:x,
          y:y,
          m:m,
          n:n,
          top:vmin(y * cellYPos),
          left:(y % 2 === 0) ?
            vmin( x        * cellWidth) :
            vmin((x + 0.5) * cellWidth),
          width:vmin(cellWidth),
          radius:vmin(cellRadius),
        });
      }
    }

    this.setState({
      cells: cells,
      m: m,
      n: n,
      containerWidth: containerWidth,
      containerHeight: containerHeight,
      containerMargin: containerMargin,
    },callback);
  }

  randomizeCells() {
    let cells = this.state.cells.map(function(cell){
      cell.live = Math.floor(Math.random()*3);
      return cell;
    });

    this.setState({
      cells: cells,
      time0: Date.now(),
      time1: 0,
      generation: 0,
    });
  }

  clearCells() {
    let cells = this.state.cells.map(function(cell){
      cell.live = 0;
      return cell;
    });

    this.setState({
      cells: cells,
      time0: Date.now(),
      time1: 0,
      generation: 0,
    });
  }

  oneStep(check) {
    var oldLives = this.state.cells.map(function(cell){
      return cell.live;
    });

    var cells = this.state.cells.map(function(cell){
      var oldLive = cell.live;
      var liveNeighbours = 0;
      var i=0;

      // Left neighbour:
      if(cell.x===0) i = cell.m - 1;
      else           i = cell.x - 1;
      if(oldLives[cell.y * cell.m + i]) liveNeighbours++;

      // Right neighbour:
      if(cell.x===cell.m-1) i = 0;
      else                  i = cell.x + 1;
      if(oldLives[cell.y * cell.m + i]) liveNeighbours++;

      var prevY = cell.y - 1; if(cell.y===0)        prevY = cell.n - 1;
      var nextY = cell.y + 1; if(cell.y===cell.n-1) nextY = 0;
      if(cell.y % 2 === 0) { // Even row:

        // Upper/lower left neighbour:
        if(cell.x===0) i = cell.m - 1;
        else           i = cell.x - 1;
        if(oldLives[prevY*cell.m+i]) liveNeighbours++;
        if(oldLives[nextY*cell.m+i]) liveNeighbours++;

        // Upper/lower right neighbour:
        i = cell.x;
        if(oldLives[prevY*cell.m+i]) liveNeighbours++;
        if(oldLives[nextY*cell.m+i]) liveNeighbours++;

      } else { // Odd row:

        // Upper/lower left neighbour:
        i = cell.x;
        if(oldLives[prevY*cell.m+i]) liveNeighbours++;
        if(oldLives[nextY*cell.m+i]) liveNeighbours++;

        // Upper/lower right neighbour:
        if(cell.x===cell.m-1) i = 0;
        else                  i = cell.x + 1;
        if(oldLives[prevY*cell.m+i]) liveNeighbours++;
        if(oldLives[nextY*cell.m+i]) liveNeighbours++;

      }

      if(check) {
        cell.neighbours = liveNeighbours;
      } else {
        cell.neighbours = '';

        if(oldLive) {
          if(liveNeighbours>=a.liveSmall && liveNeighbours<=a.liveLarge) {
            cell.live=2;
          } else {
            cell.live=0;
          }
        } else { // Here if oldLive===0
          if( liveNeighbours>=a.bornNeighboursSmall &&
              liveNeighbours<=a.bornNeighboursLarge
          )
          {
            cell.live=1;
          }
        }
      }

      return cell;
    });

    this.setState({
      cells: cells,
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
    this.resetSize(a.m,a.n,this.randomizeCells);
  }

  onClick(index) {
    let cells=this.state.cells.map(function(cell,idx) {
      if(idx===index) cell.live=(cell.live+1)%3;
      return cell;
    });

    this.setState({cells:cells});
  }

  render() {
    let fps = Math.floor(1.0 * this.state.generation / (Date.now() - this.state.time0) * 1000 * 100) / 100;
    let badgeStyle = {'font-size': '13px', 'background-color': '#600'};

    return (
      <div>
        <CellsContainer
          cells={this.state.cells}
          m={this.state.m}
          n={this.state.n}
          width={this.state.containerWidth}
          height={this.state.containerHeight}
          margin={this.state.containerMargin}
          onClick={this.onClick.bind(this)}
        />
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
