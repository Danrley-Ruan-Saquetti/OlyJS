import { GameEngine } from "./game-engine.js";
import { GameSystem, KeyboardSystem, GameObjectSystem, MouseSystem } from "../systems/index.js";
import { GameObject } from "../entities/index.js";

export class Game extends GameEngine {

  private gameObjectSystem = new GameObjectSystem(this)

  private gameSystems: GameSystem[] = []

  constructor(public canvas: HTMLCanvasElement) {
    super()
  }

  protected initializeEngine() {
    this.gameSystems.push(
      this.gameObjectSystem,
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
      this.gameSystems[i].updateBefore()
      i++
    }
  }

  update() {
    const len = this.gameSystems.length
    let i = 0

    while (i < len) {
      this.gameSystems[i].update()
      i++
    }
  }

  updateAfter() {
    const len = this.gameSystems.length
    let i = 0

    while (i < len) {
      this.gameSystems[i].updateAfter()
      i++
    }
  }

  instantiate<T extends GameObject>(classGameObject: new (...args: ConstructorParameters<typeof GameObject>) => T) {
    return this.gameObjectSystem.instantiate(classGameObject)
  }

  destroy(gameObject: GameObject) {
    this.gameObjectSystem.destroy(gameObject)
  }
}