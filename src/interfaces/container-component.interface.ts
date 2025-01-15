import { GameComponent } from '../components/index.js'

export interface IContainerComponent {
  clear(): void
  start(): void
  addComponent(...components: GameComponent[]): void
  hasComponent(classComponent: new (...args: any) => GameComponent): boolean
  getComponent<T extends GameComponent>(classComponent: new (...args: any) => T): T | null
  getComponentsFrom<T extends GameComponent>(classComponent: new (...args: any) => T): T[]
  getComponents(): GameComponent[]
}