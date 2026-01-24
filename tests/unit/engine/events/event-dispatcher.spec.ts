import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EventPriority } from '../../../src/contracts/engine/event'
import { EventDispatcher } from '../../../src/engine/events/event-dispatcher'
import { IEventBusPriority } from '../../../src/engine/events/types'

describe('Engine: EventDispatcher', () => {
  let mockBus: IEventBusPriority
  let dispatcher: EventDispatcher

  beforeEach(() => {
    mockBus = {
      on: vi.fn(),
      off: vi.fn(),
      clear: vi.fn(),
      emit: vi.fn()
    }

    dispatcher = new EventDispatcher(mockBus)
  })

  describe('on', () => {
    it('deve registrar listener com prioridade normal por padrão', () => {
      const listener = vi.fn()
      const eventName = 'test-event'

      dispatcher.on(eventName, listener)

      expect(mockBus.on).toHaveBeenCalledWith(
        eventName,
        listener,
        EventPriority.NORMAL
      )
    })

    it('deve registrar listener com prioridade custom', () => {
      const listener = vi.fn()
      const eventName = 'test-event'

      dispatcher.on(eventName, listener, EventPriority.HIGH)

      expect(mockBus.on).toHaveBeenCalledWith(
        eventName,
        listener,
        EventPriority.HIGH
      )
    })

    it('deve registrar listener com prioridade LOW', () => {
      const listener = vi.fn()
      const eventName = 'test-event'

      dispatcher.on(eventName, listener, EventPriority.LOW)

      expect(mockBus.on).toHaveBeenCalledWith(
        eventName,
        listener,
        EventPriority.LOW
      )
    })

    it('deve permitir registrar múltiplos listeners para o mesmo evento', () => {
      const listener1 = vi.fn()
      const listener2 = vi.fn()
      const eventName = 'test-event'

      dispatcher.on(eventName, listener1)
      dispatcher.on(eventName, listener2)

      expect(mockBus.on).toHaveBeenCalledTimes(2)
    })

    it('deve permitir registrar o mesmo listener para diferentes eventos', () => {
      const listener = vi.fn()

      dispatcher.on('event-1', listener)
      dispatcher.on('event-2', listener)

      expect(mockBus.on).toHaveBeenCalledTimes(2)
      expect(mockBus.on).toHaveBeenNthCalledWith(1, 'event-1', listener, EventPriority.NORMAL)
      expect(mockBus.on).toHaveBeenNthCalledWith(2, 'event-2', listener, EventPriority.NORMAL)
    })
  })

  describe('off', () => {
    it('deve remover listener do evento especificado', () => {
      const listener = vi.fn()
      const eventName = 'test-event'

      dispatcher.off(eventName, listener)

      expect(mockBus.off).toHaveBeenCalledWith(eventName, listener)
    })

    it('deve remover listener sem falhar se ele não existir', () => {
      const listener = vi.fn()

      expect(() => dispatcher.off('non-existent', listener)).not.toThrow()
      expect(mockBus.off).toHaveBeenCalledWith('non-existent', listener)
    })

    it('deve remover apenas o listener especificado', () => {
      const listener1 = vi.fn()
      const listener2 = vi.fn()
      const eventName = 'test-event'

      dispatcher.off(eventName, listener1)

      expect(mockBus.off).toHaveBeenCalledWith(eventName, listener1)
      expect(mockBus.off).not.toHaveBeenCalledWith(eventName, listener2)
    })

    it('deve permitir remover listener de diferentes eventos', () => {
      const listener = vi.fn()

      dispatcher.off('event-1', listener)
      dispatcher.off('event-2', listener)

      expect(mockBus.off).toHaveBeenCalledTimes(2)
    })
  })

  describe('clear', () => {
    it('deve limpar todos os listeners quando nenhum evento é especificado', () => {
      dispatcher.clear()

      expect(mockBus.clear).toHaveBeenCalledWith(undefined)
    })

    it('deve limpar listeners de um evento específico', () => {
      const eventName = 'test-event'

      dispatcher.clear(eventName)

      expect(mockBus.clear).toHaveBeenCalledWith(eventName)
    })

    it('deve permitir limpar múltiplos eventos sequencialmente', () => {
      dispatcher.clear('event-1')
      dispatcher.clear('event-2')

      expect(mockBus.clear).toHaveBeenCalledTimes(2)
      expect(mockBus.clear).toHaveBeenNthCalledWith(1, 'event-1')
      expect(mockBus.clear).toHaveBeenNthCalledWith(2, 'event-2')
    })

    it('deve permitir limpar tudo após limpar eventos específicos', () => {
      dispatcher.clear('event-1')
      dispatcher.clear()

      expect(mockBus.clear).toHaveBeenCalledTimes(2)
      expect(mockBus.clear).toHaveBeenLastCalledWith(undefined)
    })
  })

  describe('dispatch', () => {
    it('deve emitir evento com nome e dados', () => {
      const eventName = 'test-event'
      const eventData = { key: 'value' }
      const eventTuple: [string, unknown] = [eventName, eventData]

      dispatcher.dispatch(eventTuple)

      expect(mockBus.emit).toHaveBeenCalledWith(eventName, eventData)
    })

    it('deve emitir evento com dados null', () => {
      const eventTuple: [string, null] = ['test-event', null]

      dispatcher.dispatch(eventTuple)

      expect(mockBus.emit).toHaveBeenCalledWith('test-event', null)
    })

    it('deve emitir evento com dados undefined', () => {
      const eventTuple: [string, undefined] = ['test-event', undefined]

      dispatcher.dispatch(eventTuple)

      expect(mockBus.emit).toHaveBeenCalledWith('test-event', undefined)
    })

    it('deve emitir evento com objeto complexo como dados', () => {
      const complexData = {
        nested: {
          value: 42,
          array: [1, 2, 3]
        },
        flag: true
      }
      const eventTuple: [string, typeof complexData] = ['complex-event', complexData]

      dispatcher.dispatch(eventTuple)

      expect(mockBus.emit).toHaveBeenCalledWith('complex-event', complexData)
    })

    it('deve emitir evento com array como dados', () => {
      const arrayData = [1, 2, 3, 4, 5]
      const eventTuple: [string, number[]] = ['array-event', arrayData]

      dispatcher.dispatch(eventTuple)

      expect(mockBus.emit).toHaveBeenCalledWith('array-event', arrayData)
    })

    it('deve permitir emitir múltiplos eventos sequencialmente', () => {
      dispatcher.dispatch(['event-1', 'data-1'])
      dispatcher.dispatch(['event-2', 'data-2'])
      dispatcher.dispatch(['event-3', 'data-3'])

      expect(mockBus.emit).toHaveBeenCalledTimes(3)
      expect(mockBus.emit).toHaveBeenNthCalledWith(1, 'event-1', 'data-1')
      expect(mockBus.emit).toHaveBeenNthCalledWith(2, 'event-2', 'data-2')
      expect(mockBus.emit).toHaveBeenNthCalledWith(3, 'event-3', 'data-3')
    })

    it('deve emitir o mesmo evento múltiplas vezes', () => {
      dispatcher.dispatch(['same-event', 'data-1'])
      dispatcher.dispatch(['same-event', 'data-2'])

      expect(mockBus.emit).toHaveBeenCalledTimes(2)
      expect(mockBus.emit).toHaveBeenNthCalledWith(1, 'same-event', 'data-1')
      expect(mockBus.emit).toHaveBeenNthCalledWith(2, 'same-event', 'data-2')
    })
  })

  describe('integração completa', () => {
    it('deve funcionar corretamente com sequência de operações', () => {
      const listener = vi.fn()

      dispatcher.on('event-1', listener, EventPriority.HIGH)
      dispatcher.dispatch(['event-1', { id: 1 }])
      dispatcher.off('event-1', listener)
      dispatcher.dispatch(['event-1', { id: 2 }])

      expect(mockBus.on).toHaveBeenCalledWith('event-1', listener, EventPriority.HIGH)
      expect(mockBus.emit).toHaveBeenCalledTimes(2)
      expect(mockBus.off).toHaveBeenCalledWith('event-1', listener)
    })

    it('deve permitir registrar listener após removê-lo', () => {
      const listener = vi.fn()

      dispatcher.off('test-event', listener)
      dispatcher.on('test-event', listener)

      expect(mockBus.off).toHaveBeenCalledBefore(mockBus.on as any)
      expect(mockBus.on).toHaveBeenCalled()
    })

    it('deve manter independência entre diferentes eventos', () => {
      const listener1 = vi.fn()
      const listener2 = vi.fn()

      dispatcher.on('event-1', listener1)
      dispatcher.on('event-2', listener2)
      dispatcher.off('event-1', listener1)

      expect(mockBus.on).toHaveBeenCalledTimes(2)
      expect(mockBus.off).toHaveBeenCalledWith('event-1', listener1)
      expect(mockBus.off).not.toHaveBeenCalledWith('event-2', listener2)
    })
  })
})
