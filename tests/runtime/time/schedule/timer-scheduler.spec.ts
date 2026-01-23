import { beforeEach, describe, expect, it, vi } from 'vitest'

import { TimerScheduler } from '../../../../src/runtime/time/schedule/timer-scheduler'

describe('Runtime: TimerScheduler', () => {
  let now: number

  beforeEach(() => {
    now = 100
  })

  it('não deve falhar quando não há tarefas e update é chamado', () => {
    const scheduler = new TimerScheduler()

    expect(() => scheduler.update(now)).not.toThrow()
  })

  it('deve agendar e executar tarefas conforme o tempo avança', () => {
    const calls: number[] = []

    const callable1 = vi.fn(() => calls.push(1))
    const callable2 = vi.fn(() => calls.push(2))
    const callable3 = vi.fn(() => calls.push(3))

    const scheduler = new TimerScheduler(1)

    scheduler.schedule(callable1, 0, now)
    scheduler.schedule(callable2, 1, now)
    scheduler.schedule(callable3, 2, now)

    scheduler.update(now)

    expect(callable1).toHaveBeenCalledTimes(1)
    expect(callable2).toHaveBeenCalledTimes(0)
    expect(callable3).toHaveBeenCalledTimes(0)

    scheduler.update(now + 1)

    expect(callable2).toHaveBeenCalledTimes(1)

    scheduler.update(now + 2)

    expect(callable3).toHaveBeenCalledTimes(1)

    expect(calls).toEqual([1, 2, 3])
  })

  it('respeita windowSize: não traz tarefas além da janela para active', () => {
    const callable = vi.fn()

    const scheduler = new TimerScheduler(0)

    scheduler.schedule(callable, 1, now)

    scheduler.update(now)

    expect(callable).toHaveBeenCalledTimes(0)

    scheduler.update(now + 1)

    expect(callable).toHaveBeenCalledTimes(1)
  })

  it('se uma tarefa for movida para active mas executeAt > now, ela permanece até o momento certo', () => {
    const calls: number[] = []

    const callable = vi.fn(() => calls.push(1))

    const scheduler = new TimerScheduler(5)

    scheduler.schedule(callable, 1, now)

    scheduler.update(now)

    expect(callable).toHaveBeenCalledTimes(0)

    scheduler.update(now + 1)

    expect(callable).toHaveBeenCalledTimes(1)
    expect(calls).toEqual([1])
  })

  it('mantém ordem FIFO para tarefas com mesmo executeAt usando seq', () => {
    const order: number[] = []

    const scheduler = new TimerScheduler(10)

    const callableA = vi.fn(() => order.push(1))
    const callableB = vi.fn(() => order.push(2))
    const callableC = vi.fn(() => order.push(3))

    scheduler.schedule(callableA, 5, now)
    scheduler.schedule(callableB, 5, now)
    scheduler.schedule(callableC, 5, now)

    scheduler.update(now)

    expect(callableA).toHaveBeenCalledTimes(0)

    scheduler.update(now + 5)

    expect(order).toEqual([1, 2, 3])
    expect(callableA).toHaveBeenCalledTimes(1)
    expect(callableB).toHaveBeenCalledTimes(1)
    expect(callableC).toHaveBeenCalledTimes(1)
  })

  it('lida com delays negativos e zero corretamente', () => {
    const calls: number[] = []

    const scheduler = new TimerScheduler(1)

    const callableNeg = vi.fn(() => calls.push(-1))
    const callableZero = vi.fn(() => calls.push(0))

    scheduler.schedule(callableNeg, -10, now)
    scheduler.schedule(callableZero, 0, now)

    scheduler.update(now)

    expect(callableNeg).toHaveBeenCalledTimes(1)
    expect(callableZero).toHaveBeenCalledTimes(1)
    expect(calls).toEqual([-1, 0])
  })

  it('mantém tarefas futuras em active se executadas fora de ordem e não as remove prematuramente', () => {
    const calls: number[] = []

    const scheduler = new TimerScheduler(10)

    const callable1 = vi.fn(() => calls.push(1))
    const callable2 = vi.fn(() => calls.push(2))

    scheduler.schedule(callable1, 10, now)
    scheduler.schedule(callable2, 1, now)

    scheduler.update(now)

    scheduler.update(now + 1)

    expect(calls).toEqual([2])

    scheduler.update(now + 10)

    expect(calls).toEqual([2, 1])
  })
})
