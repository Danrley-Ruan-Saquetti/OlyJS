import { Game, GameObject } from "../index.js";

class Player extends GameObject {

}

class OlyGame extends Game {

  protected initializeScene(): void {
    this.instantiate(Player)
  }
}

async function app() {
  const game = new OlyGame()
  await game.bootstrap()
  game.run()
}

app()