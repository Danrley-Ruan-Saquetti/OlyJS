import { GameObject } from '../entities/game-object.js'

export class GameObjectRepository {

  private gameObjects: GameObject[] = []

  reset() {
    this.gameObjects = []
  }

  addGameObject(gameObject: GameObject) {
    this.gameObjects.push(gameObject)
  }

  removeGameObject(gameObject: GameObject) {
    const index = this.gameObjects.indexOf(gameObject)

    if (index >= 0) {
      this.gameObjects.splice(index, 1)
    }
  }

  getGameObjects() {
    return this.gameObjects
  }
}