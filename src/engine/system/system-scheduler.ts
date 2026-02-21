import { SystemInitializeContext, SystemUpdateContext } from '../../contracts/context/system.context'
import { ISystem } from '../../ecs/system'

export class SystemScheduler {

  private readonly systems: ISystem[] = []
  private readonly startSystems: ISystem[] = []
  private readonly stopSystems: ISystem[] = []
  private readonly updateBeforeSystems: ISystem[] = []
  private readonly updateSystems: ISystem[] = []
  private readonly updateAfterSystems: ISystem[] = []

  private isStarted = false

  constructor(
    protected readonly context: SystemInitializeContext
  ) { }

  register(system: ISystem) {
    system.initialize?.(this.context)

    this.systems.push(system)

    if (system.start) this.startSystems.push(system)
    if (system.stop) this.stopSystems.push(system)
    if (system.updateBefore) this.updateBeforeSystems.push(system)
    if (system.update) this.updateSystems.push(system)
    if (system.updateAfter) this.updateAfterSystems.push(system)

    if (this.isStarted && system.start) {
      system.start()
    }
  }

  start() {
    this.isStarted = true

    let i = 0, length = this.startSystems.length
    while (i < length) {
      this.startSystems[i].start!()
      i++
    }
  }

  stop() {
    this.isStarted = false

    let i = 0, length = this.stopSystems.length
    while (i < length) {
      this.stopSystems[i].stop!()
      i++
    }
  }

  tick(context: SystemUpdateContext) {
    this.tickBefore(context)
    this.tickUpdate(context)
    this.tickAfter(context)
  }

  private tickBefore(context: SystemUpdateContext) {
    let i = 0, length = this.updateBeforeSystems.length
    while (i < length) {
      this.updateBeforeSystems[i].updateBefore!(context)
      i++
    }
  }

  private tickUpdate(context: SystemUpdateContext) {
    let i = 0, length = this.updateSystems.length
    while (i < length) {
      this.updateSystems[i].update!(context)
      i++
    }
  }

  private tickAfter(context: SystemUpdateContext) {
    let i = 0, length = this.updateAfterSystems.length
    while (i < length) {
      this.updateAfterSystems[i].updateAfter!(context)
      i++
    }
  }
}
