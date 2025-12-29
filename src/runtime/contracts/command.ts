import { ListenerHandler } from './event'

export type CommandHandler<T = unknown> = ListenerHandler<T>

export interface ICommandRegister {
  register(event: string, handler: CommandHandler): void
}

export interface ICommandSender {
  send(event: string, data: unknown): void
}

export interface ICommandPublisher extends
  ICommandRegister,
  ICommandSender { }
