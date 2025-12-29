export type CommandHandler<T = unknown> = (data: T) => void

export interface ICommandRegister {
  register(event: string, handler: CommandHandler): void
}

export interface ICommandSender {
  send(event: string, data: unknown): void
}

export interface ICommandPublisher extends
  ICommandRegister,
  ICommandSender { }
