import { GameObject } from './game-object.entity.js'

export class CameraGameObject extends GameObject {

  private _scale: number

  get scale() { return this._scale }
  set scale(value) { this._scale = value }

  start() {
    super.start()

    this._scale = 1
  }
}