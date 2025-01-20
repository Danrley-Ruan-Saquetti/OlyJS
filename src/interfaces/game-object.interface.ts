import { IContainerComponent } from './container-component.interface.js'
import { IDestroyable } from './destroyable.interface.js'
import { IMonoBehaviour } from './mono-behaviour.interface.js'
import { IRenderable } from './renderable.interface.js'
import { ITaggable } from './taggable.interface.js'

export interface IGameObject extends IMonoBehaviour, IRenderable, IDestroyable, IContainerComponent, ITaggable {
  startComponents(): void
}