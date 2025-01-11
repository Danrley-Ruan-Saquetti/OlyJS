import { IMonoBehaviour } from './mono-behaviour.interface.js'
import { IRenderable } from './renderable.interface.js'

export interface IGameObject extends IMonoBehaviour, IRenderable {
  destroy(): void
  startComponents?(): void
  onDestroy?(): void
  isDestroyed(): boolean
}