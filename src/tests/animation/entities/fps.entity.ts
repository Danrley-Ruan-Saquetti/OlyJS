import { TextSprite, GameObject, CanvasRenderer, DeltaTime } from '../../../index.js'

export class FPSView extends GameObject {

  sprite: TextSprite

  start() {
    super.start()

    this.sprite = new TextSprite(this)
    this.sprite.fixed = true
    this.sprite.color = '#fff'
    this.sprite.font = '15px Roboto Mono'

    this.transform.moveTo({ x: 5, y: 15 })
  }

  update(deltaTime: DeltaTime) {
    this.sprite.text = `${deltaTime.FPS} FPS`

    if (deltaTime.FPS > 80) {
      this.sprite.color = 'blue'
    } else if (deltaTime.FPS > 55) {
      this.sprite.color = 'green'
    } else {
      this.sprite.color = 'red'
    }
  }

  render(canvasRenderer: CanvasRenderer): void {
    canvasRenderer.drawRectangle({
      x: this.transform.position.x - 5,
      y: this.transform.position.y - 15,
      width: 65,
      height: 20,
      color: '#0008',
      fixed: true
    })
    this.sprite.render(canvasRenderer)
  }
}
