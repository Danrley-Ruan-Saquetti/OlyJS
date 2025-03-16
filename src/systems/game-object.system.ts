import { Game } from './../core/index.js'
import { GameSystem } from './game-system.js'
import { GameObject } from '../entities/index.js'
import { GameObjectRepository } from '../repositories/index.js'
import { DeltaTime } from '../utils/delta-time.js'
import { IQueue } from '../interfaces/queue.interface.js'
import { Queue } from '../utils/queue.js'
import { GameComponent } from '../components/game-component.js'

export class GameObjectSystem extends GameSystem {

  private gameObjectRepository = new GameObjectRepository()

  private gameObjectToStartQueue: IQueue<GameObject> = new Queue()
  private gameObjectToDestroyQueue: IQueue<GameObject> = new Queue()

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

    this.gameObjectToStartQueue.enqueue(gameObject)

    gameObject.on('game-object/component/add', (gameComponent: GameComponent) => {

    })

    return gameObject
  }

  destroy(gameObject: GameObject) {
    this.gameObjectToDestroyQueue.enqueue(gameObject)
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
    for (const gameObject of this.gameObjectToStartQueue.iterator()) {
      gameObject.start()

      this.gameObjectRepository.addGameObject(gameObject)
    }
  }

  private removeGameObjects() {
    for (const gameObject of this.gameObjectToDestroyQueue.iterator()) {
      this.gameObjectRepository.removeGameObject(gameObject)
    }
  }
}
