import { Game } from '../core/index.js'
import { GameComponent, Transform } from '../components/index.js'
import { ContainerList, DeltaTime, Listener, ListenerHandle, ObserverListener } from '../utils/index.js'
import { Class } from '../types/index.js'

export class GameObject {

  readonly transform = new Transform(this)

  private gameContainer = new ContainerList<GameComponent>()
  private tagContainer = new ContainerList<string>()

  private observerListener = new ObserverListener()

  private _isActive = true

  get time() { return this._game.deltaTime }

  get isActive() { return this._isActive }

  constructor(private _game: Game) { }

  awake() { }
  start() { }
  update(deltaTime: DeltaTime) { }

  onDestroy() { }

  destroy(gameObject: GameObject) {
    gameObject.onDestroy()

    gameObject.emit('game-object/destroy', null)

    this._game.destroy(gameObject)
  }

  instantiate<T extends Class<typeof GameObject>>(classGameObject: T) {
    return this._game.instantiate(classGameObject)
  }

  addComponent<T extends Class<typeof GameComponent>>(classGameComponent: T) {
    const gameComponent = new classGameComponent(this)

    this.addInstanceComponent(gameComponent)

    return gameComponent as InstanceType<T>
  }

  addInstanceComponent(gameComponent: GameComponent) {
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

  setActive(value: boolean) {
    if (value == this._isActive) {
      return
    }

    this._isActive = value

    if (this._isActive) {
      this.emit('game-object/active', this)
    } else {
      this.emit('game-object/inactive', this)
    }
  }
}
