import { IRectangle, IVector2 } from '../interfaces/index.js'
import { GameObject } from './game-object.entity.js'

export class CameraGameObject extends GameObject {

  private _scale: number
  private followTarget?: IVector2

  get scale() { return this._scale }
  set scale(value) { this._scale = value }

  get dimension(): IRectangle {
    return {
      width: this.canvas.width,
      height: this.canvas.height,
    }
  }

  constructor(
    public readonly canvas: HTMLCanvasElement
  ) {
    super()
  }

  start() {
    super.start()

    this._scale = 1
  }

  follow(target: IVector2) {
    this.followTarget = target
  }

  getFollowTarget() {
    return this.followTarget
  }
}
