import { CommandListener, ICommandDomain } from '../../contracts/engine/command'
import { EventTuple } from '../../contracts/engine/event'

export class CommandDomain implements ICommandDomain {

  private readonly buffers: EventTuple[][][] = []
  private activeBuffer = 0

  private readonly handlers = new Map<string, CommandListener>()
  private readonly priorities = new Map<string, number>()

  private get writeBuffer() {
    return this.buffers[this.activeBuffer]
  }

  private get readBuffer() {
    return this.buffers[this.activeBuffer ^ 1]
  }

  constructor(maxPriority = 8) {
    for (let b = 0; b < 2; b++) {
      this.buffers[b] = []
      for (let p = 0; p < maxPriority; p++) {
        this.buffers[b][p] = []
      }
    }
  }

  register(command: string, handler: CommandListener, priority = 0) {
    if (this.handlers.has(command)) {
      throw new Error(`Event "${command}" already registered for this command domain`)
    }

    this.handlers.set(command, handler)
    this.priorities.set(command, priority)
  }

  send(command: string, data: unknown) {
    const priority = this.priorities.get(command)!
    this.writeBuffer[priority].push([command, data])
  }

  flush() {
    this.activeBuffer ^= 1

    const buckets = this.readBuffer

    let p = 0, bucketLength = buckets.length
    while (p < bucketLength) {
      const queue = buckets[p]

      let i = 0, queueLength = queue.length
      while (i < queueLength) {
        const command = queue[i]
        this.handlers.get(command[0])!(command[1])

        i++
      }

      queue.length = 0
      p++
    }
  }
}
