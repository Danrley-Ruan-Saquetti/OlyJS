import { CommandHandler } from '../../runtime/contracts/command'

export class CommandDispatcher {

  private handlers: Record<string, CommandHandler> = Object.create(null)

  register(event: string, handler: CommandHandler) {
    if (this.handlers[event]) {
      throw new Error(`Command handler already registered for: ${event}`)
    }

    this.handlers[event] = handler
  }

  dispatch(event: string, data: unknown) {
    const handler = this.handlers[event]

    if (!handler) {
      return
    }

    return handler(data)
  }

  clear(event?: string) {
    if (event) {
      delete this.handlers[event]
    } else {
      this.handlers = Object.create(null)
    }
  }
}
