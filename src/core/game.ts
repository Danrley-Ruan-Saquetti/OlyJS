import { GameEngine } from './game-engine.js'
import {
  GameSystem,
  KeyboardSystem,
  GameObjectSystem,
  MouseSystem,
  RenderSystem
} from '../systems/index.js'
import { GameObject } from '../entities/index.js'
import { Listener, ListenerHandle, ObserverListener } from '../utils/index.js'
import { Class } from '../types/index.js'
import { Transform } from '../components/transform.component.js'

export class Game extends GameEngine {

  private gameObjectSystem = new GameObjectSystem(this)
  private observerListener = new ObserverListener()

  private gameSystems: GameSystem[] = []

  protected camera = new Transform(null!)

  constructor(public canvas: HTMLCanvasElement) {
    super()
  }

  protected initializeEngine() {
    this.gameSystems.push(
      this.gameObjectSystem,
      new RenderSystem(this, this.canvas, this.camera),
      new KeyboardSystem(),
      new MouseSystem(this.canvas),
    )
  }

  protected startObjects() {
    const len = this.gameSystems.length
    let i = 0

    while (i < len) {
      this.gameSystems[i].start()
      i++
    }
  }

  protected stopObjects() {
    const len = this.gameSystems.length
    let i = 0

    while (i < len) {
      this.gameSystems[i].stop()
      i++
    }
  }

  updateBefore() {
    const len = this.gameSystems.length
    let i = 0

    while (i < len) {
      this.gameSystems[i].updateBefore(this.deltaTime)
      i++
    }
  }

  update() {
    const len = this.gameSystems.length
    let i = 0

    while (i < len) {
      this.gameSystems[i].update(this.deltaTime)
      i++
    }
  }

  updateAfter() {
    const len = this.gameSystems.length
    let i = 0

    while (i < len) {
      this.gameSystems[i].updateAfter(this.deltaTime)
      i++
    }
  }

  instantiate<T extends Class<typeof GameObject>>(classGameObject: T) {
    const gameObject = this.gameObjectSystem.instantiate(classGameObject)

    this.emit('game/game-object/instantiate', gameObject)

    return gameObject as InstanceType<T>
  }

  destroy(gameObject: GameObject) {
    this.gameObjectSystem.destroy(gameObject)
  }

  on(event: string, handler: ListenerHandle) {
    return this.observerListener.on(event, handler)
  }

  off(event: string, listener: Listener) {
    return this.observerListener.off(event, listener)
  }

  protected emit(event: string, data: any) {
    this.observerListener.emit(event, data)
  }
}
