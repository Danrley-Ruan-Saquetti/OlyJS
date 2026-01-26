import { beforeEach, describe, expect, it } from 'vitest'

import { ComponentFieldType } from '../../../../../src/ecs/archetype'
import { ComponentData } from '../../../../../src/runtime/world/archetype/components/component-data'

describe('Runtime: ComponentData', () => {
  describe('Operações Básicas', () => {
    let componentData: ComponentData

    beforeEach(() => {
      const schema = {
        position: ComponentFieldType.F32,
        velocity: ComponentFieldType.F32,
      }

      componentData = new ComponentData(schema)
    })

    it('deve criar um ComponentData com capacidade inicial', () => {
      expect(componentData.size).toBe(0)
      expect(componentData.isFull).toBe(false)
    })

    it('deve retornar a capacidade correta via getter isFull quando vazio', () => {
      expect(componentData.isFull).toBe(false)
    })

    it('deve inserir um elemento com pushDefault', () => {
      componentData.pushDefault()

      expect(componentData.size).toBe(1)
      expect(componentData.field('position')[0]).toBe(0)
      expect(componentData.field('velocity')[0]).toBe(0)
    })

    it('deve inserir múltiplos elementos', () => {
      componentData.pushDefault()
      componentData.pushDefault()
      componentData.pushDefault()

      expect(componentData.size).toBe(3)
    })

    it('deve remover o último elemento com pop', () => {
      componentData.pushDefault()
      componentData.pushDefault()

      componentData.pop()

      expect(componentData.size).toBe(1)
    })

    it('deve retornar data via getter', () => {
      const data = componentData.data

      expect(data).toBeDefined()
      expect(data).toHaveProperty('position')
      expect(data).toHaveProperty('velocity')
    })

    it('deve acessar campo específico com field', () => {
      componentData.pushDefault()

      const field = componentData.field('position')

      expect(field).toBeInstanceOf(Float32Array)
      expect(field[0]).toBe(0)
    })
  })

  describe('Inicialização com Capacidade Customizada', () => {
    it('deve criar com capacidade inicial customizada', () => {
      const schema = { x: ComponentFieldType.I32 }
      const componentData = new ComponentData(schema, 128)

      for (let i = 0; i < 128; i++) {
        componentData.pushDefault()
      }

      expect(componentData.size).toBe(128)
      expect(componentData.isFull).toBe(true)
    })

    it('deve usar capacidade padrão de 64 se não especificada', () => {
      const schema = { x: ComponentFieldType.F64 }
      const componentData = new ComponentData(schema)

      for (let i = 0; i < 64; i++) {
        componentData.pushDefault()
      }

      expect(componentData.size).toBe(64)
      expect(componentData.isFull).toBe(true)
    })
  })

  describe('Tipos de Campo', () => {
    it('deve suportar F32 (Float32Array)', () => {
      const schema = { value: ComponentFieldType.F32 }
      const componentData = new ComponentData(schema)

      componentData.pushDefault()

      const field = componentData.field('value')

      expect(field).toBeInstanceOf(Float32Array)
    })

    it('deve suportar F64 (Float64Array)', () => {
      const schema = { value: ComponentFieldType.F64 }
      const componentData = new ComponentData(schema)

      componentData.pushDefault()

      const field = componentData.field('value')

      expect(field).toBeInstanceOf(Float64Array)
    })

    it('deve suportar I32 (Int32Array)', () => {
      const schema = { value: ComponentFieldType.I32 }
      const componentData = new ComponentData(schema)

      componentData.pushDefault()

      const field = componentData.field('value')

      expect(field).toBeInstanceOf(Int32Array)
    })

    it('deve suportar U32 (Uint32Array)', () => {
      const schema = { value: ComponentFieldType.U32 }
      const componentData = new ComponentData(schema)

      componentData.pushDefault()

      const field = componentData.field('value')

      expect(field).toBeInstanceOf(Uint32Array)
    })

    it('deve suportar I16 (Int16Array)', () => {
      const schema = { value: ComponentFieldType.I16 }
      const componentData = new ComponentData(schema)

      componentData.pushDefault()

      const field = componentData.field('value')

      expect(field).toBeInstanceOf(Int16Array)
    })

    it('deve suportar U8 (Uint8Array)', () => {
      const schema = { value: ComponentFieldType.U8 }
      const componentData = new ComponentData(schema)

      componentData.pushDefault()

      const field = componentData.field('value')

      expect(field).toBeInstanceOf(Uint8Array)
    })

    it('deve suportar BOOL (Uint8Array)', () => {
      const schema = { active: ComponentFieldType.BOOL }
      const componentData = new ComponentData(schema)

      componentData.pushDefault()

      const field = componentData.field('active')

      expect(field).toBeInstanceOf(Uint8Array)
    })

    it('deve suportar múltiplos tipos de campo simultaneamente', () => {
      const schema = {
        float32Val: ComponentFieldType.F32,
        float64Val: ComponentFieldType.F64,
        int32Val: ComponentFieldType.I32,
        uint32Val: ComponentFieldType.U32,
        int16Val: ComponentFieldType.I16,
        uint8Val: ComponentFieldType.U8,
        boolVal: ComponentFieldType.BOOL,
      }

      const componentData = new ComponentData(schema)

      componentData.pushDefault()

      expect(componentData.field('float32Val')).toBeInstanceOf(Float32Array)
      expect(componentData.field('float64Val')).toBeInstanceOf(Float64Array)
      expect(componentData.field('int32Val')).toBeInstanceOf(Int32Array)
      expect(componentData.field('uint32Val')).toBeInstanceOf(Uint32Array)
      expect(componentData.field('int16Val')).toBeInstanceOf(Int16Array)
      expect(componentData.field('uint8Val')).toBeInstanceOf(Uint8Array)
      expect(componentData.field('boolVal')).toBeInstanceOf(Uint8Array)
    })
  })

  describe('Swap de Elementos', () => {
    let componentData: ComponentData

    beforeEach(() => {
      const schema = { value: ComponentFieldType.I32 }
      componentData = new ComponentData(schema, 10)
    })

    it('deve trocar dois elementos', () => {
      componentData.pushDefault()
      componentData.pushDefault()

      const field = componentData.field('value')
      field[0] = 10
      field[1] = 20

      componentData.swap(0, 1)

      expect(field[0]).toBe(20)
      expect(field[1]).toBe(10)
    })

    it('deve fazer swap de elementos com múltiplos campos', () => {
      const schema = { x: ComponentFieldType.F32, y: ComponentFieldType.F32 }
      const data = new ComponentData(schema, 10)

      data.pushDefault()
      data.pushDefault()

      const xField = data.field('x')
      const yField = data.field('y')

      xField[0] = 1
      yField[0] = 2
      xField[1] = 3
      yField[1] = 4

      data.swap(0, 1)

      expect(xField[0]).toBe(3)
      expect(yField[0]).toBe(4)
      expect(xField[1]).toBe(1)
      expect(yField[1]).toBe(2)
    })

    it('deve fazer swap de um elemento consigo mesmo', () => {
      componentData.pushDefault()

      const field = componentData.field('value')
      field[0] = 42

      componentData.swap(0, 0)

      expect(field[0]).toBe(42)
    })

    it('deve fazer swap de últimos elementos', () => {
      componentData.pushDefault()
      componentData.pushDefault()
      componentData.pushDefault()

      const field = componentData.field('value')
      field[1] = 100
      field[2] = 200

      componentData.swap(1, 2)

      expect(field[1]).toBe(200)
      expect(field[2]).toBe(100)
    })
  })

  describe('Crescimento da Capacidade (grow)', () => {
    let componentData: ComponentData

    beforeEach(() => {
      const schema = { id: ComponentFieldType.U32 }
      componentData = new ComponentData(schema, 10)
    })

    it('deve crescer a capacidade quando ficar cheio', () => {
      for (let i = 0; i < 10; i++) {
        componentData.pushDefault()
      }

      expect(componentData.isFull).toBe(true)

      componentData.pushDefault()

      expect(componentData.size).toBe(11)
      expect(componentData.isFull).toBe(false)
    })

    it('deve multiplicar a capacidade por 3 após crescimento', () => {
      const schema = { value: ComponentFieldType.I32 }
      const data = new ComponentData(schema, 10)

      for (let i = 0; i < 10; i++) {
        data.pushDefault()
        data.field('value')[i] = i
      }

      data.pushDefault()

      for (let i = 0; i < 20; i++) {
        data.pushDefault()
      }

      expect(data.size).toBe(31)
    })

    it('deve preservar dados após crescimento', () => {
      const schema = { value: ComponentFieldType.I32 }
      const data = new ComponentData(schema, 5)

      for (let i = 0; i < 5; i++) {
        data.pushDefault()
        data.field('value')[i] = i * 10
      }

      data.pushDefault()

      const field = data.field('value')

      expect(field[0]).toBe(0)
      expect(field[1]).toBe(10)
      expect(field[2]).toBe(20)
      expect(field[3]).toBe(30)
      expect(field[4]).toBe(40)
    })

    it('deve crescer múltiplas vezes sucessivamente', () => {
      const schema = { num: ComponentFieldType.U32 }
      const data = new ComponentData(schema, 2)

      data.pushDefault()
      data.pushDefault()

      for (let i = 0; i < 6; i++) {
        data.pushDefault()
      }

      for (let i = 0; i < 18; i++) {
        data.pushDefault()
      }

      expect(data.size).toBe(26)
    })
  })

  describe('copyFrom - Copiar de Outro ComponentData', () => {
    let source: ComponentData
    let target: ComponentData

    beforeEach(() => {
      const schema = { value: ComponentFieldType.F32 }

      source = new ComponentData(schema, 10)
      target = new ComponentData(schema, 10)
    })

    it('deve copiar um elemento de outro ComponentData', () => {
      source.pushDefault()

      const field = source.field('value')
      field[0] = 42.5

      target.copyFrom(source, 0)

      expect(target.size).toBe(1)
      expect(target.field('value')[0]).toBe(42.5)
    })

    it('deve copiar múltiplos elementos diferentes', () => {
      source.pushDefault()
      source.pushDefault()
      source.pushDefault()

      const sourceField = source.field('value')
      sourceField[0] = 10
      sourceField[1] = 20
      sourceField[2] = 30

      target.copyFrom(source, 0)
      target.copyFrom(source, 1)
      target.copyFrom(source, 2)

      const targetField = target.field('value')
      expect(targetField[0]).toBe(10)
      expect(targetField[1]).toBe(20)
      expect(targetField[2]).toBe(30)
    })

    it('deve copiar de índice específico', () => {
      source.pushDefault()
      source.pushDefault()
      source.pushDefault()

      const field = source.field('value')
      field[0] = 100
      field[1] = 200
      field[2] = 300

      target.copyFrom(source, 1)

      expect(target.field('value')[0]).toBe(200)
    })

    it('deve copiar com múltiplos campos', () => {
      const schema = { x: ComponentFieldType.F32, y: ComponentFieldType.F32 }
      const source = new ComponentData(schema, 10)
      const target = new ComponentData(schema, 10)

      source.pushDefault()
      source.pushDefault()

      const sourceX = source.field('x')
      const sourceY = source.field('y')
      sourceX[0] = 1.5
      sourceY[0] = 2.5
      sourceX[1] = 3.5
      sourceY[1] = 4.5

      target.copyFrom(source, 0)
      target.copyFrom(source, 1)

      const targetX = target.field('x')
      const targetY = target.field('y')

      expect(targetX[0]).toBe(1.5)
      expect(targetY[0]).toBe(2.5)
      expect(targetX[1]).toBe(3.5)
      expect(targetY[1]).toBe(4.5)
    })

    it('deve copiar e crescer se necessário', () => {
      const schema = { id: ComponentFieldType.U32 }
      const source = new ComponentData(schema, 10)
      const target = new ComponentData(schema, 2)

      for (let i = 0; i < 10; i++) {
        source.pushDefault()
      }

      expect(target.isFull).toBe(false)

      for (let i = 0; i < 5; i++) {
        target.copyFrom(source, i)
      }

      expect(target.size).toBe(5)
    })

    it('deve copiar após crescimento do alvo', () => {
      const schema = { val: ComponentFieldType.I32 }
      const source = new ComponentData(schema, 10)
      const target = new ComponentData(schema, 3)

      source.pushDefault()
      const sourceField = source.field('val')
      sourceField[0] = 99

      for (let i = 0; i < 3; i++) {
        target.pushDefault()
      }

      target.copyFrom(source, 0)

      const targetField = target.field('val')
      expect(targetField[3]).toBe(99)
    })
  })

  describe('Edge Cases - Vazio', () => {
    let componentData: ComponentData

    beforeEach(() => {
      const schema = { x: ComponentFieldType.F32 }
      componentData = new ComponentData(schema)
    })

    it('deve ter size 0 quando criado', () => {
      expect(componentData.size).toBe(0)
    })

    it('deve não estar cheio quando criado', () => {
      expect(componentData.isFull).toBe(false)
    })

    it('deve retornar campos válidos mesmo quando vazio', () => {
      const field = componentData.field('x')

      expect(field).toBeInstanceOf(Float32Array)
      expect(field.length).toBeGreaterThan(0)
    })
  })

  describe('Edge Cases - Um Único Elemento', () => {
    let componentData: ComponentData

    beforeEach(() => {
      const schema = { value: ComponentFieldType.I32 }
      componentData = new ComponentData(schema)
    })

    it('deve ter size 1 após um pushDefault', () => {
      componentData.pushDefault()

      expect(componentData.size).toBe(1)
    })

    it('deve remover o único elemento com pop', () => {
      componentData.pushDefault()
      componentData.pop()

      expect(componentData.size).toBe(0)
    })

    it('deve fazer swap consigo mesmo sem erro', () => {
      componentData.pushDefault()

      const field = componentData.field('value')
      field[0] = 42

      expect(() => {
        componentData.swap(0, 0)
      }).not.toThrow()

      expect(field[0]).toBe(42)
    })

    it('deve copiar de um ComponentData com um elemento', () => {
      componentData.pushDefault()
      const field = componentData.field('value')
      field[0] = 123

      const target = new ComponentData({ value: ComponentFieldType.I32 })
      target.copyFrom(componentData, 0)

      expect(target.size).toBe(1)
      expect(target.field('value')[0]).toBe(123)
    })
  })

  describe('Edge Cases - Pop Múltiplo', () => {
    let componentData: ComponentData

    beforeEach(() => {
      const schema = { id: ComponentFieldType.U32 }
      componentData = new ComponentData(schema, 5)
    })

    it('deve fazer pop consecutivamente', () => {
      componentData.pushDefault()
      componentData.pushDefault()
      componentData.pushDefault()

      componentData.pop()
      expect(componentData.size).toBe(2)

      componentData.pop()
      expect(componentData.size).toBe(1)

      componentData.pop()
      expect(componentData.size).toBe(0)
    })

    it('não deve ter size negativo lógico após pop em vazio', () => {
      componentData.pop()

      expect(componentData.size).toBe(0)
    })
  })

  describe('Edge Cases - Muitos Elementos', () => {
    let componentData: ComponentData

    beforeEach(() => {
      const schema = { value: ComponentFieldType.F64 }
      componentData = new ComponentData(schema, 10)
    })

    it('deve inserir 100 elementos com crescimentos sucessivos', () => {
      for (let i = 0; i < 100; i++) {
        componentData.pushDefault()
      }

      expect(componentData.size).toBe(100)
    })

    it('deve preservar dados ao inserir muitos elementos', () => {
      const schema = { id: ComponentFieldType.I32 }
      const data = new ComponentData(schema, 5)

      for (let i = 0; i < 50; i++) {
        data.pushDefault()
        data.field('id')[i] = i * 2
      }

      const field = data.field('id')
      expect(field[0]).toBe(0)
      expect(field[10]).toBe(20)
      expect(field[25]).toBe(50)
      expect(field[49]).toBe(98)
    })

    it('deve fazer swap em muitos elementos', () => {
      for (let i = 0; i < 50; i++) {
        componentData.pushDefault()
        componentData.field('value')[i] = i + 0.5
      }

      const field = componentData.field('value')
      const firstVal = field[0]
      const lastVal = field[49]

      componentData.swap(0, 49)

      expect(field[0]).toBe(lastVal)
      expect(field[49]).toBe(firstVal)
    })

    it('deve fazer operações sequenciais com 1000 elementos', () => {
      const schema = { x: ComponentFieldType.U32, y: ComponentFieldType.U32 }
      const data = new ComponentData(schema, 16)

      for (let i = 0; i < 1000; i++) {
        data.pushDefault()
      }

      expect(data.size).toBe(1000)

      for (let i = 0; i < 100; i++) {
        data.pop()
      }

      expect(data.size).toBe(900)
    })
  })

  describe('Edge Cases - Campos Vazios', () => {
    it('deve criar ComponentData com esquema vazio', () => {
      const componentData = new ComponentData({})

      expect(componentData.size).toBe(0)
      expect(componentData.isFull).toBe(false)
    })

    it('deve fazer pushDefault em esquema vazio sem erro', () => {
      const componentData = new ComponentData({})

      expect(() => {
        componentData.pushDefault()
      }).not.toThrow()

      expect(componentData.size).toBe(1)
    })

    it('deve fazer swap em esquema vazio', () => {
      const componentData = new ComponentData({})

      componentData.pushDefault()
      componentData.pushDefault()

      expect(() => {
        componentData.swap(0, 1)
      }).not.toThrow()
    })
  })

  describe('Data Property Immutability', () => {
    let componentData: ComponentData

    beforeEach(() => {
      const schema = { value: ComponentFieldType.F32 }
      componentData = new ComponentData(schema)
    })

    it('deve retornar os mesmos campos via data getter', () => {
      componentData.pushDefault()

      const data1 = componentData.data
      const data2 = componentData.data

      expect(data1).toBe(data2)
    })

    it('deve retornar campos atualizados após pushDefault', () => {
      const data1 = componentData.data
      const size1 = Object.keys(data1).length

      componentData.pushDefault()

      const data2 = componentData.data
      const size2 = Object.keys(data2).length

      expect(size1).toBe(size2)
      expect(data1).toBe(data2)
    })
  })
})
