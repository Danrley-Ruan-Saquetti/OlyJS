import { GameComponent } from '../components/index.js'
import { IContainerComponent } from '../interfaces/index.js'

export class ContainerComponentRepository implements IContainerComponent {

  private components: GameComponent[] = []

  addComponent(...components: GameComponent[]) {
    this.components.push(...components)
  }

  hasComponent(classComponent: new (...args: any) => GameComponent) {
    return !!this.getComponent(classComponent)
  }

  getComponent<T extends GameComponent>(classComponent: new (...args: any) => T) {
    const length = this.components.length

    let i = 0
    while (i < length) {
      if (this.components[i] instanceof classComponent) {
        return this.components[i] as T
      }

      i++
    }

    return null
  }

  getComponentsFrom<T extends GameComponent>(classComponent: new (...args: any) => T) {
    return this.components.filter(gameComponent => gameComponent instanceof classComponent) as T[]
  }

  getComponents() {
    return this.components
  }

  clear() {
    this.components = []
  }
}