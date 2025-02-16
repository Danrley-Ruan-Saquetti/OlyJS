import { DeltaTime, Game, InputState, Keys, Timeout } from '../../index.js'

class TimeoutGame extends Game {

  id: string | null = null
  isActive = false

  update(deltaTime: DeltaTime): void {
    if (InputState.isKeyDown(Keys.Space)) {
      if (!this.isActive) {
        this.isActive = true

        console.log('start setInterval')

        this.id = Timeout.setInterval(() => {
          console.log('trigger setInterval')
        }, 500)
      }
    } else {
      if (this.isActive) {
        console.log('clear setInterval')

        Timeout.clearTimeout(this.id!)
      }
      this.isActive = false
    }
  }
}

async function app() {
  const game = await TimeoutGame.Bootstrap(document.querySelector<HTMLCanvasElement>('canvas#canvas-game')!)

  game.start()
}

app()
