import { RectangleShapeComponent, RectangleSpriteComponent } from '../components/index.js'
import { IRectangle, IVector2 } from '../interfaces/index.js'
import { GameObject } from './game-object.entity.js'

export class RectangleGameObject extends GameObject {

  protected rectangleSpriteComponent: RectangleSpriteComponent

  start() {
    super.start()

    const shape = new RectangleShapeComponent()
    this.rectangleSpriteComponent = new RectangleSpriteComponent(this, shape)

    this.addComponent(
      shape,
      this.rectangleSpriteComponent
    )
  }

  isIntersecting({ height, width, x, y }: IRectangle & IVector2) {
    const bounds = this.getBounds()

    return bounds.left < x + width &&
      bounds.right > x &&
      bounds.top < y + height &&
      bounds.down > y
  }

  getBounds() {
    return {
      left: this.transform.position.x - (this.rectangleSpriteComponent.shape.width / 2),
      top: this.transform.position.y - (this.rectangleSpriteComponent.shape.height / 2),
      right: this.transform.position.x + (this.rectangleSpriteComponent.shape.width / 2),
      down: this.transform.position.y + (this.rectangleSpriteComponent.shape.height / 2),
      width: this.rectangleSpriteComponent.shape.width,
      height: this.rectangleSpriteComponent.shape.height,
      x: this.transform.position.x,
      y: this.transform.position.y,
    }
  }
}
