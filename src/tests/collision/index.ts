import {
  Game,
} from '../../index.js'
import { getCanvas } from '../common.js'

class OlyGame extends Game {

  protected initializeScene() {
  }
}

async function app() {
  const game = new OlyGame(getCanvas('canvas#canvas-game'))
  await game.bootstrap()
  game.run()
}

app()
