import { IGameObject } from '../interfaces/game-object.interface.js'
import { DeltaTime } from '../utils/index.js'

export class Game {

  private _animationFrame: number
  private _isRunning = false
  private _gameObjects: IGameObject[] = []
  protected readonly deltaTime = new DeltaTime()

  start() {
    if (this._isRunning) {
      throw 'Game already running'
    }

    this._isRunning = true
    this.initComponents()
    this.startGameObjects()
    this.updateFrame()
  }

  initComponents() {
    this.deltaTime.start()
  }

  stop() {
    if (!this._isRunning) {
      throw 'Game already stopped'
    }

    this._isRunning = false
    cancelAnimationFrame(this._animationFrame)
  }

  private startGameObjects() {
    const length = this._gameObjects.length

    let i = 0
    while (i < length) {
      this._gameObjects[i].start?.()
      i++
    }
  }

  private updateFrame() {
    this.deltaTime.calculate()
    this.internalUpdate()
    this.update()
    this.removeGameObjectsDestroyed()
    this.draw()

    if (this._isRunning) {
      this._animationFrame = requestAnimationFrame(() => this.updateFrame())
    }
  }

  private internalUpdate() {
    const length = this._gameObjects.length

    let i = 0
    while (i < length) {
      this._gameObjects[i].update(this.deltaTime)
      i++
    }
  }

  update() { }
  draw() { }

  addGameObject(gameObject: IGameObject) {
    this._gameObjects.push(gameObject)
  }

  private removeGameObjectsDestroyed() {
    this._gameObjects = this._gameObjects.filter(gameObject => !gameObject.isDestroyed())
  }
}