import { CanvasRenderer, DeltaTime, Input, Keys, RectangleGameObject, RectangleSpriteComponent } from '../../../index.js'

export class Player extends RectangleGameObject {

  private sprite: RectangleSpriteComponent
  private speed = 200

  start() {
    super.start()

    this.sprite = this.getComponent(RectangleSpriteComponent)!

    this.sprite.color = '#FFF'
  }

  update(deltaTime: DeltaTime) {
    if (Input.keyboard.isKeyDown(Keys.KeyW)) {
      this.transform.translate({
        y: -this.speed * deltaTime.elapsedTimeSeconds,
      })
    } else if (Input.keyboard.isKeyDown(Keys.KeyS)) {
      this.transform.translate({
        y: this.speed * deltaTime.elapsedTimeSeconds,
      })
    }
    if (Input.keyboard.isKeyDown(Keys.KeyA)) {
      this.transform.translate({
        x: -this.speed * deltaTime.elapsedTimeSeconds,
      })
    } else if (Input.keyboard.isKeyDown(Keys.KeyD)) {
      this.transform.translate({
        x: this.speed * deltaTime.elapsedTimeSeconds,
      })
    }
  }

  render(canvasRenderer: CanvasRenderer) {
    this.sprite.render(canvasRenderer)
  }
}
