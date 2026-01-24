import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EngineContext } from '../../../src/contracts/context/engine.context'
import { SystemContext } from '../../../src/contracts/context/system.context'
import { SystemScheduler } from '../../../src/engine/system/system-scheduler'

describe('Engine: SystemScheduler', () => {
  let scheduler: SystemScheduler
  const ctx = {} as EngineContext

  beforeEach(() => {
    scheduler = new SystemScheduler(ctx)
  })

  it('não lança quando não há sistemas e start/stop/tick são chamados', () => {
    expect(() => scheduler.startAll()).not.toThrow()
    expect(() => scheduler.stopAll()).not.toThrow()
    expect(() => scheduler.tickAll({} as SystemContext)).not.toThrow()
  })

  it('register chama initialize com o EngineContext', () => {
    const system = { initialize: vi.fn(), start: vi.fn(), stop: vi.fn(), update: vi.fn() }

    scheduler.register(system as any)

    expect(system.initialize).toHaveBeenCalledTimes(1)
    expect(system.initialize).toHaveBeenCalledWith(ctx)
  })

  it('startAll chama start em todos na ordem de registro', () => {
    const calls: number[] = []

    const s1 = { initialize: vi.fn(), start: vi.fn(() => calls.push(1)), stop: vi.fn(), update: vi.fn() }
    const s2 = { initialize: vi.fn(), start: vi.fn(() => calls.push(2)), stop: vi.fn(), update: vi.fn() }
    const s3 = { initialize: vi.fn(), start: vi.fn(() => calls.push(3)), stop: vi.fn(), update: vi.fn() }

    scheduler.register(s1 as any)
    scheduler.register(s2 as any)
    scheduler.register(s3 as any)

    scheduler.startAll()

    expect(calls).toEqual([1, 2, 3])
  })

  it('stopAll chama stop em todos na ordem de registro', () => {
    const calls: number[] = []

    const s1 = { initialize: vi.fn(), start: vi.fn(), stop: vi.fn(() => calls.push(1)), update: vi.fn() }
    const s2 = { initialize: vi.fn(), start: vi.fn(), stop: vi.fn(() => calls.push(2)), update: vi.fn() }

    scheduler.register(s1 as any)
    scheduler.register(s2 as any)

    scheduler.stopAll()

    expect(calls).toEqual([1, 2])
  })

  it('tickAll chama update com o SystemContext fornecido', () => {
    const ctx = { frame: 1 } as unknown as SystemContext

    const s1 = { initialize: vi.fn(), start: vi.fn(), stop: vi.fn(), update: vi.fn((c: any) => expect(c).toBe(ctx)) }
    const s2 = { initialize: vi.fn(), start: vi.fn(), stop: vi.fn(), update: vi.fn((c: any) => expect(c).toBe(ctx)) }

    scheduler.register(s1 as any)
    scheduler.register(s2 as any)

    scheduler.tickAll(ctx)

    expect(s1.update).toHaveBeenCalledTimes(1)
    expect(s2.update).toHaveBeenCalledTimes(1)
  })

  it('se um start lançar, a exceção é propagada e os sistemas seguintes não são chamados', () => {
    const good = { initialize: vi.fn(), start: vi.fn(), stop: vi.fn(), update: vi.fn() }
    const bad = { initialize: vi.fn(), start: vi.fn(() => { throw new Error('boom') }), stop: vi.fn(), update: vi.fn() }
    const after = { initialize: vi.fn(), start: vi.fn(), stop: vi.fn(), update: vi.fn() }

    scheduler.register(good as any)
    scheduler.register(bad as any)
    scheduler.register(after as any)

    expect(() => scheduler.startAll()).toThrow('boom')

    expect(good.start).toHaveBeenCalledTimes(1)
    expect(bad.start).toHaveBeenCalledTimes(1)
    expect(after.start).toHaveBeenCalledTimes(0)
  })

  it('sistemas adicionados durante startAll não são iniciados na mesma chamada (snapshot behavior)', () => {
    const calls: string[] = []

    const newSystem = { initialize: vi.fn(), start: vi.fn(() => calls.push('new')), stop: vi.fn(), update: vi.fn() }

    const addingSystem = {
      initialize: vi.fn(),
      start: vi.fn(() => {
        calls.push('adding')
        scheduler.register(newSystem as any)
      }),
      stop: vi.fn(),
      update: vi.fn()
    }

    const lastSystem = { initialize: vi.fn(), start: vi.fn(() => calls.push('last')), stop: vi.fn(), update: vi.fn() }

    scheduler.register(addingSystem as any)
    scheduler.register(lastSystem as any)

    scheduler.startAll()

    expect(calls).toEqual(['adding', 'last'])
    expect(newSystem.start).toHaveBeenCalledTimes(0)

    scheduler.startAll()

    expect(newSystem.start).toHaveBeenCalledTimes(1)
    expect(calls).toEqual(['adding', 'last', 'adding', 'last', 'new'])
  })

  it('permitir registrar o mesmo sistema múltiplas vezes e inicializar cada ocorrência', () => {
    const system = { initialize: vi.fn(), start: vi.fn(), stop: vi.fn(), update: vi.fn() }

    scheduler.register(system as any)
    scheduler.register(system as any)

    expect(system.initialize).toHaveBeenCalledTimes(2)

    scheduler.startAll()

    expect(system.start).toHaveBeenCalledTimes(2)
  })
})
