import { DeltaTime } from '../utils/index.js'
import { KeyboardSystem } from '../systems/index.js'
import { GameObjectRepository } from '../repositories/index.js'
import { IGameObject, IGameSystem } from '../interfaces/index.js'

export class Game {

  private _animationFrame: number
  private _isRunning: boolean
  private _deltaTime: DeltaTime
  private _gameSystems: IGameSystem[]
  private _gameObjectRepository: GameObjectRepository

  get deltaTime() { return this._deltaTime }

  constructor() {
    this.initComponents()
  }

  start() {
    if (this._isRunning) {
      throw 'Game already running'
    }

    this._isRunning = true
    this.startGameSystems()
    this._gameObjectRepository.startGameObjects()
    this._deltaTime.start()
    this.updateFrame()
  }

  initComponents() {
    this._animationFrame = 0
    this._isRunning = false
    this._gameSystems = []
    this._gameObjectRepository = new GameObjectRepository()
    this._deltaTime = new DeltaTime()

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

  private updateFrame() {
    this._deltaTime.calculate()
    this.internalUpdate()
    this.update()
    this._gameObjectRepository.removeGameObjectsDestroyed()
    this.updateAfterGameSystems()
    this.draw()

    if (this._isRunning) {
      this._animationFrame = requestAnimationFrame(() => this.updateFrame())
    }
  }

  private internalUpdate() {
    this.updateGameSystems()
    this._gameObjectRepository.updateGameObjects(this._deltaTime)
  }

  private updateGameSystems() {
    const length = this._gameSystems.length

    let i = 0
    while (i < length) {
      this._gameSystems[i].update(this._deltaTime)
      i++
    }
  }

  private updateAfterGameSystems() {
    const length = this._gameSystems.length

    let i = 0
    while (i < length) {
      this._gameSystems[i].updateAfter?.(this._deltaTime)
      i++
    }
  }

  update() { }
  draw() { }

  addGameObject(...gameObjects: IGameObject[]) {
    this._gameObjectRepository.addGameObject(...gameObjects)
  }

  addGameSystem(...gameSystems: IGameSystem[]) {
    this._gameSystems.push(...gameSystems)
  }
}