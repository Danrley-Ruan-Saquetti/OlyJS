import { IGameObject } from '../interfaces/index.js'
import { DeltaTime } from '../utils/index.js'

export class GameObjectRepository {
  private _gameObjects: IGameObject[] = []

  get size() { return this._gameObjects.length }

  start() {
    const length = this._gameObjects.length

    let i = 0; while (i < length) {
      this._gameObjects[i].start(); i++
    }

    i = 0; while (i < length) {
      this._gameObjects[i].startComponents(); i++
    }
  }

  stop() {
    const length = this._gameObjects.length

    let i = 0
    while (i < length) {
      this._gameObjects[i].stop()

      i++
    }
  }

  update(deltaTime: DeltaTime) {
    const length = this._gameObjects.length

    let i = 0
    while (i < length) {
      this._gameObjects[i].update(deltaTime)
      i++
    }
  }

  addGameObject(...gameObjects: IGameObject[]) {
    this._gameObjects.push(...gameObjects)
  }

  removeDestroyed() {
    this._gameObjects = this._gameObjects.filter(gameObject => !gameObject.isDestroyed())
  }

  clear() {
    this._gameObjects = []
  }

  getGameObjects() {
    return this._gameObjects
  }
}