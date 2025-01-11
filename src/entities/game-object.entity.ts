import { CanvasRenderer, DeltaTime } from '../utils/index.js'
import { IGameObject } from '../interfaces/index.js'
import { GameComponent, TransformComponent } from '../components/index.js'
import { ContainerComponentRepository } from '../repositories/index.js'

export class GameObject implements IGameObject {

  private _isDestroyed: boolean

  private _containerComponent: ContainerComponentRepository
  private _transform: TransformComponent

  get transform() { return this._transform }

  update(deltaTime: DeltaTime) { }
  render(canvasRenderer: CanvasRenderer) { }
  onDestroy() { }

  start() {
    this._isDestroyed = false

    this._containerComponent = new ContainerComponentRepository()
    this._transform = new TransformComponent()

    this._containerComponent.addComponent(this._transform)
  }

  destroy() {
    this.onDestroy()
    this._isDestroyed = true
  }

  startComponents() {
    const gameComponents = this._containerComponent.getComponents()
    const length = gameComponents.length

    let i = 0
    while (i < length) {
      gameComponents[i].start()
      i++
    }
  }

  isDestroyed() {
    return this._isDestroyed
  }

  addComponent(...components: GameComponent[]) {
    return this._containerComponent.addComponent(...components)
  }

  hasComponent(classComponent: new (...args: any) => GameComponent) {
    return this._containerComponent.hasComponent(classComponent)
  }

  getComponentsFrom<T extends GameComponent>(classComponent: new (...args: any) => T) {
    return this._containerComponent.getComponentsFrom(classComponent)
  }

  getComponent<T extends GameComponent>(classComponent: new (...args: any) => T) {
    return this._containerComponent.getComponent(classComponent)
  }

  getComponents() {
    return this._containerComponent.getComponents()
  }
}