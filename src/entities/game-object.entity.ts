import { CanvasRenderer, DeltaTime } from '../utils/index.js'
import { IContainerComponent, IGameObject } from '../interfaces/index.js'
import { GameComponent, TransformComponent } from '../components/index.js'
import { ContainerComponentRepository } from '../repositories/index.js'

export class GameObject implements IGameObject, IContainerComponent {

  private _isDestroyed = false
  private containerComponent = new ContainerComponentRepository()

  readonly transform = new TransformComponent()

  wakeUp() { }
  update(deltaTime: DeltaTime) { }
  render(canvasRenderer: CanvasRenderer) { }
  onDestroy() { }

  start() {
    this._isDestroyed = false
  }

  destroy() {
    this.onDestroy()
    this._isDestroyed = true
  }

  isDestroyed() {
    return this._isDestroyed
  }

  addComponent(...components: GameComponent[]) {
    return this.containerComponent.addComponent(...components)
  }

  hasComponent(classComponent: new (...args: any) => GameComponent) {
    return this.containerComponent.hasComponent(classComponent)
  }

  getComponent<T extends GameComponent>(classComponent: new (...args: any) => T) {
    return this.containerComponent.getComponent(classComponent)
  }

  getComponents() {
    return this.containerComponent.getComponents()
  }
}