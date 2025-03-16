import { Game, GameObject } from "../index.js";

class Player extends GameObject {

  update() {
  }
}

class OlyGame extends Game {

  protected initializeScene() {
    this.instantiate(Player)
  }
}

const canvas = document.querySelector<HTMLCanvasElement>('canvas#canvas-game')!

const displayWidth = 800
const displayHeight = 400
const scale = 1

canvas.style.width = displayWidth + 'px'
canvas.style.height = displayHeight + 'px'
canvas.width = displayWidth * scale
canvas.height = displayHeight * scale

async function app() {
  const game = new OlyGame(canvas)
  await game.bootstrap()
  game.run()
}

app()