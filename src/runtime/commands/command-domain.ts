import { CommandListener, ICommandDomain } from '../contracts/command'
import { EventTuple } from '../contracts/event'
import { CommandListenerAlreadyRegisteredException } from './exceptions/command-listener-already-registered.exception'

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

  register(command: string, handler: CommandListener, priority = 0) {
    if (this.handlers.has(command)) {
      throw new CommandListenerAlreadyRegisteredException(command)
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

    for (let p = 0; p < buckets.length; p++) {
      const queue = buckets[p]

      for (let i = 0; i < queue.length; i++) {
        const [command, data] = queue[i]
        this.handlers.get(command)!(data)
      }

      queue.length = 0
    }
  }
}
