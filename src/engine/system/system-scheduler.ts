import { ISystem } from '../../ecs/system'
import { EngineContext } from '../../runtime/contracts/context/engine.context'
import { SystemContext } from '../../runtime/contracts/context/system.context'

export class SystemScheduler {

  protected readonly systems: ISystem[] = []

  constructor(
    protected readonly context: EngineContext
  ) { }

  register(system: ISystem) {
    this.systems.push(system)

    system.initialize(this.context)
  }

  startAll() {
    let i = 0, length = this.systems.length
    while (i < length) {
      this.systems[i].start()
      i++
    }
  }

  stopAll() {
    let i = 0, length = this.systems.length
    while (i < length) {
      this.systems[i].stop()
      i++
    }
  }

  tickAll(context: SystemContext) {
    let i = 0, length = this.systems.length
    while (i < length) {
      this.systems[i].update(context)
      i++
    }
  }
}
