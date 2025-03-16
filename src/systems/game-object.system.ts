import { Game } from './../core/index.js'
import { GameSystem } from './game-system.js'
import { GameObject } from '../entities/index.js'
import { GameObjectRepository } from '../repositories/index.js'
import { DeltaTime } from '../util/delta-time.js'

export class GameObjectSystem extends GameSystem {

  private gameObjectRepository = new GameObjectRepository()

  private gameObjectsInQueueToStart: GameObject[] = []
  private gameObjectsInQueueToDestroy: GameObject[] = []

  constructor(private _game: Game) {
    super()
  }

  updateBefore(deltaTime: DeltaTime) {
    this.startInQueueToStart()
  }

  update(deltaTime: DeltaTime) {
    this.updateGameObject(deltaTime)
  }

  updateAfter(deltaTime: DeltaTime) {
    this.removeGameObjects()
  }

  instantiate<T extends GameObject>(classGameObject: new (...args: ConstructorParameters<typeof GameObject>) => T) {
    const gameObject = new classGameObject(this._game)

    gameObject.awake()

    this.gameObjectsInQueueToStart.push(gameObject)

    return gameObject
  }

  destroy(gameObject: GameObject) {
    this.gameObjectsInQueueToDestroy.push(gameObject)
  }

  private updateGameObject(deltaTime: DeltaTime) {
    const gameObjects = this.gameObjectRepository.getGameObjects()

    const len = gameObjects.length
    let i = 0

    while (i < len) {
      gameObjects[i].update(deltaTime)
      i++
    }
  }

  private startInQueueToStart() {
    while (this.gameObjectsInQueueToStart.length > 0) {
      const gameObject = this.gameObjectsInQueueToStart.shift()!

      gameObject.start()

      this.gameObjectRepository.addGameObject(gameObject)
    }
  }

  private removeGameObjects() {
    while (this.gameObjectsInQueueToDestroy.length > 0) {
      const gameObject = this.gameObjectsInQueueToDestroy.shift()!

      this.gameObjectRepository.removeGameObject(gameObject)
    }
  }
}
