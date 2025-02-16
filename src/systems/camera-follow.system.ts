import { CameraGameObject, GameObject } from '../entities/index.js'
import { InputState } from '../states/input.state.js'
import { DeltaTime, MathHelper } from '../utils/index.js'
import { GameSystem } from './system.js'

export type CameraFollowType = 'FOLLOW' | 'FOLLOW_MOUSE'

export class CameraFollowSystem extends GameSystem {

  private target: GameObject
  private followType: CameraFollowType = 'FOLLOW'

  private cameraGameObject: CameraGameObject

  maxRange = 100
  transaction = 6

  private readonly METHOD_HANDLER: Record<CameraFollowType, (deltaTime: DeltaTime) => void> = {
    'FOLLOW': (deltaTime: DeltaTime) => this.followTarget(deltaTime),
    'FOLLOW_MOUSE': (deltaTime: DeltaTime) => this.followMouseTarget(deltaTime),
  }

  private methodFollowHandler = this.METHOD_HANDLER[this.followType]

  updateBefore(deltaTime: DeltaTime) {
    this.methodFollowHandler(deltaTime)
  }

  private followTarget = (deltaTime: DeltaTime) => {
    this.cameraGameObject.transform.moveTo(this.target.transform.position)
  }

  private followMouseTarget = (deltaTime: DeltaTime) => {
    const refPosition = this.target.transform.position
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

  setTarget(target: GameObject) {
    this.target = target
  }

  setFollowType(followType: CameraFollowType) {
    this.followType = followType

    this.methodFollowHandler = this.METHOD_HANDLER[this.followType]
  }

  setCameraGameObject(cameraGameObject: CameraGameObject) {
    this.cameraGameObject = cameraGameObject
  }
}
