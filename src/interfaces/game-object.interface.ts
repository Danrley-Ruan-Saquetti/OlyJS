import { IMonoBehaviour } from './mono-behaviour.interface.js'

export interface IGameObject extends IMonoBehaviour {
  destroy(): void
  isDestroyed(): boolean
}