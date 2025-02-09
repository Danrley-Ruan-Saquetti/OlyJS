import { CameraGameObject } from '../entities/index.js'
import { IGameObject, IGameSystem } from '../interfaces/index.js'
import { KeyboardSystem, RenderSystem2D, MouseSystem, TimeoutSystem, CameraSystem } from '../systems/index.js'
import { GameObjectRepository, GameSystemRepository } from '../repositories/index.js'
import { GameEngine } from './game-engine.js'

export class Game extends GameEngine {

  private _gameObjectRepository = new GameObjectRepository()
  private _gameSystemRepository = new GameSystemRepository()

  protected renderSystem = new RenderSystem2D(this._canvas, this._gameObjectRepository)
  protected cameraSystem = new CameraSystem(this._canvas)

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
      new MouseSystem(this._canvas),
      this.cameraSystem,
      this.renderSystem,
      new TimeoutSystem(),
    )
  }

  protected initializeScene() {
    this._gameObjectRepository.clear()

    this._cameraGameObject = new CameraGameObject()

    this.addGameObject(this._cameraGameObject)

    this.renderSystem.setCameraGameObject(this._cameraGameObject)
    this.cameraSystem.setCameraGameObject(this._cameraGameObject)
  }

  protected initializeObjects() {
    this._cameraGameObject.transform.moveTo({
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
      z: 0
    })
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
  }

  addGameSystem(...gameSystems: IGameSystem[]) {
    this._gameSystemRepository.addGameSystem(...gameSystems)
  }
}
