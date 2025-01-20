import { CanvasRenderer, DeltaTime } from '../utils/index.js'
import { IGameObject, Tag } from '../interfaces/index.js'
import { GameComponent, TransformComponent } from '../components/index.js'
import { ContainerComponentRepository, ContainerTagRepository } from '../repositories/index.js'

export class GameObject implements IGameObject {

  private _isDestroyed: boolean

  private _containerComponent: ContainerComponentRepository
  private _containerTag: ContainerTagRepository
  private _transform: TransformComponent

  get transform() { return this._transform }

  update(deltaTime: DeltaTime) { }
  render(canvasRenderer: CanvasRenderer) { }
  onDestroy() { }
  stop() { }

  start() {
    this._isDestroyed = false

    this._containerTag = new ContainerTagRepository()
    this._containerComponent = new ContainerComponentRepository()
    this._transform = new TransformComponent()

    this._containerComponent.addComponent(this._transform)
  }

  destroy() {
    this.onDestroy()
    this._isDestroyed = true
  }

  startComponents() {
    this._containerComponent.start()
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

  addTag(tag: Tag): void {
    this._containerTag.add(tag)
  }

  removeTag(tag: Tag): void {
    this._containerTag.remove(tag)
  }

  hasTag(...tags: Tag[]): void {
    this._containerTag.has(...tags)
  }

  getTags() {
    return Array.from<Tag>(this._containerTag.getTags())
  }
}