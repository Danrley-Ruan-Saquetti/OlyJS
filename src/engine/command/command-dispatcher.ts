import { IDispatcher } from '../../runtime/buffer/type'
import { CommandHandler } from '../../runtime/contracts/command'
import { EventTuple } from '../../runtime/contracts/event'

export class CommandDispatcher implements IDispatcher<EventTuple> {

  private handlers: Record<string, CommandHandler> = Object.create(null)

  register(event: string, handler: CommandHandler) {
    if (this.handlers[event]) {
      throw new Error(`Command handler already registered for: ${event}`)
    }

    this.handlers[event] = handler
  }

  dispatch(event: EventTuple) {
    const handler = this.handlers[event[0]]

    if (!handler) {
      return
    }

    return handler(event[1])
  }

  clear(event?: string) {
    if (event) {
      delete this.handlers[event]
    } else {
      this.handlers = Object.create(null)
    }
  }
}
