import { ICommandDomain } from '../../runtime/contracts/command'

export class CommandScheduler {

  private readonly domains: ICommandDomain[] = []

  register(domain: ICommandDomain) {
    this.domains.push(domain)
  }

  flushAll() {
    let i = 0, length = 0
    while (i < length) {
      this.domains[i].flush()
      i++
    }
  }
}
