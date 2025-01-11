import { IGameObject } from '../interfaces/game-object.interface.js'

export class GameObject implements IGameObject {

  private _isDestroyed = false

  wakeUp() { }
  start() { }
  update() { }

  destroy() {
    this._isDestroyed = true
  }

  isDestroyed() {
    return this._isDestroyed
  }
}