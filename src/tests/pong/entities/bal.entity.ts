import { CircleGameObject, CircleSpriteComponent, CircleShapeComponent, CanvasRenderer, DeltaTime, Vector2, Input, Keys } from '../../../index.js'
import { Table } from './table.entity.js'

export class Ball extends CircleGameObject {

  body: CircleSpriteComponent
  direction: Vector2
  speed = 0

  constructor(
    public tableGameObject: Table
  ) {
    super()
  }

  start(): void {
    super.start()

    this.direction = new Vector2(1, 1)

    this.body = this.getComponent(CircleSpriteComponent)!

    this.body.shape.radius = 15
    this.body.color = 'yellow'
  }

  update(deltaTime: DeltaTime) {
    this.transform.moveNormalized({
      x: this.direction.x * (this.speed * deltaTime.elapsedTimeSeconds),
      y: this.direction.y * (this.speed * deltaTime.elapsedTimeSeconds),
      z: 0,
    })

    this.isCollisionWithTable()
  }

  isCollisionWithTable() {
    const boundBall = {
      x: this.transform.position.x - this.body.shape.radius,
      y: this.transform.position.y - this.body.shape.radius,
      endX: this.transform.position.x + this.body.shape.radius,
      endY: this.transform.position.y + this.body.shape.radius,
    }
    const boundTable = {
      x: this.transform.position.x,
      y: this.transform.position.y,
      endX: this.transform.position.x + this.tableGameObject.body.shape.width,
      endY: this.transform.position.y + this.tableGameObject.body.shape.height,
    }

    if (
      boundBall.y >= boundTable.y
    ) {
      console.log('!')
    }
  }

  render(canvasRenderer: CanvasRenderer): void {
    this.body.render(canvasRenderer)
  }
}