import { Game } from './../core/index.js'
import { GameSystem } from './game-system.js'
import { GameObject } from '../entities/index.js'
import { GameObjectRepository } from '../repositories/index.js'
import { DeltaTime, Queue, ContainerList } from '../utils/index.js'
import { IQueue } from '../interfaces/index.js'
import { Class } from '../types/index.js'

export class GameObjectSystem extends GameSystem {

  private gameObjectRepository = new GameObjectRepository()

  private gameObjectToStartQueue: IQueue<GameObject> = new Queue()
  private gameObjectToDestroyQueue: IQueue<GameObject> = new Queue()

  private gameObjectsActiveContainer = new ContainerList<GameObject>()

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

  instantiate<T extends Class<typeof GameObject>>(classGameObject: T) {
    const gameObject = new classGameObject(this._game)

    let isStartOnFirstActivate = false

    gameObject.on('game-object/active', (gameObject: GameObject) => {
      if (isStartOnFirstActivate) {
        this.gameObjectToStartQueue.enqueue(gameObject)

        isStartOnFirstActivate = false
      }

      this.onActiveGameObject(gameObject)
    })

    gameObject.on('game-object/inactive', (gameObject: GameObject) => {
      this.onInactiveGameObject(gameObject)
    })

    gameObject.awake()

    if (gameObject.isActive) {
      this.onActiveGameObject(gameObject)
      this.gameObjectToStartQueue.enqueue(gameObject)
    }
    else {
      isStartOnFirstActivate = true
    }

    return gameObject
  }

  destroy(gameObject: GameObject) {
    this.onInactiveGameObject(gameObject)
    this.gameObjectToDestroyQueue.enqueue(gameObject)
  }

  onActiveGameObject(gameObject: GameObject) {
    this.gameObjectsActiveContainer.add(gameObject)
  }

  onInactiveGameObject(gameObject: GameObject) {
    this.gameObjectsActiveContainer.remove(gameObject)
  }

  private updateGameObject(deltaTime: DeltaTime) {
    const gameObjects = this.gameObjectsActiveContainer.getItens()

    const len = gameObjects.length
    let i = 0

    while (i < len) {
      gameObjects[i].update(deltaTime)
      i++
    }
  }

  private startInQueueToStart() {
    for (const gameObject of this.gameObjectToStartQueue.toIterator()) {
      gameObject.start()

      this.gameObjectRepository.addGameObject(gameObject)
    }
  }

  private removeGameObjects() {
    for (const gameObject of this.gameObjectToDestroyQueue.toIterator()) {
      this.gameObjectRepository.removeGameObject(gameObject)
    }
  }
}
