import { CommandName } from '../../runtime/contracts/command'
import { IEventBus } from '../events/types'
import { CommandBuffer } from './command-buffer'
import { IBufferedCommandQueue } from './types'

export class CommandDispatcher {

  protected commandQueue: IBufferedCommandQueue = new CommandBuffer()

  constructor(
    private readonly emitter: IEventBus
  ) { }

  send(event: CommandName, data: unknown) {
    this.commandQueue.send(event, data)
  }

  execute() {
    const count = this.commandQueue.flush()

    let i = 0
    while (i < count) {
      this.emitter.emit(
        this.commandQueue.getFlushedKey(i),
        this.commandQueue.getFlushedData(i)
      )
      i++
    }
  }
}
