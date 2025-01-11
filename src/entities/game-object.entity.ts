import { DeltaTime } from '../utils/index.js'
import { ContextRender2D, IGameObject } from '../interfaces/index.js'
import { TransformComponent } from '../components/transform.component.js'

export class GameObject implements IGameObject {

  private _isDestroyed = false

  readonly transform = new TransformComponent()

  wakeUp() { }
  update(deltaTime: DeltaTime) { }
  render(ctx: ContextRender2D) { }
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
}