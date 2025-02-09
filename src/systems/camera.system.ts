import { CameraGameObject } from '../entities/index.js'
import { IVector2 } from '../interfaces/index'
import { DeltaTime } from '../utils/index.js'
import { GameSystem } from './system.js'

export class CameraSystem extends GameSystem {

  private cameraGameObject: CameraGameObject

  constructor(
    private _canvas: HTMLCanvasElement,
  ) {
    super()
  }

  setCameraGameObject(cameraGameObject: CameraGameObject) {
    this.cameraGameObject = cameraGameObject
  }

  update(deltaTime: DeltaTime) {
    const target = this.cameraGameObject.getFollowTarget()

    if (target) {
      this.moveToTarget(target)
    }
  }

  moveToTarget(target: IVector2) {
    this.cameraGameObject.transform.moveTo({
      x: -target.x + (this._canvas.width / 2),
      y: -target.y + (this._canvas.height / 2),
    })
  }
}
