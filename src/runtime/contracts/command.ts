export type CommandListener<T = any> = (data: T) => void

export interface ICommandDomain {
  flush(): void
}

export interface ICommandDomainRegister {
  register(command: ICommandDomain): void
}
