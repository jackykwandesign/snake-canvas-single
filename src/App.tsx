import { useEffect, useRef, useState } from "react";
import { FCanvas } from "./components/FCanvas";
import { FCanvasDraw } from "./components/FCanvas/types";

type CanvasColor = string | CanvasGradient | CanvasPattern
export interface Coordinate {
  x: number,
  y: number,
}
export interface Velocity extends Coordinate {
  // xAcele:number,
  // yAcele:number
}
export interface Player {
  location: Coordinate
  color: CanvasColor
  speed: Velocity
  direction: Direction
  snake: Coordinate[]
}
export enum GameState {
  WAIT = 0,
  START = 1,
  END = 2,
}
export interface GameManager {
  gameState: GameState
  totalGrid: number
  food: Coordinate[]
  players: Player[]
}
export enum Direction {
  UP = 0,
  DOWN = 1,
  LEFT = 2,
  RIGHT = 3,
}
const calNextGridDiff = (velocity: Velocity, direction: Direction): Coordinate => {
  // console.log("direction", direction)
  switch (direction) {
    case Direction.UP:
      return {
        x: 0,
        y: velocity.y * -1
      }
    case Direction.DOWN:
      return {
        x: 0,
        y: velocity.y,
      }
    case Direction.LEFT:
      return {
        x: velocity.x * -1,
        y: 0
      }
    case Direction.RIGHT:
      return {
        x: velocity.x,
        y: 0
      }

    default:
      return {
        x: 0,
        y: 0
      }
      break;
  }
}
const checkIsCoorsIncludes = (coordinates: Coordinate[], target: Coordinate) => {
  const found = coordinates.find(e => {
    return e.x === target.x && e.y === target.y
  })
  return found ? true : false
}
const defaultPlayer1Location: Coordinate = {
  x: 1,
  y: 1,
}
const defaultGameManager = {
  gameState: GameState.WAIT,
  totalGrid: 20,
  food: [{
    x: 2, y: 3
  }],
  players: [
    {
      color: "green",
      direction: Direction.RIGHT,
      location: defaultPlayer1Location,
      speed: {
        x: 1,
        y: 1
      },
      snake: [defaultPlayer1Location, { ...defaultPlayer1Location, x: defaultPlayer1Location.x - 1 }, { ...defaultPlayer1Location, x: defaultPlayer1Location.x - 2 }]
    }
  ]
}

function getRandomInt(max:number) {
  return Math.floor(Math.random() * max);
}
const getNewUniqueCoor = (exists:Coordinate[], xLimit:number, yLimit:number):Coordinate =>{
  let newCoor:Coordinate = {x:0, y:0}
  while(1){
    newCoor = {
      x : getRandomInt(xLimit),
      y : getRandomInt(yLimit)
    }
    let isExist = checkIsCoorsIncludes(exists,newCoor )
    if(!isExist){
      break
    }
  }
  return newCoor
}
function App() {
  const BG_COLOR = "black"
  const FOOD_COLOR = "red"

  const gameManagerRef = useRef<GameManager | null>(null)
  const [gameState, setGameState] = useState<GameManager>(defaultGameManager)
  useEffect(() => {
    gameManagerRef.current = gameState;
  })
  const handleOnKeyDown = (e: KeyboardEvent) => {
    if (e.key === "w") {
      let newPlayer = gameState.players[0]
      newPlayer.direction = Direction.UP
      setGameState({ ...gameState, players: [newPlayer] })
    } else if (e.key === "a") {
      let newPlayer = gameState.players[0]
      newPlayer.direction = Direction.LEFT
      setGameState({ ...gameState, players: [newPlayer] })
    } else if (e.key === "s") {
      let newPlayer = gameState.players[0]
      newPlayer.direction = Direction.DOWN
      setGameState({ ...gameState, players: [newPlayer] })
    } else if (e.key === "d") {
      let newPlayer = gameState.players[0]
      newPlayer.direction = Direction.RIGHT
      setGameState({ ...gameState, players: [newPlayer] })
    }
  }
  useEffect(() => {
    window.addEventListener("keydown", handleOnKeyDown)
    return () => {
      window.removeEventListener("keydown", handleOnKeyDown)
    }
  })
  const updateGameState = () => {
    let newGameState = { ...gameManagerRef.current }

    // check game state
    if (!newGameState) {
      return
    }
    if (newGameState.gameState !== GameState.START) {
      return
    }

    // cal new player position
    // console.log("newGameState", newGameState.players![0])
    for (let i = 0; i < newGameState.players!.length; i++) {
      const player = newGameState.players![i];
      let diff = calNextGridDiff(player.speed, player.direction)
      let newLocation = {
        x: player.location.x + diff.x,
        y: player.location.y + diff.y,
      }

      if (newLocation.x < 0 || newLocation.x >= newGameState.totalGrid! || newLocation.y < 0 || newLocation.y >= newGameState.totalGrid!) {
        alert(`Player ${i} Lose`)
        newGameState.gameState = GameState.END
        break
      }

      // check if eat food
      const isEatFood = checkIsCoorsIncludes(newGameState.food!, newLocation)
      if(isEatFood){
        console.log("Eat 1 food")
        const remainFoods = newGameState.food!.filter(e=>{
         return  (e.x !== newLocation.x || e.y !== newLocation.y)
        })
        const playerCoordinates:Coordinate[] = []
        
        newGameState.players!.forEach(e=> {
          playerCoordinates.push(...e.snake)
        })
        let newFood = getNewUniqueCoor([...remainFoods , ...playerCoordinates ], newGameState.totalGrid!, newGameState.totalGrid!)
        remainFoods.push(newFood)
        newGameState.food = remainFoods
      }

      player.location = newLocation
      player.snake.unshift(newLocation)
      !isEatFood && player.snake.pop()
    }

    setGameState(newGameState as GameManager)
  }

  const drawGameState: FCanvasDraw = (ctx) => {
    // BG color
    ctx.fillStyle = BG_COLOR
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    const { food, totalGrid, players: player } = gameState
    const gridSize = ctx.canvas.width / totalGrid

    drawFood(ctx)
    drawPlayer(ctx)

  }

  const drawFood: FCanvasDraw = (ctx) => {
    const { food, totalGrid } = gameState
    const gridSize = ctx.canvas.width / totalGrid
    // print food
    ctx.fillStyle = FOOD_COLOR
    for (let cell of food) {
      ctx.fillRect(cell.x * gridSize, cell.y * gridSize, gridSize, gridSize)
    }
  }

  const drawPlayer: FCanvasDraw = (ctx) => {
    const { players, totalGrid } = gameState
    const gridSize = ctx.canvas.width / totalGrid
    // print player
    for (let player of players) {
      ctx.fillStyle = player.color
      for (let cell of player.snake) {
        ctx.fillRect(cell.x * gridSize, cell.y * gridSize, gridSize, gridSize)
      }
    }
  }

  const drawBlackRectangle: FCanvasDraw = (ctx) => {
    ctx.fillStyle = '#FF4444'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }

  useEffect(() => {
    let interval = setInterval(updateGameState, 100)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <FCanvas
        <GameManager>
        draw={drawGameState}
        width={800}
        height={800}
        state={gameState}
      />
      <button onClick={() => setGameState(defaultGameManager)}>RESET</button>
      <button onClick={() => setGameState({ ...gameState, gameState: GameState.START })}>START</button>
    </div>
  );
}

export default App;
