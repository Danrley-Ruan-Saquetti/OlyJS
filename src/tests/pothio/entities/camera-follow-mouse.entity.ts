import { CameraGameObject, DeltaTime, GameObject, InputState, MathHelper } from '../../../index.js'

export class CameraFollowMouse extends GameObject {

  maxRange = 100
  transaction = 6

  constructor(
    private ref: GameObject,
    private cameraGameObject: CameraGameObject,
  ) {
    super()
  }

  update(deltaTime: DeltaTime) {
    this.moveCamera(deltaTime)
  }

  moveCamera(deltaTime: DeltaTime) {
    const refPosition = this.ref.transform.position
    const mousePosition = InputState.position.clone()

    const distance = MathHelper.distance(refPosition, mousePosition)

    if (distance > this.maxRange) {
      const angle = Math.atan2(mousePosition.y, mousePosition.x)

      mousePosition.x = Math.cos(angle) * this.maxRange
      mousePosition.y = Math.sin(angle) * this.maxRange
    }

    const target = {
      x: refPosition.x + mousePosition.x,
      y: refPosition.y + mousePosition.y,
    }

    const offset = {
      x: (target.x - this.cameraGameObject.transform.position.x) * deltaTime.elapsedTimeSeconds * this.transaction,
      y: (target.y - this.cameraGameObject.transform.position.y) * deltaTime.elapsedTimeSeconds * this.transaction,
    }

    this.cameraGameObject.transform.translate(offset)
  }
}
