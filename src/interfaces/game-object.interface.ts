import { IDestroyable } from './destroyable.interface.js'
import { IMonoBehaviour } from './mono-behaviour.interface.js'
import { IRenderable } from './renderable.interface.js'

export interface IGameObject extends IMonoBehaviour, IRenderable, IDestroyable {
  startComponents?(): void
}