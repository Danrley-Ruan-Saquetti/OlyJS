import { beforeEach, describe, expect, it } from 'vitest'

import { TimeTracker } from './../../../../src/game-runtime/time/time-tracker'

describe('TimeTracker', () => {
  let timeTracker: TimeTracker

  beforeEach(() => {
    timeTracker = new TimeTracker()
  })

  describe('Inicialização', () => {
    it('deve inicializar com valores zerados', () => {
      const time = timeTracker.time

      expect(time.deltaTime).toBe(0)
      expect(time.deltaTimeMilliseconds).toBe(0)
      expect(time.totalElapsedTime).toBe(0)
      expect(time.totalElapsedTimeMilliseconds).toBe(0)
    })

    it('deve retornar o mesmo objeto de state ao chamar getState', () => {
      const state1 = timeTracker.getState()
      const state2 = timeTracker.getState()

      expect(state1).toBe(state2)
    })

    it('deve retornar o mesmo objeto ao chamar time getter', () => {
      const time1 = timeTracker.time
      const time2 = timeTracker.time

      expect(time1).toBe(time2)
    })
  })

  describe('Advance - Casos Básicos', () => {
    it('deve adicionar deltaTime em milissegundos', () => {
      timeTracker.advance(1000)

      expect(timeTracker.time.deltaTimeMilliseconds).toBe(1000)
    })

    it('deve converter deltaTime para segundos (ms / 1000)', () => {
      timeTracker.advance(1000)

      expect(timeTracker.time.deltaTime).toBe(1)
    })

    it('deve acumular totalElapsedTime em milissegundos', () => {
      timeTracker.advance(500)
      timeTracker.advance(300)

      expect(timeTracker.time.totalElapsedTimeMilliseconds).toBe(800)
    })

    it('deve acumular totalElapsedTime em segundos', () => {
      timeTracker.advance(500)
      timeTracker.advance(300)

      expect(timeTracker.time.totalElapsedTime).toBe(0.8)
    })

    it('deve atualizar deltaTime a cada chamada', () => {
      timeTracker.advance(1000)

      expect(timeTracker.time.deltaTime).toBe(1)

      timeTracker.advance(500)

      expect(timeTracker.time.deltaTime).toBe(0.5)
    })
  })

  describe('Advance - Edge Cases', () => {
    it('deve lidar com zero millisegundos', () => {
      timeTracker.advance(0)

      expect(timeTracker.time.deltaTime).toBe(0)
      expect(timeTracker.time.deltaTimeMilliseconds).toBe(0)
      expect(timeTracker.time.totalElapsedTime).toBe(0)
      expect(timeTracker.time.totalElapsedTimeMilliseconds).toBe(0)
    })

    it('deve lidar com valores muito pequenos (1ms)', () => {
      timeTracker.advance(1)

      expect(timeTracker.time.deltaTimeMilliseconds).toBe(1)
      expect(timeTracker.time.deltaTime).toBe(0.001)
      expect(timeTracker.time.totalElapsedTimeMilliseconds).toBe(1)
      expect(timeTracker.time.totalElapsedTime).toBe(0.001)
    })

    it('deve lidar com valores grandes', () => {
      timeTracker.advance(60000)

      expect(timeTracker.time.deltaTimeMilliseconds).toBe(60000)
      expect(timeTracker.time.deltaTime).toBe(60)
      expect(timeTracker.time.totalElapsedTime).toBe(60)
    })

    it('deve lidar com valores muito grandes', () => {
      timeTracker.advance(86400000)

      expect(timeTracker.time.deltaTimeMilliseconds).toBe(86400000)
      expect(timeTracker.time.deltaTime).toBe(86400)
      expect(timeTracker.time.totalElapsedTime).toBe(86400)
    })

    it('deve acumular corretamente após múltiplas chamadas com valores variados', () => {
      timeTracker.advance(1000)
      timeTracker.advance(2000)
      timeTracker.advance(500)
      timeTracker.advance(1500)

      expect(timeTracker.time.totalElapsedTimeMilliseconds).toBe(5000)
      expect(timeTracker.time.totalElapsedTime).toBe(5)
      expect(timeTracker.time.deltaTimeMilliseconds).toBe(1500)
      expect(timeTracker.time.deltaTime).toBe(1.5)
    })

    it('deve manter precisão com números decimais', () => {
      timeTracker.advance(16.666)

      expect(timeTracker.time.deltaTimeMilliseconds).toBe(16.666)
      expect(timeTracker.time.deltaTime).toBeCloseTo(0.016666, 5)
    })

    it('deve acumular com precisão após múltiplos advances com decimais', () => {
      timeTracker.advance(16.666)
      timeTracker.advance(16.667)
      timeTracker.advance(16.666)

      expect(timeTracker.time.totalElapsedTimeMilliseconds).toBeCloseTo(49.999, 2)
      expect(timeTracker.time.deltaTime).toBeCloseTo(0.016666, 5)
    })
  })

  describe('Reset', () => {
    it('deve resetar deltaTime para zero', () => {
      timeTracker.advance(1000)
      expect(timeTracker.time.deltaTime).toBe(1)

      timeTracker.reset()
      expect(timeTracker.time.deltaTime).toBe(0)
    })

    it('deve resetar deltaTimeMilliseconds para zero', () => {
      timeTracker.advance(1000)
      expect(timeTracker.time.deltaTimeMilliseconds).toBe(1000)

      timeTracker.reset()
      expect(timeTracker.time.deltaTimeMilliseconds).toBe(0)
    })

    it('deve resetar totalElapsedTime para zero', () => {
      timeTracker.advance(1000)
      expect(timeTracker.time.totalElapsedTime).toBe(1)

      timeTracker.reset()
      expect(timeTracker.time.totalElapsedTime).toBe(0)
    })

    it('deve resetar totalElapsedTimeMilliseconds para zero', () => {
      timeTracker.advance(1000)
      expect(timeTracker.time.totalElapsedTimeMilliseconds).toBe(1000)

      timeTracker.reset()
      expect(timeTracker.time.totalElapsedTimeMilliseconds).toBe(0)
    })

    it('deve resetar todos os valores simultaneamente', () => {
      timeTracker.advance(5000)
      timeTracker.advance(3000)

      timeTracker.reset()

      const time = timeTracker.time
      expect(time.deltaTime).toBe(0)
      expect(time.deltaTimeMilliseconds).toBe(0)
      expect(time.totalElapsedTime).toBe(0)
      expect(time.totalElapsedTimeMilliseconds).toBe(0)
    })

    it('deve permitir continuar acumulando após reset', () => {
      timeTracker.advance(1000)
      timeTracker.reset()
      timeTracker.advance(500)

      expect(timeTracker.time.deltaTime).toBe(0.5)
      expect(timeTracker.time.totalElapsedTime).toBe(0.5)
    })

    it('deve funcionar com reset múltiplos', () => {
      timeTracker.advance(1000)
      timeTracker.reset()

      timeTracker.advance(500)
      timeTracker.reset()

      timeTracker.advance(250)

      expect(timeTracker.time.deltaTime).toBe(0.25)
      expect(timeTracker.time.totalElapsedTime).toBe(0.25)
    })

    it('deve respeitar múltiplos resets sem advance', () => {
      timeTracker.advance(1000)
      timeTracker.reset()
      timeTracker.reset()

      expect(timeTracker.time.deltaTime).toBe(0)
      expect(timeTracker.time.totalElapsedTime).toBe(0)
    })
  })

  describe('Sequências Complexas', () => {
    it('deve manter estado correto com alternância entre advance e reset', () => {
      timeTracker.advance(1000)
      expect(timeTracker.time.totalElapsedTime).toBe(1)

      timeTracker.advance(500)
      expect(timeTracker.time.totalElapsedTime).toBe(1.5)

      timeTracker.reset()
      expect(timeTracker.time.totalElapsedTime).toBe(0)

      timeTracker.advance(2000)
      expect(timeTracker.time.totalElapsedTime).toBe(2)
    })

    it('deve simular loop de game em 60fps por 5 frames', () => {
      const frameDelta = 16.667 // ~60fps

      for (let i = 0; i < 5; i++) {
        timeTracker.advance(frameDelta)
      }

      expect(timeTracker.time.totalElapsedTimeMilliseconds).toBeCloseTo(83.335, 2)
      expect(timeTracker.time.deltaTime).toBeCloseTo(0.016667, 5)
    })

    it('deve simular pausa (frame com 0ms) e retomada', () => {
      timeTracker.advance(1000)
      expect(timeTracker.time.totalElapsedTime).toBe(1)

      timeTracker.advance(0)
      expect(timeTracker.time.deltaTime).toBe(0)
      expect(timeTracker.time.totalElapsedTime).toBe(1)

      timeTracker.advance(500)
      expect(timeTracker.time.deltaTime).toBe(0.5)
      expect(timeTracker.time.totalElapsedTime).toBe(1.5)
    })

    it('deve manter valores totalizados após múltiplas variações de delta', () => {
      const deltas = [16, 17, 15, 16, 17, 15, 20, 14]
      let expectedTotal = 0

      for (const delta of deltas) {
        timeTracker.advance(delta)
        expectedTotal += delta
      }

      expect(timeTracker.time.totalElapsedTimeMilliseconds).toBe(expectedTotal)
      expect(timeTracker.time.deltaTimeMilliseconds).toBe(14)
    })
  })

  describe('Getter getState', () => {
    it('deve retornar um objeto DeltaTime válido', () => {
      timeTracker.advance(1000)
      const state = timeTracker.getState()

      expect(state).toHaveProperty('deltaTime')
      expect(state).toHaveProperty('deltaTimeMilliseconds')
      expect(state).toHaveProperty('totalElapsedTime')
      expect(state).toHaveProperty('totalElapsedTimeMilliseconds')
    })

    it('deve retornar o mesmo objeto que o getter time', () => {
      const state = timeTracker.getState()
      const time = timeTracker.time

      expect(state).toBe(time)
    })

    it('deve refletir mudanças após advance', () => {
      const state = timeTracker.getState()

      timeTracker.advance(1000)

      expect(state.deltaTime).toBe(1)
      expect(state.totalElapsedTime).toBe(1)
    })

    it('deve refletir mudanças após reset', () => {
      timeTracker.advance(1000)
      const state = timeTracker.getState()

      timeTracker.reset()

      expect(state.deltaTime).toBe(0)
      expect(state.totalElapsedTime).toBe(0)
    })
  })

  describe('Precisão Numérica', () => {
    it('deve manter precisão com operações de ponto flutuante', () => {
      timeTracker.advance(0.1)
      timeTracker.advance(0.2)
      timeTracker.advance(0.3)

      expect(timeTracker.time.totalElapsedTimeMilliseconds).toBeCloseTo(0.6, 10)
    })

    it('deve converter corretamente ms para segundos sem perda significativa', () => {
      timeTracker.advance(333)

      expect(timeTracker.time.deltaTime).toBeCloseTo(0.333, 3)
    })

    it('deve lidar com conversão de valores pequenos', () => {
      timeTracker.advance(0.001)

      expect(timeTracker.time.deltaTime).toBeCloseTo(0.000001, 6)
    })
  })

  describe('Imutabilidade da Interface', () => {
    it('tentar modificar deltaTime não deve afetar estado interno', () => {
      timeTracker.advance(1000)
      const time = timeTracker.time

      expect(time.deltaTime).toBe(1)

      timeTracker.advance(500)
      expect(time.deltaTime).toBe(0.5)
    })
  })
})
