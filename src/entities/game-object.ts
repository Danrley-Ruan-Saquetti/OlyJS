import { Game } from '../core/index.js'
import { GameComponent, Transform } from '../components/index.js'

export class GameObject {

  transform = new Transform()

  private gameComponents: GameComponent[] = []

  get time() { return this._game.deltaTime }

  constructor(private _game: Game) { }

  awake() { }
  start() { }
  update() { }

  destroy(gameObject: GameObject) {
    this._game.destroy(gameObject)
  }

  instantiate<T extends GameObject>(classGameObject: new (...args: ConstructorParameters<typeof GameObject>) => T) {
    return this._game.instantiate(classGameObject)
  }

  addComponent(gameComponent: GameComponent) {
    this.gameComponents.push(gameComponent)
  }

  getComponent<T extends GameComponent>(classGameComponent: new (...args: any[]) => T) {
    const gameComponent = this.gameComponents.find(gameComponent => gameComponent instanceof classGameComponent)

    if (!gameComponent) {
      throw new Error(`Component "${classGameComponent.name}" not found`)
    }

    return gameComponent as T
  }

  removeComponent(gameComponent: GameComponent) {
    const index = this.gameComponents.indexOf(gameComponent)

    if (index >= 0) {
      this.gameComponents.splice(index, 1)
    }
  }
}
