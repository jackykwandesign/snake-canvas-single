import { useState } from "react";
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
  color:CanvasColor
  speed: Velocity
  snake: Coordinate[]
}
export interface GameState {
  totalGrid: number
  food: Coordinate
  player: Player
}

function App() {
  const BG_COLOR = "black"
  const FOOD_COLOR = "red"
  const [gameState, setGameState] = useState<GameState>({
    totalGrid: 20,
    food: {
      x: 2, y: 3
    },
    player: {
      color:"green",
      speed: {
        x: 1,
        y: 1
      },
      snake: [{
        x: 1,
        y: 2
      }, {
        x: 2,
        y: 2
      }, {
        x: 3,
        y: 2
      }]
    }
  })

  const drawGameState: FCanvasDraw = (ctx) => {
    // BG color
    ctx.fillStyle = BG_COLOR
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    const { food, totalGrid, player } = gameState
    const gridSize = ctx.canvas.width / totalGrid

    // print food
    ctx.fillStyle = FOOD_COLOR
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize)

    // print player
    for(let cell of player.snake){
      ctx.fillStyle = player.color
      ctx.fillRect(cell.x * gridSize, cell.y * gridSize, gridSize, gridSize)
    }
  }

  const drawBlackRectangle: FCanvasDraw = (ctx) => {
    ctx.fillStyle = '#FF4444'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }

  // const drawCircleAnimation: FCanvasDraw = (ctx, frameCount) => {

  //   ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  //   ctx.fillStyle = '#000000'
  //   ctx.beginPath()
  //   ctx.arc(50, 100, 20 * Math.sin(frameCount! * 0.05) ** 2, 0, 2 * Math.PI)
  //   ctx.fill()
  // }


  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <FCanvas
      draw={drawGameState}
        // draw={drawBlackRectangle}
        // draw={drawCircleAnimation}
        width={800}
        height={800}
      />
    </div>
  );
}

export default App;
