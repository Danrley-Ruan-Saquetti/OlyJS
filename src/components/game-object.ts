import { IGameObject } from '../interfaces/game-object.interface.js'
import { DeltaTime } from '../utils/index.js'

export class GameObject implements IGameObject {

  private _isDestroyed = false

  wakeUp() { }
  start() { }
  update(deltaTime: DeltaTime) { }

  destroy() {
    this._isDestroyed = true
  }

  isDestroyed() {
    return this._isDestroyed
  }
}