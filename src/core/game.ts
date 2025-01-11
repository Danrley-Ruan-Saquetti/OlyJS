import { DeltaTime } from '../utils/index.js'
import { KeyboardSystem } from '../systems/index.js'
import { GameObjectRepository, GameSystemRepository } from '../repositories/index.js'
import { IGameObject, IGameSystem } from '../interfaces/index.js'
import { RenderSystem2D } from '../systems/render.system.js'

export class Game {

  private _animationFrame: number
  private _isRunning: boolean
  private _deltaTime: DeltaTime
  private _gameObjectRepository: GameObjectRepository
  private _gameSystemRepository: GameSystemRepository

  get deltaTime() { return this._deltaTime }

  constructor(
    protected canvas: HTMLCanvasElement
  ) {
    this.initComponents()
  }

  initComponents() {
    this._animationFrame = 0
    this._isRunning = false
    this._gameObjectRepository = new GameObjectRepository()
    this._gameSystemRepository = new GameSystemRepository()
    this._deltaTime = new DeltaTime()

    this.addGameSystem(
      new KeyboardSystem(),
      new RenderSystem2D(this.canvas, this._gameObjectRepository)
    )
  }

  start() {
    if (this._isRunning) {
      throw 'Game already running'
    }

    this._isRunning = true
    this._gameObjectRepository.startGameObjects()
    this._gameSystemRepository.startGameSystems()
    this._deltaTime.start()
    this.updateFrame()
  }

  stop() {
    if (!this._isRunning) {
      throw 'Game already stopped'
    }

    this._isRunning = false
    this._gameSystemRepository.stopGameSystems()
    cancelAnimationFrame(this._animationFrame)
  }

  private updateFrame() {
    this._deltaTime.calculate()
    this.internalUpdate()
    this.update()
    this._gameSystemRepository.updateAfterGameSystems(this._deltaTime)
    this._gameObjectRepository.removeGameObjectsDestroyed()
    this.draw()

    if (this._isRunning) {
      this._animationFrame = requestAnimationFrame(() => this.updateFrame())
    }
  }

  private internalUpdate() {
    this._gameSystemRepository.updateGameSystems(this._deltaTime)
    this._gameObjectRepository.updateGameObjects(this._deltaTime)
  }

  update() { }
  draw() { }

  addGameObject(...gameObjects: IGameObject[]) {
    this._gameObjectRepository.addGameObject(...gameObjects)
  }

  addGameSystem(...gameSystems: IGameSystem[]) {
    this._gameSystemRepository.addGameSystem(...gameSystems)
  }
}