import { Game } from '../core/index.js'
import { GameComponent, Transform } from '../components/index.js'
import { Container } from '../util/container.js'

export class GameObject {

  transform = new Transform()

  private gameContainer = new Container<GameComponent>()
  private tagContainer = new Container<string>()

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
    this.gameContainer.add(gameComponent)
  }

  getComponent<T extends GameComponent>(classGameComponent: new (...args: any[]) => T) {
    const gameComponent = this.gameContainer.getItens().find(gameComponent => gameComponent instanceof classGameComponent)

    if (!gameComponent) {
      throw new Error(`Component "${classGameComponent.name}" not found`)
    }

    return gameComponent as T
  }

  removeComponent(gameComponent: GameComponent) {
    this.gameContainer.remove(gameComponent)
  }

  addTag(tag: string) {
    this.tagContainer.add(tag)
  }

  removeTag(tag: string) {
    this.tagContainer.remove(tag)
  }

  hasTag(tag: string) {
    return this.tagContainer.contains(tag)
  }
}
