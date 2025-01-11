import { DeltaTime } from '../utils/index.js'
import { KeyboardSystem } from '../systems/index.js'
import { IGameObject, IGameSystem } from '../interfaces/index.js'

export class Game {

  private _animationFrame: number
  private _isRunning = false

  protected readonly deltaTime = new DeltaTime()

  private _gameObjects: IGameObject[] = []
  private _gameSystems: IGameSystem[] = []

  constructor() {
    this.initComponents()
  }

  start() {
    if (this._isRunning) {
      throw 'Game already running'
    }

    this._isRunning = true
    this.startGameSystems()
    this.startGameObjects()
    this.deltaTime.start()
    this.updateFrame()
  }

  initComponents() {
    this.addGameSystem(
      new KeyboardSystem()
    )
  }

  stop() {
    if (!this._isRunning) {
      throw 'Game already stopped'
    }

    this._isRunning = false
    this.stopGameSystems()
    cancelAnimationFrame(this._animationFrame)
  }

  private startGameSystems() {
    const length = this._gameSystems.length

    let i = 0
    while (i < length) {
      this._gameSystems[i].start?.()
      i++
    }
  }

  private stopGameSystems() {
    const length = this._gameSystems.length

    let i = 0
    while (i < length) {
      this._gameSystems[i].stop?.()
      i++
    }
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
    this.updateAfterGameSystems()
    this.draw()

    if (this._isRunning) {
      this._animationFrame = requestAnimationFrame(() => this.updateFrame())
    }
  }

  private internalUpdate() {
    this.updateGameSystems()
    this.updateGameObjects()
  }

  private updateGameObjects() {
    const length = this._gameObjects.length

    let i = 0
    while (i < length) {
      this._gameObjects[i].update(this.deltaTime)
      i++
    }
  }

  private updateGameSystems() {
    const length = this._gameSystems.length

    let i = 0
    while (i < length) {
      this._gameSystems[i].update(this.deltaTime)
      i++
    }
  }

  private updateAfterGameSystems() {
    const length = this._gameSystems.length

    let i = 0
    while (i < length) {
      this._gameSystems[i].updateAfter?.(this.deltaTime)
      i++
    }
  }

  update() { }
  draw() { }

  addGameObject(...gameObjects: IGameObject[]) {
    this._gameObjects.push(...gameObjects)
  }

  addGameSystem(...gameSystems: IGameSystem[]) {
    this._gameSystems.push(...gameSystems)
  }

  private removeGameObjectsDestroyed() {
    this._gameObjects = this._gameObjects.filter(gameObject => !gameObject.isDestroyed())
  }
}