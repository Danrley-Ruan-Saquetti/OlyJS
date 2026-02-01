import { SystemInitializeContext, SystemUpdateContext } from '../../contracts/context/system.context'
import { ISystem } from '../../ecs/system'

export class SystemScheduler {

  protected readonly systems: ISystem[] = []

  constructor(
    protected readonly context: SystemInitializeContext
  ) { }

  register(system: ISystem) {
    this.systems.push(system)

    system.initialize(this.context)
  }

  start() {
    let i = 0, length = this.systems.length
    while (i < length) {
      this.systems[i].start()
      i++
    }
  }

  stop() {
    let i = 0, length = this.systems.length
    while (i < length) {
      this.systems[i].stop()
      i++
    }
  }

  tick(context: SystemUpdateContext) {
    let i = 0, length = this.systems.length
    while (i < length) {
      this.systems[i].update(context)
      i++
    }
  }
}
