"use strict";

/*
////////////////////////////////////////////////////////////////
//  constants
////////////////////////////////////////////////////////////////
*/

const ATTACK_VARIANCE = 7;
const DARK_DISTANCE = 7;
const FINAL_DUNGEON = 4;
const TILE_SIZE = 16;

const injectionNames = [
  'vitamine A',
  'vitamine B',
  'vitamine C',
  'vitamine D',
  'vitamine E',
];

/*
////////////////////////////////////////////////////////////////
//  Redux store, initial state, actions, reducer
////////////////////////////////////////////////////////////////
*/

const initialState = {
  entities: {
    'player': {
      type: 'player',
      x: 7,
      y: 6,
      health: 100,
      injection: 'no',
      attack: 7,
      level: 0,
      xp: 0,
    },
  },
  occupiedSpaces: {
    '6x7': 'player',
  },
  // map: [],
  dungeon: 0,
  windowHeight: 500,
  windowWidth: 500,
  darkness: true,
};

function actionToggleDarkness() {
  store.dispatch({type: 'TOGGLE_DARKNESS'});
}
function actionAddXp(xp) {
  store.dispatch({type: 'ADD_XP', xp});
}
function actionDamage(entityId, damage) {
  store.dispatch({type: 'DAMAGE', entityId, damage});
}
function actionAddAttack(injectionId, attack) {
  store.dispatch({type: 'ADD_ATTACK', injectionId: injectionId, attack: attack});
}
function actionAddHealth(health) {
  store.dispatch({type: 'ADD_HEALTH', health: health});
}
function actionRemoveEntity(entityId) {
  store.dispatch({type: 'REMOVE_ENTITY', entityId: entityId});
}
function actionSetDungeon(dungeon) {
  store.dispatch({type: 'SET_DUNGEON', dungeon: dungeon});
}
function actionMove(entityId, vector) {
  store.dispatch({type: 'MOVE', entityId: entityId, vector: vector});
}
function actionInitPlayer(vector) {
  store.dispatch({type: 'INIT_PLAYER', vector});
}
function actionRelocatePlayer(vector) {
  store.dispatch({type: 'RELOCATE_PLAYER', vector});
}
function actionInitMap(map) {
  store.dispatch({type: 'INIT_MAP', map: map});
}
function actionWindowResize() {
  store.dispatch({type: 'WINDOW_RESIZE',
    width: window.innerWidth,
    height: window.innerHeight
  });
}
function actionAddEntity(entityId, entityType, health, attack, pos) {
  store.dispatch({type: 'ADD_ENTITY',
    entityId: entityId,
    entityType: entityType,
    health: health,
    attack: attack,
    pos: pos,
  });
}

function gameReducer(state = initialState, action) {

  switch (action.type) {

    case 'TOGGLE_DARKNESS':
      return {
        ...state,
        darkness: !state.darkness,
      };

    case 'ADD_XP':
      let level = state.entities.player.level;
      let xp = state.entities.player.xp + action.xp;
      if(xp===40) {
        xp = 0;
        level++;
      }
      return {
        ...state,
        entities: {
          ...state.entities,
          player: {
            ...state.entities.player,
            xp,
            level,
          },
        },
      };

    case 'DAMAGE':
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.entityId]: {
            ...state.entities[action.entityId],
            health: state.entities[action.entityId].health - action.damage,
          },
        },
      };

    case 'ADD_ATTACK':
      return {
        ...state,
        entities: {
          ...state.entities,
          player: {
            ...state.entities.player,
            attack: state.entities.player.attack + action.attack,
            injection: action.injectionId,
          }
        },
      };

    case 'ADD_HEALTH':
      return {
        ...state,
        entities: {
          ...state.entities,
          player: {
            ...state.entities.player,
            health: state.entities.player.health + action.health,
          }
        },
      };

    case 'REMOVE_ENTITY':
      if(action.entityId === 'boss') {
        return {
          ...state,
          occupiedSpaces: _.chain(state.occupiedSpaces)
                            .omit((state.entities[action.entityId].y+0) + 'x' + (state.entities[action.entityId].x+0))
                            .omit((state.entities[action.entityId].y+1) + 'x' + (state.entities[action.entityId].x+0))
                            .omit((state.entities[action.entityId].y+0) + 'x' + (state.entities[action.entityId].x+1))
                            .omit((state.entities[action.entityId].y+1) + 'x' + (state.entities[action.entityId].x+1))
                            .value(),
          entities: _.chain(state.entities)
                      .omit(action.entityId)
                      .value(),
        };
      } else {
        return {
          ...state,
          occupiedSpaces: _.chain(state.occupiedSpaces)
                            .omit(state.entities[action.entityId].y + 'x' + state.entities[action.entityId].x)
                            .value(),
          entities: _.chain(state.entities)
                      .omit(action.entityId)
                      .value(),
        };
      }

    case 'SET_DUNGEON':
      return {
        ...state,
        dungeon: action.dungeon,
      };

    case 'INIT_PLAYER':
      return {
        ...state,
        occupiedSpaces: _.chain(state.occupiedSpaces)
                          .omit(state.entities.player.y  + 'x' + state.entities.player.x)
                          .set(action.vector.y + 'x' + action.vector.x, 'player')
                          .value(),
        entities: {
          ...state.entities,
          player: {
            ...state.entities.player,
            x: action.vector.x,
            y: action.vector.y,
            health: 100,
            injection: 'no',
            attack: 7,
            level: 0,
            xp: 0,
          }
        }
      };

    case 'RELOCATE_PLAYER':
      return {
        ...state,
        occupiedSpaces: _.chain(state.occupiedSpaces)
                          .omit(state.entities.player.y  + 'x' + state.entities.player.x)
                          .set(action.vector.y + 'x' + action.vector.x, 'player')
                          .value(),
        entities: {
          ...state.entities,
          player: {
            ...state.entities.player,
            x: action.vector.x,
            y: action.vector.y,
          }
        }
      };

    case 'MOVE':
      return {
        ...state,
        occupiedSpaces: _.chain(state.occupiedSpaces)
                          .omit(state.entities[action.entityId].y + 'x' + state.entities[action.entityId].x)
                          .set(
                            (state.entities[action.entityId].y + action.vector.y)
                            + 'x' +
                            (state.entities[action.entityId].x + action.vector.x),
                            action.entityId)
                          .value(),
        entities: {
          ...state.entities,
          [action.entityId]: {
            ...state.entities[action.entityId],
            x: state.entities[action.entityId].x + action.vector.x,
            y: state.entities[action.entityId].y + action.vector.y
          }
        }
      };

    case 'INIT_MAP':
      return {
        ...state,
        map: action.map,
      };

    case 'WINDOW_RESIZE':
      return {
        ...state,
        windowWidth: action.width,
        windowHeight: action.height,
      };

    case 'ADD_ENTITY':
      if(action.entityId === 'boss') {
        return {
          ...state,
          entities: {
            ...state.entities,
            [action.entityId]: {
              type: action.entityType,
              x: action.pos.x,
              y: action.pos.y,
              health: action.health,
              attack: action.attack,
            },
          },
          occupiedSpaces: {
            ...state.occupiedSpaces,
            [(action.pos.y+0) + 'x' + (action.pos.x+0)]: action.entityId,
            [(action.pos.y+1) + 'x' + (action.pos.x+0)]: action.entityId,
            [(action.pos.y+0) + 'x' + (action.pos.x+1)]: action.entityId,
            [(action.pos.y+1) + 'x' + (action.pos.x+1)]: action.entityId,
          },
        };
      } else {
        return {
          ...state,
          entities: {
            ...state.entities,
            [action.entityId]: {
              type: action.entityType,
              x: action.pos.x,
              y: action.pos.y,
              health: action.health,
              attack: action.attack,
            },
          },
          occupiedSpaces: {
            ...state.occupiedSpaces,
            [action.pos.y + 'x' + action.pos.x]: action.entityId,
          },
        };
      }
  }
  return state;
}

let store = Redux.createStore(gameReducer);


const tileClassName = [
  'floor' ,//0
  'wall'  ,//1
  'player',//2
  'enemy' ,//3
  'injection',//4
  'health',//5
  'door'  ,//6
  'boss'  ,//7
];
let tileClassIdx={};
for(let i=0; i<tileClassName.length; i++) {
  tileClassIdx[tileClassName[i]] = i;
}

/*
////////////////////////////////////////////////////////////////
//  Notification system
////////////////////////////////////////////////////////////////
*/

let notify_bigbox = humane.create({ baseCls: 'humane-bigbox', timeout: 3000 });

function message(msgtype,msg) {

  switch (msgtype) {
    case 'error':
      notify_bigbox.log(msg, { addnCls: 'humane-bigbox-error' });
      break;
    case 'success':
      notify_bigbox.log(msg, { addnCls: 'humane-bigbox-success' });
      break;
    case 'info':
    default:
      // Here, each new message appears immediately, not waiting
      // untill previous one disappears.
      let notify_jackedup = humane.create({baseCls: 'humane-jackedup', timeout: 5000});
      notify_jackedup.log(msg, { addnCls: 'humane-jackedup-info' });
      break;
  }

}

/*
////////////////////////////////////////////////////////////////
//  Play preloaded sounds
////////////////////////////////////////////////////////////////
*/

function playSound(id) {

  let a = document.getElementById(id);
  // let a = new Audio(id.replace(/_/,'/')+'.mp3');

  if(a) {
    if(a.paused && a.readyState === 4) {
      a.play();
    } else {

      let int = setInterval(function() {
        if (a.paused) {
          clearInterval(int);
          a.play();
        }
      }, 20);

      setTimeout(function() {
        clearInterval(int);
      }, 5000);

    }

  }

};

/*
////////////////////////////////////////////////////////////////
//  class Game
////////////////////////////////////////////////////////////////
*/

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.props.getState();
  }

  componentWillMount() {
    this._initDungeon(0);
    actionWindowResize();
  }

  componentDidMount() {
    this._handleStoreChanged();
    this._storeUnsubscribe = store.subscribe(this._handleStoreChanged);
    window.addEventListener('keydown', this._handleKeydown);
    window.addEventListener('resize', actionWindowResize);
    // Setup touch controls
    const touchElement = document.getElementById('root');
    const hammertime = new Hammer(touchElement);
    hammertime.get('swipe').set({direction: Hammer.DIRECTION_ALL});
    hammertime.on('swipe', this._handleSwipe);
  }

  componentWillUnmount() {
    this._storeUnsubscribe();
    window.removeEventListener('keydown', this._handleKeydown);
    window.removeEventListener('resize', actionWindowResize);
  }

  _initDungeon(dungeon) {
    actionSetDungeon(dungeon);

    let state = this.props.getState();

    for(let eId in state.entities) {
      if(eId !== 'player')
        actionRemoveEntity(eId);
    };

    let numRooms = 3 + dungeon;
    let mapSize = { x: 20+10*(dungeon+1), y: 20+10*(dungeon+1) };
    let map = this.props.generateMap(mapSize, numRooms);
    actionInitMap(map);

    if(dungeon === 0) {
      actionInitPlayer(this._getEmptySpace());
    } else {
      actionRelocatePlayer(this._getEmptySpace());
    }

    for(let i=0; i<5; i++)
      actionAddEntity('enemy'+i, 'enemy', 30*(state.dungeon+1), 7*(state.dungeon+1), this._getEmptySpace());
    for(let i=0; i<5; i++)
      actionAddEntity('health'+i, 'health', 10*(state.dungeon+2), 0, this._getEmptySpace());
    if(dungeon < FINAL_DUNGEON)
      actionAddEntity('door', 'door', 0, 0, this._getEmptySpace());
    if(dungeon === FINAL_DUNGEON)
      actionAddEntity('boss', 'boss', 30*(state.dungeon+1), 7*(state.dungeon+1), this._getEmptySpace());
    actionAddEntity(injectionNames[state.dungeon], 'injection', 0, 7*(state.dungeon+1), this._getEmptySpace());

    if(dungeon === 0)
      message('success', 'Cure of bacilla in dungeon '+FINAL_DUNGEON+'.');

    playSound('snd_dooropen');
  }

  _handleStoreChanged = () => {
    this.setState(this.props.getState());
  };

  _handleSwipe = (e) => {
    let vector;
    const {overallVelocity, angle} = e;
    if (Math.abs(overallVelocity) > .75) {
      // swipe up
      if (angle > -100 && angle < -80) {
        vector = {x: 0, y: -1};
      }
      // swipe right
      if (angle > -10 && angle < 10) {
        vector = {x: 1, y: 0};
      }
      // swipe down
      if (angle > 80 && angle < 100) {
        vector = {x: 0, y: 1};
      }
      // swipe left
      if (Math.abs(angle) > 170) {
        vector = {x: -1, y: 0};
      }
    }
    if (vector) {
      e.preventDefault();
      this._handleMove(vector);
    }
  };

  _handleKeydown = (e) => {

    let vector = '';
    switch (e.keyCode) {
      case 37:
        vector = {x: -1, y: 0};
        if(e.ctrlKey) vector = {x: -5, y: 0};
        break;
      case 38:
        vector = {x: 0, y: -1};
        if(e.ctrlKey) vector = {x: 0, y: -5};
        break;
      case 39:
        vector = {x: 1, y: 0};
        if(e.ctrlKey) vector = {x: 5, y: 0};
        break;
      case 40:
        vector = {x: 0, y: 1};
        if(e.ctrlKey) vector = {x: 0, y: 5};
        break;
      default:
        vector = '';
        break;
    }
    if (vector) {
      e.preventDefault();
      this._handleMove(vector);
    }
  };

  _handleMove = (vector) => {
    const state = this.props.getState();
    const oPos = {x: state.entities.player.x, y: state.entities.player.y}; 
    const nPos = {x: state.entities.player.x+vector.x, y: state.entities.player.y+vector.y};

    if( 0 <= nPos.y && nPos.y < state.map.length &&
        0 <= nPos.x && nPos.x < state.map[0].length &&
        state.map[nPos.y][nPos.x] === tileClassIdx.floor )
    {
      // Here if new position is inside the map, and is floor

      // Find entity at new position
      let entityId = state.occupiedSpaces[nPos.y + 'x' + nPos.x];

      if(!entityId) { // If new position is empty, move player there.
        actionMove('player', vector);
        return;
      }

      let enemiesCount = 0;
      for(let e in state.entities) {
        if(state.entities[e].type === 'enemy') enemiesCount++;
      }

      // Here if new position is already occupied.
      // Handle different types of collisions.
      let entity = state.entities[entityId];
      let entityType = entity.type;
      switch (entityType) {

        case 'door':
          if(enemiesCount === 0) {
            let nextDungeon = state.dungeon + 1;
            message('success', 'Dungeon '+nextDungeon+'.');
            this._initDungeon(nextDungeon);
          } else {
            playSound('snd_noway');
            message('info', 'Door will open after all viruses eliminated.');
          }
          return;

        case 'injection':
          playSound('snd_weaponpickup');
          message('info', ['injection: '+entityId, 'attack: '+(state.entities.player.attack+entity.attack)]);
          actionAddAttack(entityId, entity.attack);
          actionRemoveEntity(entityId);
          actionMove('player', vector);
          return;

        case 'health':
          playSound('snd_itempickup');
          message('info', 'health + '+entity.health);
          actionAddHealth(entity.health);
          actionRemoveEntity(entityId);
          actionMove('player', vector);
          return;

        case 'boss':
        case 'enemy':
          const player = state.entities.player;
          const playerAttack = Math.floor(player.attack - Math.random() * ATTACK_VARIANCE);
          const enemyAttack = Math.floor(entity.attack - Math.random() * ATTACK_VARIANCE);
          let playerHealth = player.health - enemyAttack;
          let enemyHealth = entity.health - playerAttack;

          if(playerHealth < 0) playerHealth = 0;
          if(enemyHealth < 0) enemyHealth = 0;

          if(playerHealth === 0) {
            playSound('snd_died');
            message('error', 'You Lost!');
            this._initDungeon(0);
            return;
          }

          if(entityId !== 'boss' || entityId === 'boss' && enemiesCount === 0) {
            actionDamage(entityId, playerAttack);
            message('info', [
              entity.type + ' health: ' + enemyHealth,
              entity.type + ' attack: ' + entity.attack,
            ]);
          } else {
            playSound('snd_noway');
            message('info', 'You cannot hit bacilla if at least one virus exists.');
            enemyHealth = entity.health;
          }
          playSound('snd_pistolfire');
          actionDamage('player', enemyAttack);

          if(enemyHealth === 0) {
            if(entityId === 'boss') {
              playSound('snd_bossdied');
              message('success', 'You Won!');
              this._initDungeon(0);
              return;
            } else {
              actionAddXp(10);
              actionRemoveEntity(entityId);
              actionMove('player', vector);
            }
          }

          return;

      } // switch (entityType)

    }
  };

  _getEmptySpace = () => {
    const {map, occupiedSpaces} = this.props.getState();
    let space, x, y;
    do {
      x = Math.floor(Math.random() * (map[0].length-1));
      y = Math.floor(Math.random() * (map.length-1));
      if(map[y+0][x+0] === tileClassIdx.floor && !occupiedSpaces[(y+0) + 'x' + (x+0)] &&
         map[y+1][x+0] === tileClassIdx.floor && !occupiedSpaces[(y+1) + 'x' + (x+0)] &&
         map[y+0][x+1] === tileClassIdx.floor && !occupiedSpaces[(y+0) + 'x' + (x+1)] &&
         map[y+1][x+1] === tileClassIdx.floor && !occupiedSpaces[(y+1) + 'x' + (x+1)] )
      {
        space = {x: x, y: y};
      }
    } while (!space);
    return space;
  };

  render() {
    let {entities,dungeon,map,occupiedSpaces,darkness} = this.state;
    let mapWidth = Math.floor(this.state.windowWidth * 0.9);
    let mapHeight = Math.floor(this.state.windowHeight * 0.6);
    return (<div className="center">
        <b>Health:</b>  {entities.player.health} &nbsp; &nbsp;
        <b>Injection:</b>  {entities.player.injection} &nbsp; &nbsp;
        <b>Attack:</b>  {entities.player.attack} &nbsp; &nbsp;
        <b>Level:</b>   {entities.player.level} &nbsp; &nbsp;
        <b>XP:</b>      {entities.player.xp} &nbsp; &nbsp;
        <b>Dungeon:</b> {dungeon} &nbsp; &nbsp;
        <button onClick={actionToggleDarkness}>Toggle Darkness</button>
        <Map
          map={map}
          occupiedSpaces={occupiedSpaces}
          entities={entities}
          darkness={darkness}
          width={mapWidth}
          height={mapHeight}
        />
      </div>);
  }
};

Game.propTypes = {
  generateMap: React.PropTypes.func.isRequired,
  getState: React.PropTypes.func.isRequired
};


/*
////////////////////////////////////////////////////////////////
//  class Map
////////////////////////////////////////////////////////////////
*/

class Map extends React.Component {
  _drawMap = () => {
    if(!this.props.map) return [];

    // Return array of visible map rows.
    // Each row is array of visible tiles.

    let startX, endX, startY, endY;

    if(1) {
      // Here if draw visible part of the map.

      let tileSize = document.getElementsByClassName('tile').item(0) ?
        document.getElementsByClassName('tile').item(0).clientHeight : TILE_SIZE;
      let radiusX = Math.floor(this.props.width / tileSize / 2);
      let radiusY = Math.floor(this.props.height / tileSize / 2);
      let maxX = this.props.map[0].length;
      let maxY = this.props.map.length;
      let x = this.props.entities.player.x;
      let y = this.props.entities.player.y;

      startX = x - radiusX;
      endX   = x + radiusX;
      startY = y - radiusY;
      endY   = y + radiusY;

      if(startX < 0) { // d=-startX; startX+=d; endX+=d;
        endX -= startX;
        startX = 0;
      }
      if(endX > maxX) { // d=endX-maxX; startX-=d; endX-=d;
        startX -= endX - maxX;
        endX = maxX;
        if(startX < 0) startX = 0;
      }

      if(startY < 0) { // d=-startY; startY+=d; endY+=d;
        endY -= startY;
        startY = 0;
      }
      if(endY > maxY) { // d=endY-maxY; startY-=d; endY-=d;
        startY -= endY - maxY;
        endY = maxY;
        if(startY < 0) startY = 0;
      }

    } else {
      // Here if draw the whole map.
      startX = 0;
      endX   = this.props.map[0].length;
      startY = 0;
      endY   = this.props.map.length;
    }


    let r=[];
    let bossIdx=1;

    for(let y = startY; y < endY; y++) {
      let row=[];
      for(let x = startX; x < endX; x++) {
        let tClass = tileClassName[this.props.map[y][x]];
        let class2 = '';
        let entityId = this.props.occupiedSpaces[y+'x'+x];
        if(entityId) { // Space is occupied
          tClass = this.props.entities[entityId].type;
        }
        if(tClass === 'boss') {
          class2 += ' boss' + (bossIdx++);
        }
        if(this.props.darkness) {
          let x1=this.props.entities.player.x;
          let y1=this.props.entities.player.y;
          if(
            !(
              x1-DARK_DISTANCE < x && x < x1+DARK_DISTANCE &&
              y1-DARK_DISTANCE < y && y < y1+DARK_DISTANCE &&
              (x-x1)*(x-x1) + (y-y1)*(y-y1) < DARK_DISTANCE*DARK_DISTANCE
             )
            )
          {
            class2 += ' dark';
          }
        }
        row.push(React.createElement('span', {
          className: 'tile ' + tClass + class2,
          key: y+'x'+x}, '')
        );
      }
      r.push(React.createElement('div', {className:'row', key:'row'+y}, row));
    }

    return r;
  };

  render() {
    let mapRows = this._drawMap();
    return (<div> {mapRows} </div>);
  }
};

/*
////////////////////////////////////////////////////////////////
//  React root
////////////////////////////////////////////////////////////////
*/

ReactDOM.render(
  <Game generateMap={generateMap} getState={store.getState}/>,
  document.getElementById('game')
);


/*
////////////////////////////////////////////////////////////////
//  generateMap
////////////////////////////////////////////////////////////////
*/

function generateMap(mapSize = {x:50, y:50}, numRooms = 5) {
  let map = [];
  for(let y=0; y<mapSize.y; y++) {
    let row = new Array(mapSize.x).fill(tileClassIdx.wall);
    map.push(row);
  }

  let prevCenter;
  for(let i=0; i<numRooms; i++) {
    let radius, center;
    radius = {x: 5+Math.floor(Math.random()*5), y: 5+Math.floor(Math.random()*5)};
    center = {x: Math.floor(Math.random()*mapSize.x), y: Math.floor(Math.random()*mapSize.y)};

    addRoom(center, radius);

    if(prevCenter) connect(prevCenter, center);

    prevCenter = center;
  }

  function connect(prevCenter, center) {
    let ymin = Math.min(prevCenter.y, center.y, mapSize.y-1);
    let ymax = Math.max(prevCenter.y, center.y, 0);
    let xmin = Math.min(prevCenter.x, center.x, mapSize.x-1);
    let xmax = Math.max(prevCenter.x, center.x, 0);
    for(let y=ymin; y<=ymax; y++) {
      map[y][xmin] = tileClassIdx.floor;
      map[y][xmax] = tileClassIdx.floor;
    }
    for(let x=xmin; x<=xmax; x++) {
      map[ymin][x] = tileClassIdx.floor;
      map[ymax][x] = tileClassIdx.floor;
    }
  }

  function addRoom(center, radius) {
    for(let y=center.y-radius.y; y<center.y+radius.y; y++) {
      for(let x=center.x-radius.x; x<center.x+radius.x; x++) {
        if(0 <= x && x<map[0].length && 0 <= y && y<map.length) {
          map[y][x] = tileClassIdx.floor;
        }
      }
    }
  }

  return map;
}
