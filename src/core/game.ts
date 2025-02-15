import { CameraGameObject } from '../entities/index.js'
import { IGameObject, IGameSystem } from '../interfaces/index.js'
import { KeyboardSystem, Render2DSystem, MouseSystem, TimeoutSystem, CameraSystem } from '../systems/index.js'
import { GameObjectRepository, GameSystemRepository } from '../repositories/index.js'
import { GameEngine } from './game-engine.js'

export class Game extends GameEngine {

  private _gameObjectRepository = new GameObjectRepository()
  private _gameSystemRepository = new GameSystemRepository()

  protected renderSystem = new Render2DSystem(this._canvas, this._gameObjectRepository)
  protected cameraSystem = new CameraSystem(this._canvas)
  protected mouseSystem = new MouseSystem(this._canvas)

  private _cameraGameObject: CameraGameObject

  get cameraGameObject() { return this._cameraGameObject }

  get canvas() { return this._canvas }

  constructor(
    private _canvas: HTMLCanvasElement
  ) {
    super()
  }

  static async Bootstrap(canvas: HTMLCanvasElement) {
    const game = new this(canvas)
    await game.bootstrap()

    return game
  }

  start() {
    try {
      this.initializeScene()
      this.startSystemObjects()
      this.startGameObjects()
      this.initializeObjects()
      super.triggerStart()
    } catch (error: any) {
      this.onError(error)
    }
  }

  protected initializeEngine() {
    this.addGameSystem(
      new KeyboardSystem(),
      this.mouseSystem,
      this.cameraSystem,
      this.renderSystem,
      new TimeoutSystem(),
    )
  }

  protected initializeScene() {
    this._gameObjectRepository.clear()

    this._cameraGameObject = new CameraGameObject(this._canvas)

    this.addGameObject(this._cameraGameObject)

    this.renderSystem.setCameraGameObject(this._cameraGameObject)
    this.cameraSystem.setCameraGameObject(this._cameraGameObject)
    this.mouseSystem.setCameraGameObject(this._cameraGameObject)
  }

  protected startGameObjects() {
    this._gameObjectRepository.start()
  }

  protected startSystemObjects() {
    this._gameSystemRepository.start()
  }

  protected stopObjects() {
    this._gameObjectRepository.stop()
    this._gameSystemRepository.stop()
  }

  protected updateObjects() {
    this._gameSystemRepository.update(this.deltaTime)
    this._gameObjectRepository.update(this.deltaTime)
  }

  protected updateAfter() {
    this._gameSystemRepository.updateAfter(this.deltaTime)
    this._gameObjectRepository.removeDestroyed()
  }

  addGameObject(...gameObjects: IGameObject[]) {
    this._gameObjectRepository.addGameObject(...gameObjects)

    if (this.isRunning) {
      const length = gameObjects.length

      let i = 0
      while (i < length) {
        gameObjects[i].start()
        i++
      }
    }
  }

  addGameSystem(...gameSystems: IGameSystem[]) {
    this._gameSystemRepository.addGameSystem(...gameSystems)

    if (this.isRunning) {
      const length = gameSystems.length

      let i = 0
      while (i < length) {
        gameSystems[i].start()
        i++
      }
    }
  }
}
