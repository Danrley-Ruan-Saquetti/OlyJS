import { Game } from '../core/index.js'
import { GameComponent, Transform } from '../components/index.js'
import { Container, DeltaTime, Listener, ListenerHandle, ObserverListener } from '../util/index.js'

export class GameObject {

  readonly transform = new Transform()

  private gameContainer = new Container<GameComponent>()
  private tagContainer = new Container<string>()

  private observerListener = new ObserverListener()

  get time() { return this._game.deltaTime }

  constructor(private _game: Game) { }

  awake() { }
  start() { }
  update(deltaTime: DeltaTime) { }

  onDestroy() { }

  destroy(gameObject: GameObject) {
    gameObject.onDestroy()

    gameObject.emit('game-object/component/add', null)

    this._game.destroy(gameObject)
  }

  instantiate<T extends GameObject>(classGameObject: new (...args: ConstructorParameters<typeof GameObject>) => T) {
    return this._game.instantiate(classGameObject)
  }

  addComponent(gameComponent: GameComponent) {
    this.gameContainer.add(gameComponent)

    this.emit('game-object/component/add', gameComponent)
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

    this.emit('game-object/component/remove', gameComponent)
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
