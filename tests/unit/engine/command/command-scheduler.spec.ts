import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CommandScheduler } from '../../../../src/engine/command/command-scheduler'

describe('Engine: CommandScheduler', () => {
  let scheduler: CommandScheduler

  beforeEach(() => {
    scheduler = new CommandScheduler()
  })

  it('flushAll não lança erro quando não há domínios registrados', () => {
    expect(() => scheduler.flushAll()).not.toThrow()
  })

  it('chama flush em um único domínio', () => {
    const domain = { flush: vi.fn() }

    scheduler.register(domain)

    scheduler.flushAll()

    expect(domain.flush).toHaveBeenCalledTimes(1)
  })

  it('chama flush em múltiplos domínios na ordem de registro', () => {
    const calls: number[] = []

    const d1 = { flush: vi.fn(() => calls.push(1)) }
    const d2 = { flush: vi.fn(() => calls.push(2)) }
    const d3 = { flush: vi.fn(() => calls.push(3)) }

    scheduler.register(d1)
    scheduler.register(d2)
    scheduler.register(d3)

    scheduler.flushAll()

    expect(calls).toEqual([1, 2, 3])
    expect(d1.flush).toHaveBeenCalledTimes(1)
    expect(d2.flush).toHaveBeenCalledTimes(1)
    expect(d3.flush).toHaveBeenCalledTimes(1)
  })

  it('não executa domínios adicionados durante flush na mesma chamada (snapshot behavior)', () => {
    const calls: string[] = []

    const newDomain = {
      flush: vi.fn(() => calls.push('new'))
    }

    const addingDomain = {
      flush: vi.fn(() => {
        calls.push('adding')
        scheduler.register(newDomain)
      })
    }

    const lastDomain = {
      flush:
        vi.fn(() => calls.push('last'))
    }

    scheduler.register(addingDomain)
    scheduler.register(lastDomain)

    scheduler.flushAll()

    expect(calls).toEqual(['adding', 'last'])
    expect(addingDomain.flush).toHaveBeenCalledTimes(1)
    expect(lastDomain.flush).toHaveBeenCalledTimes(1)
    expect(newDomain.flush).toHaveBeenCalledTimes(0)

    scheduler.flushAll()

    expect(newDomain.flush).toHaveBeenCalledTimes(1)
    expect(calls).toEqual(['adding', 'last', 'adding', 'last', 'new'])
  })

  it('se um domínio lançar erro durante flush, a exceção é propagada e domínios seguintes não são chamados', () => {
    const good = { flush: vi.fn() }
    const bad = { flush: vi.fn(() => { throw new Error('boom') }) }
    const after = { flush: vi.fn() }

    scheduler.register(good)
    scheduler.register(bad)
    scheduler.register(after)

    expect(() => scheduler.flushAll()).toThrow('boom')

    expect(good.flush).toHaveBeenCalledTimes(1)
    expect(bad.flush).toHaveBeenCalledTimes(1)
    expect(after.flush).toHaveBeenCalledTimes(0)
  })

  it('permite registrar o mesmo domínio múltiplas vezes e chama flush por ocorrência', () => {
    const domain = { flush: vi.fn() }

    scheduler.register(domain)
    scheduler.register(domain)

    scheduler.flushAll()

    expect(domain.flush).toHaveBeenCalledTimes(2)
  })
})
