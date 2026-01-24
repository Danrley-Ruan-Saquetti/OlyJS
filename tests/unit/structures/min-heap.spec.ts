import { beforeEach, describe, expect, it } from 'vitest'

import { MinHeap } from './../../../src/structures/min-heap'

describe('Structure: MinHeap', () => {
  let heap: MinHeap<number>

  beforeEach(() => {
    heap = new MinHeap()
  })

  describe('Operações Básicas', () => {
    it('deve criar um heap vazio', () => {
      expect(heap.size).toBe(0)
      expect(heap.isEmpty()).toBe(true)
    })

    it('deve inserir um elemento', () => {
      heap.insert(5)

      expect(heap.size).toBe(1)
      expect(heap.min()).toBe(5)
    })

    it('deve inserir múltiplos elementos', () => {
      heap.insert(5)
      heap.insert(3)
      heap.insert(7)

      expect(heap.size).toBe(3)
    })

    it('deve remover o elemento mínimo', () => {
      heap.insert(5)
      heap.insert(3)
      heap.insert(7)

      const min = heap.removeMin()

      expect(min).toBe(3)
      expect(heap.size).toBe(2)
    })

    it('deve retornar o mínimo sem remover', () => {
      heap.insert(5)
      heap.insert(3)

      const min = heap.min()

      expect(min).toBe(3)
      expect(heap.size).toBe(2)
    })
  })

  describe('Heap Vazio', () => {
    it('removeMin em heap vazio deve retornar undefined', () => {
      const result = heap.removeMin()

      expect(result).toBeUndefined()
    })

    it('min em heap vazio deve retornar undefined', () => {
      const result = heap.min()

      expect(result).toBeUndefined()
    })

    it('isEmpty deve retornar true para heap vazio', () => {
      expect(heap.isEmpty()).toBe(true)
    })

    it('size deve ser 0 para heap vazio', () => {
      expect(heap.size).toBe(0)
    })
  })

  describe('Um Único Elemento', () => {
    it('deve inserir e remover um único elemento', () => {
      heap.insert(42)

      expect(heap.size).toBe(1)
      expect(heap.isEmpty()).toBe(false)

      const min = heap.removeMin()

      expect(min).toBe(42)
      expect(heap.size).toBe(0)
      expect(heap.isEmpty()).toBe(true)
    })

    it('min() com um único elemento', () => {
      heap.insert(42)

      expect(heap.min()).toBe(42)
    })

    it('removeMin deve deixar o heap vazio', () => {
      heap.insert(10)
      heap.removeMin()

      expect(heap.isEmpty()).toBe(true)
      expect(heap.size).toBe(0)
    })
  })

  describe('Ordem de Inserção', () => {
    it('deve manter ordem com inserção em ordem crescente', () => {
      heap.insert(1)
      heap.insert(2)
      heap.insert(3)
      heap.insert(4)
      heap.insert(5)

      expect(heap.removeMin()).toBe(1)
      expect(heap.removeMin()).toBe(2)
      expect(heap.removeMin()).toBe(3)
      expect(heap.removeMin()).toBe(4)
      expect(heap.removeMin()).toBe(5)
    })

    it('deve manter ordem com inserção em ordem decrescente', () => {
      heap.insert(5)
      heap.insert(4)
      heap.insert(3)
      heap.insert(2)
      heap.insert(1)

      expect(heap.removeMin()).toBe(1)
      expect(heap.removeMin()).toBe(2)
      expect(heap.removeMin()).toBe(3)
      expect(heap.removeMin()).toBe(4)
      expect(heap.removeMin()).toBe(5)
    })

    it('deve manter ordem com inserção aleatória', () => {
      const values = [7, 3, 9, 1, 5, 2, 8]
      values.forEach(v => heap.insert(v))

      const sorted = [1, 2, 3, 5, 7, 8, 9]

      sorted.forEach(expected => {
        expect(heap.removeMin()).toBe(expected)
      })
    })
  })

  describe('Elementos Duplicados', () => {
    it('deve manter ordem com elementos duplicados', () => {
      heap.insert(3)
      heap.insert(1)
      heap.insert(3)
      heap.insert(1)
      heap.insert(2)

      expect(heap.removeMin()).toBe(1)
      expect(heap.removeMin()).toBe(1)
      expect(heap.removeMin()).toBe(2)
      expect(heap.removeMin()).toBe(3)
      expect(heap.removeMin()).toBe(3)
    })

    it('deve lidar com todos os elementos iguais', () => {
      heap.insert(5)
      heap.insert(5)
      heap.insert(5)
      heap.insert(5)

      expect(heap.removeMin()).toBe(5)
      expect(heap.removeMin()).toBe(5)
      expect(heap.removeMin()).toBe(5)
      expect(heap.removeMin()).toBe(5)
      expect(heap.isEmpty()).toBe(true)
    })
  })

  describe('Valores Especiais', () => {
    it('deve lidar com números negativos', () => {
      heap.insert(5)
      heap.insert(-3)
      heap.insert(0)
      heap.insert(-10)

      expect(heap.removeMin()).toBe(-10)
      expect(heap.removeMin()).toBe(-3)
      expect(heap.removeMin()).toBe(0)
      expect(heap.removeMin()).toBe(5)
    })

    it('deve lidar com zero', () => {
      heap.insert(0)

      expect(heap.min()).toBe(0)
      expect(heap.removeMin()).toBe(0)
    })

    it('deve lidar com números grandes', () => {
      const max = Number.MAX_SAFE_INTEGER
      const min = Number.MIN_SAFE_INTEGER

      heap.insert(max)
      heap.insert(min)
      heap.insert(0)

      expect(heap.removeMin()).toBe(min)
      expect(heap.removeMin()).toBe(0)
      expect(heap.removeMin()).toBe(max)
    })

    it('deve lidar com números decimais', () => {
      heap.insert(1.5)
      heap.insert(0.5)
      heap.insert(2.5)

      expect(heap.removeMin()).toBe(0.5)
      expect(heap.removeMin()).toBe(1.5)
      expect(heap.removeMin()).toBe(2.5)
    })
  })

  describe('Operação Clear', () => {
    it('deve limpar o heap completamente', () => {
      heap.insert(1)
      heap.insert(2)
      heap.insert(3)

      expect(heap.size).toBe(3)

      heap.clear()

      expect(heap.size).toBe(0)
      expect(heap.isEmpty()).toBe(true)
    })

    it('deve permitir inserção após clear', () => {
      heap.insert(1)
      heap.insert(2)
      heap.clear()
      heap.insert(5)

      expect(heap.size).toBe(1)
      expect(heap.min()).toBe(5)
    })
  })

  describe('Comparador Customizado', () => {
    it('deve usar comparador customizado para ordem reversa', () => {
      const maxHeap = new MinHeap<number>((a, b) => {
        return a > b ? -1 : a < b ? 1 : 0
      })

      maxHeap.insert(3)
      maxHeap.insert(1)
      maxHeap.insert(4)
      maxHeap.insert(1)
      maxHeap.insert(5)

      expect(maxHeap.removeMin()).toBe(5)
      expect(maxHeap.removeMin()).toBe(4)
      expect(maxHeap.removeMin()).toBe(3)
      expect(maxHeap.removeMin()).toBe(1)
      expect(maxHeap.removeMin()).toBe(1)
    })

    it('deve usar comparador customizado para objetos', () => {
      interface Item {
        id: number
        priority: number
      }

      const objHeap = new MinHeap<Item>((a, b) => {
        return a.priority < b.priority ? -1 : a.priority > b.priority ? 1 : 0
      })

      objHeap.insert({ id: 1, priority: 5 })
      objHeap.insert({ id: 2, priority: 2 })
      objHeap.insert({ id: 3, priority: 8 })

      expect(objHeap.removeMin().id).toBe(2)
      expect(objHeap.removeMin().id).toBe(1)
      expect(objHeap.removeMin().id).toBe(3)
    })
  })

  describe('Operações Sequenciais Complexas', () => {
    it('deve lidar com alternância de insert e removeMin', () => {
      heap.insert(5)
      heap.insert(3)

      expect(heap.removeMin()).toBe(3)

      heap.insert(1)

      expect(heap.removeMin()).toBe(1)

      heap.insert(10)
      heap.insert(2)

      expect(heap.removeMin()).toBe(2)
      expect(heap.removeMin()).toBe(5)
      expect(heap.removeMin()).toBe(10)
      expect(heap.isEmpty()).toBe(true)
    })

    it('deve manter invariante de heap após múltiplas operações', () => {
      const numbers = [42, 17, 93, 5, 28, 17, 73, 12]
      numbers.forEach(n => heap.insert(n))

      let previous = heap.removeMin()
      while (!heap.isEmpty()) {
        const current = heap.removeMin()

        expect(current).toBeGreaterThanOrEqual(previous)

        previous = current
      }
    })

    it('deve remover todos os elementos corretamente', () => {
      heap.insert(7)
      heap.insert(2)
      heap.insert(9)
      heap.insert(1)
      heap.insert(5)

      while (!heap.isEmpty()) {
        heap.removeMin()
      }

      expect(heap.size).toBe(0)
      expect(heap.isEmpty()).toBe(true)
    })
  })

  describe('Propriedades de Heap Min', () => {
    it('min() sempre deve retornar o menor elemento até ser vazio', () => {
      const values = [45, 23, 67, 12, 34, 89, 56]
      values.forEach(v => heap.insert(v))

      const sorted = [...values].sort((a, b) => a - b)

      for (const expected of sorted) {
        expect(heap.min()).toBe(expected)
        heap.removeMin()
      }
    })

    it('size deve ser consistente após operações', () => {
      expect(heap.size).toBe(0)

      heap.insert(1)

      expect(heap.size).toBe(1)

      heap.insert(2)
      heap.insert(3)

      expect(heap.size).toBe(3)

      heap.removeMin()

      expect(heap.size).toBe(2)

      heap.removeMin()

      expect(heap.size).toBe(1)

      heap.clear()

      expect(heap.size).toBe(0)
    })
  })
})
