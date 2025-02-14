import { RectangleShapeComponent, RectangleSpriteComponent } from '../components/index.js'
import { GameObject } from './game-object.entity.js'

export class RectangleGameObject extends GameObject {

  start() {
    super.start()

    const shape = new RectangleShapeComponent()

    this.addComponent(
      shape,
      new RectangleSpriteComponent(this, shape)
    )
  }
}
