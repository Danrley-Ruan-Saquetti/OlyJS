import { CircleShapeComponent, CircleSpriteComponent } from '../components/index.js'
import { GameObject } from './game-object.entity.js'

export class CircleGameObject extends GameObject {

  start() {
    super.start()

    const shape = new CircleShapeComponent()

    this.addComponent(
      shape,
      new CircleSpriteComponent(this, shape)
    )
  }
}
