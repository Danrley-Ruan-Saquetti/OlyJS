import { Game, GameObject } from "../index.js";

class Player extends GameObject {

  start() {
    setTimeout(() => {
      this.destroy(this)
    }, 1000)
  }
}

class OlyGame extends Game {


  protected initializeScene(): void {
    const player = this.instantiate(Player)
  }

  update() {
    super.update()
  }
}

async function app() {
  const game = new OlyGame()
  await game.bootstrap()
  game.run()
}

app()