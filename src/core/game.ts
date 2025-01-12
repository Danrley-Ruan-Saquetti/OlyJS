import { DeltaTime } from '../utils/index.js'
import { CameraGameObject } from '../entities/index.js'
import { IGameObject, IGameSystem } from '../interfaces/index.js'
import { KeyboardSystem, RenderSystem2D } from '../systems/index.js'
import { GameObjectRepository, GameSystemRepository } from '../repositories/index.js'

export class Game {

  private _animationFrame: number
  private _isRunning: boolean
  private _deltaTime: DeltaTime
  private _gameObjectRepository: GameObjectRepository
  private _gameSystemRepository: GameSystemRepository
  private _cameraGameObject: CameraGameObject

  get deltaTime() { return this._deltaTime }
  get camera() { return this._cameraGameObject }

  constructor(
    protected canvas: HTMLCanvasElement
  ) {
    this.initComponents()
  }

  initComponents() {
    this.resetComponents()
  }

  resetComponents() {
    this._animationFrame = 0
    this._isRunning = false
    this._gameObjectRepository = new GameObjectRepository()
    this._gameSystemRepository = new GameSystemRepository()
    this._deltaTime = new DeltaTime()
    this._cameraGameObject = new CameraGameObject()
  }

  start() {
    if (this._isRunning) {
      throw 'Game already running'
    }

    this.resetComponents()
    this.prepareObjects()
    this.initializeObjects()
    this._isRunning = true
    this._deltaTime.start()
    this.updateFrame()
  }

  protected prepareObjects() {
    this.addGameSystem(
      new KeyboardSystem(),
      new RenderSystem2D(
        this.canvas,
        this._gameObjectRepository,
        this._cameraGameObject
      )
    )
    this.addGameObject(
      this._cameraGameObject
    )
  }

  protected initializeObjects() {
    this._gameObjectRepository.startGameObjects()
    this._gameSystemRepository.startGameSystems()

    this._cameraGameObject.transform.moveTo({
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
      z: 0
    })
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

    if (this._isRunning) {
      this._animationFrame = requestAnimationFrame(() => this.updateFrame())
    }
  }

  private internalUpdate() {
    this._gameSystemRepository.updateGameSystems(this._deltaTime)
    this._gameObjectRepository.updateGameObjects(this._deltaTime)
  }

  update() { }

  addGameObject(...gameObjects: IGameObject[]) {
    this._gameObjectRepository.addGameObject(...gameObjects)
  }

  addGameSystem(...gameSystems: IGameSystem[]) {
    this._gameSystemRepository.addGameSystem(...gameSystems)
  }
}