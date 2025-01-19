import { TextSprite, GameObject, CanvasRenderer, DeltaTime } from '../../../index.js'

export class FPSView extends GameObject {

  sprite: TextSprite

  start() {
    super.start()

    this.sprite = new TextSprite(this)
    this.sprite.fixed = true
    this.sprite.color = '#fff'
    this.sprite.font = '20px Roboto Mono'

    this.transform.moveTo({ x: 10, y: 25 })
  }

  update(deltaTime: DeltaTime) {
    this.sprite.text = `FPS: ${deltaTime.FPS}`

    if (deltaTime.FPS > 80) {
      this.sprite.color = 'blue'
    } else if (deltaTime.FPS > 55) {
      this.sprite.color = 'green'
    } else {
      this.sprite.color = 'red'
    }
  }

  render(canvasRenderer: CanvasRenderer): void {
    this.sprite.render(canvasRenderer)
  }
}