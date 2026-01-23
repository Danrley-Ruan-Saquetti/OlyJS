import { beforeEach, describe, expect, it } from 'vitest'

import { Keys } from '../../../src/contracts/engine/input'
import { InputState, InputStateConfig } from '../../../src/engine/input/input-state'

describe('Engine: InputState', () => {
  let inputState: InputState

  beforeEach(() => {
    inputState = new InputState()
  })

  describe('Inicialização', () => {
    it('deve criar uma instância com configuração padrão', () => {
      const state = new InputState()

      expect(state.isKeyHeld(Keys.KeyA)).toBe(false)
      expect(state.isMouseButtonHeld(0)).toBe(false)
      expect(state.getMouseDeltaX()).toBe(0)
      expect(state.getMouseDeltaY()).toBe(0)
      expect(state.getMousePositionX()).toBe(0)
      expect(state.getMousePositionY()).toBe(0)
    })

    it('deve criar uma instância com sensibilidade do mouse customizada', () => {
      const config: Partial<InputStateConfig> = { mouseSensitivity: 2 }
      const state = new InputState(config)

      state.mouseMove(10, 20)
      state.update()

      expect(state.getMouseDeltaX()).toBe(20)
      expect(state.getMouseDeltaY()).toBe(40)
    })

    it('deve ignorar configuração undefined para mouseSensitivity', () => {
      const config: Partial<InputStateConfig> = { mouseSensitivity: undefined }
      const state = new InputState(config)

      state.mouseMove(10, 20)
      state.update()

      expect(state.getMouseDeltaX()).toBe(10)
      expect(state.getMouseDeltaY()).toBe(20)
    })

    it('deve suportar configuração com objeto vazio', () => {
      const state = new InputState({})

      expect(state.getMouseDeltaX()).toBe(0)
      expect(state.getMouseDeltaY()).toBe(0)
    })
  })

  describe('Teclado - Key Down', () => {
    it('deve registrar uma tecla como pressionada', () => {
      inputState.keyDown(Keys.KeyA)
      inputState.update()

      expect(inputState.isKeyHeld(Keys.KeyA)).toBe(true)
      expect(inputState.isKeyDown(Keys.KeyA)).toBe(true)
      expect(inputState.isKeyUp(Keys.KeyA)).toBe(false)
    })

    it('não deve registrar key down duas vezes para a mesma tecla', () => {
      inputState.keyDown(Keys.KeyA)
      inputState.keyDown(Keys.KeyA)
      inputState.update()

      expect(inputState.isKeyHeld(Keys.KeyA)).toBe(true)
      expect(inputState.isKeyDown(Keys.KeyA)).toBe(true)
    })

    it('deve registrar múltiplas teclas pressionadas simultaneamente', () => {
      inputState.keyDown(Keys.KeyA)
      inputState.keyDown(Keys.KeyB)
      inputState.keyDown(Keys.KeyC)
      inputState.update()

      expect(inputState.isKeyHeld(Keys.KeyA)).toBe(true)
      expect(inputState.isKeyHeld(Keys.KeyB)).toBe(true)
      expect(inputState.isKeyHeld(Keys.KeyC)).toBe(true)
      expect(inputState.isKeyDown(Keys.KeyA)).toBe(true)
      expect(inputState.isKeyDown(Keys.KeyB)).toBe(true)
      expect(inputState.isKeyDown(Keys.KeyC)).toBe(true)
    })

    it('isKeyDown deve ser true apenas no frame em que a tecla foi pressionada', () => {
      inputState.keyDown(Keys.KeyA)
      inputState.update()

      expect(inputState.isKeyDown(Keys.KeyA)).toBe(true)

      inputState.update()

      expect(inputState.isKeyHeld(Keys.KeyA)).toBe(true)
      expect(inputState.isKeyDown(Keys.KeyA)).toBe(false)
    })
  })

  describe('Teclado - Key Up', () => {
    it('deve registrar uma tecla como solta', () => {
      inputState.keyDown(Keys.KeyA)
      inputState.update()

      inputState.keyUp(Keys.KeyA)
      inputState.update()

      expect(inputState.isKeyHeld(Keys.KeyA)).toBe(false)
      expect(inputState.isKeyUp(Keys.KeyA)).toBe(true)
      expect(inputState.isKeyDown(Keys.KeyA)).toBe(false)
    })

    it('isKeyUp deve ser true apenas no frame em que a tecla foi solta', () => {
      inputState.keyDown(Keys.KeyA)
      inputState.update()

      inputState.keyUp(Keys.KeyA)
      inputState.update()

      expect(inputState.isKeyUp(Keys.KeyA)).toBe(true)

      inputState.update()

      expect(inputState.isKeyHeld(Keys.KeyA)).toBe(false)
      expect(inputState.isKeyUp(Keys.KeyA)).toBe(false)
    })

    it('não deve registrar keyUp para tecla que não foi pressionada', () => {
      inputState.keyUp(Keys.KeyA)
      inputState.update()

      expect(inputState.isKeyUp(Keys.KeyA)).toBe(true)
      expect(inputState.isKeyHeld(Keys.KeyA)).toBe(false)
    })

    it('deve cancelar keyDown pendente se keyUp for chamado antes de update', () => {
      inputState.keyDown(Keys.KeyA)
      inputState.keyUp(Keys.KeyA)
      inputState.update()

      expect(inputState.isKeyHeld(Keys.KeyA)).toBe(false)
      expect(inputState.isKeyDown(Keys.KeyA)).toBe(false)
      expect(inputState.isKeyUp(Keys.KeyA)).toBe(true)
    })

    it('deve soltar múltiplas teclas', () => {
      inputState.keyDown(Keys.KeyA)
      inputState.keyDown(Keys.KeyB)
      inputState.keyDown(Keys.KeyC)
      inputState.update()

      inputState.keyUp(Keys.KeyA)
      inputState.keyUp(Keys.KeyB)
      inputState.update()

      expect(inputState.isKeyHeld(Keys.KeyA)).toBe(false)
      expect(inputState.isKeyHeld(Keys.KeyB)).toBe(false)
      expect(inputState.isKeyHeld(Keys.KeyC)).toBe(true)
    })
  })

  describe('Teclado - Queries', () => {
    it('isKeyHeld deve retornar false para tecla não pressionada', () => {
      expect(inputState.isKeyHeld(Keys.KeyZ)).toBe(false)
    })

    it('isKeyDown deve retornar false para tecla não pressionada', () => {
      expect(inputState.isKeyDown(Keys.KeyZ)).toBe(false)
    })

    it('isKeyUp deve retornar false para tecla não solta', () => {
      expect(inputState.isKeyUp(Keys.KeyZ)).toBe(false)
    })

    it('deve diferenciar entre held, down e up', () => {
      inputState.keyDown(Keys.KeyA)
      inputState.keyDown(Keys.KeyB)
      inputState.update()

      inputState.keyUp(Keys.KeyA)
      inputState.update()

      expect(inputState.isKeyDown(Keys.KeyA)).toBe(false)
      expect(inputState.isKeyHeld(Keys.KeyA)).toBe(false)
      expect(inputState.isKeyUp(Keys.KeyA)).toBe(true)
      expect(inputState.isKeyHeld(Keys.KeyB)).toBe(true)
      expect(inputState.isKeyDown(Keys.KeyB)).toBe(false)
    })
  })

  describe('Mouse - Button Down', () => {
    it('deve registrar um botão do mouse como pressionado', () => {
      inputState.mouseDown(0)
      inputState.update()

      expect(inputState.isMouseButtonHeld(0)).toBe(true)
      expect(inputState.isMouseButtonDown(0)).toBe(true)
      expect(inputState.isMouseButtonUp(0)).toBe(false)
    })

    it('não deve registrar mouseDown duas vezes para o mesmo botão', () => {
      inputState.mouseDown(0)
      inputState.mouseDown(0)
      inputState.update()

      expect(inputState.isMouseButtonHeld(0)).toBe(true)
      expect(inputState.isMouseButtonDown(0)).toBe(true)
    })

    it('deve registrar múltiplos botões do mouse simultaneamente', () => {
      inputState.mouseDown(0)
      inputState.mouseDown(1)
      inputState.mouseDown(2)
      inputState.update()

      expect(inputState.isMouseButtonHeld(0)).toBe(true)
      expect(inputState.isMouseButtonHeld(1)).toBe(true)
      expect(inputState.isMouseButtonHeld(2)).toBe(true)
    })

    it('isMouseButtonDown deve ser true apenas no frame do clique', () => {
      inputState.mouseDown(0)
      inputState.update()

      expect(inputState.isMouseButtonDown(0)).toBe(true)

      inputState.update()

      expect(inputState.isMouseButtonHeld(0)).toBe(true)
      expect(inputState.isMouseButtonDown(0)).toBe(false)
    })
  })

  describe('Mouse - Button Up', () => {
    it('deve registrar um botão do mouse como solto', () => {
      inputState.mouseDown(0)
      inputState.update()

      inputState.mouseUp(0)
      inputState.update()

      expect(inputState.isMouseButtonHeld(0)).toBe(false)
      expect(inputState.isMouseButtonUp(0)).toBe(true)
      expect(inputState.isMouseButtonDown(0)).toBe(false)
    })

    it('isMouseButtonUp deve ser true apenas no frame em que foi solto', () => {
      inputState.mouseDown(0)
      inputState.update()

      inputState.mouseUp(0)
      inputState.update()

      expect(inputState.isMouseButtonUp(0)).toBe(true)

      inputState.update()

      expect(inputState.isMouseButtonHeld(0)).toBe(false)
      expect(inputState.isMouseButtonUp(0)).toBe(false)
    })

    it('não deve registrar mouseUp para botão que não foi pressionado', () => {
      inputState.mouseUp(0)
      inputState.update()

      expect(inputState.isMouseButtonUp(0)).toBe(true)
      expect(inputState.isMouseButtonHeld(0)).toBe(false)
    })

    it('deve cancelar mouseDown pendente se mouseUp for chamado antes de update', () => {
      inputState.mouseDown(0)
      inputState.mouseUp(0)
      inputState.update()

      expect(inputState.isMouseButtonHeld(0)).toBe(false)
      expect(inputState.isMouseButtonDown(0)).toBe(false)
      expect(inputState.isMouseButtonUp(0)).toBe(true)
    })

    it('deve soltar múltiplos botões', () => {
      inputState.mouseDown(0)
      inputState.mouseDown(1)
      inputState.mouseDown(2)
      inputState.update()

      inputState.mouseUp(0)
      inputState.mouseUp(1)
      inputState.update()

      expect(inputState.isMouseButtonHeld(0)).toBe(false)
      expect(inputState.isMouseButtonHeld(1)).toBe(false)
      expect(inputState.isMouseButtonHeld(2)).toBe(true)
    })
  })

  describe('Mouse - Button Queries', () => {
    it('isMouseButtonHeld deve retornar false para botão não pressionado', () => {
      expect(inputState.isMouseButtonHeld(99)).toBe(false)
    })

    it('isMouseButtonDown deve retornar false para botão não pressionado', () => {
      expect(inputState.isMouseButtonDown(99)).toBe(false)
    })

    it('isMouseButtonUp deve retornar false para botão não solto', () => {
      expect(inputState.isMouseButtonUp(99)).toBe(false)
    })

    it('deve diferenciar entre held, down e up para botões', () => {
      inputState.mouseDown(0)
      inputState.mouseDown(1)
      inputState.update()

      inputState.mouseUp(0)
      inputState.update()

      expect(inputState.isMouseButtonDown(0)).toBe(false)
      expect(inputState.isMouseButtonHeld(0)).toBe(false)
      expect(inputState.isMouseButtonUp(0)).toBe(true)
      expect(inputState.isMouseButtonHeld(1)).toBe(true)
      expect(inputState.isMouseButtonDown(1)).toBe(false)
    })

    it('deve suportar números negativos e grandes para botões', () => {
      inputState.mouseDown(-1)
      inputState.mouseDown(9999)
      inputState.update()

      expect(inputState.isMouseButtonHeld(-1)).toBe(true)
      expect(inputState.isMouseButtonHeld(9999)).toBe(true)
    })
  })

  describe('Mouse - Movement', () => {
    it('deve registrar movimento do mouse sem sensibilidade (padrão 1)', () => {
      inputState.mouseMove(10, 20)
      inputState.update()

      expect(inputState.getMouseDeltaX()).toBe(10)
      expect(inputState.getMouseDeltaY()).toBe(20)
    })

    it('deve aplicar sensibilidade ao movimento do mouse', () => {
      const state = new InputState({ mouseSensitivity: 2 })

      state.mouseMove(10, 20)
      state.update()

      expect(state.getMouseDeltaX()).toBe(20)
      expect(state.getMouseDeltaY()).toBe(40)
    })

    it('deve acumular movimento do mouse entre updates', () => {
      inputState.mouseMove(5, 10)
      inputState.mouseMove(3, 7)
      inputState.update()

      expect(inputState.getMouseDeltaX()).toBe(8)
      expect(inputState.getMouseDeltaY()).toBe(17)
    })

    it('deve resetar delta do mouse após update', () => {
      inputState.mouseMove(10, 20)
      inputState.update()

      expect(inputState.getMouseDeltaX()).toBe(10)
      expect(inputState.getMouseDeltaY()).toBe(20)

      inputState.update()

      expect(inputState.getMouseDeltaX()).toBe(0)
      expect(inputState.getMouseDeltaY()).toBe(0)
    })

    it('deve suportar movimento negativo', () => {
      inputState.mouseMove(-15, -25)
      inputState.update()

      expect(inputState.getMouseDeltaX()).toBe(-15)
      expect(inputState.getMouseDeltaY()).toBe(-25)
    })

    it('deve suportar movimento zero', () => {
      inputState.mouseMove(0, 0)
      inputState.update()

      expect(inputState.getMouseDeltaX()).toBe(0)
      expect(inputState.getMouseDeltaY()).toBe(0)
    })

    it('deve suportar sensibilidade fracionária', () => {
      const state = new InputState({ mouseSensitivity: 0.5 })

      state.mouseMove(10, 20)
      state.update()

      expect(state.getMouseDeltaX()).toBe(5)
      expect(state.getMouseDeltaY()).toBe(10)
    })

    it('deve suportar sensibilidade zero', () => {
      const state = new InputState({ mouseSensitivity: 0 })

      state.mouseMove(10, 20)
      state.update()

      expect(state.getMouseDeltaX()).toBe(0)
      expect(state.getMouseDeltaY()).toBe(0)
    })

    it('getMouseDelta deve retornar objeto com x e y', () => {
      inputState.mouseMove(10, 20)
      inputState.update()

      const delta = inputState.getMouseDelta()

      expect(delta.x).toBe(10)
      expect(delta.y).toBe(20)
    })
  })

  describe('Mouse - Position', () => {
    it('deve definir a posição do mouse', () => {
      inputState.setMousePosition(100, 200)
      inputState.update()

      expect(inputState.getMousePositionX()).toBe(100)
      expect(inputState.getMousePositionY()).toBe(200)
    })

    it('deve atualizar posição após update', () => {
      inputState.setMousePosition(50, 75)
      inputState.update()

      expect(inputState.getMousePositionX()).toBe(50)
      expect(inputState.getMousePositionY()).toBe(75)

      inputState.setMousePosition(100, 150)
      inputState.update()

      expect(inputState.getMousePositionX()).toBe(100)
      expect(inputState.getMousePositionY()).toBe(150)
    })

    it('deve suportar posições negativas', () => {
      inputState.setMousePosition(-100, -200)
      inputState.update()

      expect(inputState.getMousePositionX()).toBe(-100)
      expect(inputState.getMousePositionY()).toBe(-200)
    })

    it('deve suportar posições zero', () => {
      inputState.setMousePosition(0, 0)
      inputState.update()

      expect(inputState.getMousePositionX()).toBe(0)
      expect(inputState.getMousePositionY()).toBe(0)
    })

    it('deve suportar posições grandes', () => {
      inputState.setMousePosition(9999, 9999)
      inputState.update()

      expect(inputState.getMousePositionX()).toBe(9999)
      expect(inputState.getMousePositionY()).toBe(9999)
    })

    it('getMousePosition deve retornar objeto com x e y', () => {
      inputState.setMousePosition(100, 200)
      inputState.update()

      const position = inputState.getMousePosition()

      expect(position.x).toBe(100)
      expect(position.y).toBe(200)
    })

    it('posição não afeta delta', () => {
      inputState.mouseMove(10, 20)
      inputState.setMousePosition(500, 600)
      inputState.update()

      expect(inputState.getMouseDeltaX()).toBe(10)
      expect(inputState.getMouseDeltaY()).toBe(20)
      expect(inputState.getMousePositionX()).toBe(500)
      expect(inputState.getMousePositionY()).toBe(600)
    })
  })

  describe('Update', () => {
    it('deve fazer update sem nada registrado', () => {
      expect(() => inputState.update()).not.toThrow()
    })

    it('deve permitir múltiplos updates consecutivos', () => {
      inputState.keyDown(Keys.KeyA)
      inputState.update()
      inputState.update()
      inputState.update()

      expect(inputState.isKeyHeld(Keys.KeyA)).toBe(true)
      expect(inputState.isKeyDown(Keys.KeyA)).toBe(false)
    })

    it('deve separar estado de frames diferentes', () => {
      inputState.keyDown(Keys.KeyA)
      inputState.update()

      expect(inputState.isKeyDown(Keys.KeyA)).toBe(true)
      expect(inputState.isKeyHeld(Keys.KeyA)).toBe(true)

      inputState.update()

      expect(inputState.isKeyDown(Keys.KeyA)).toBe(false)
      expect(inputState.isKeyHeld(Keys.KeyA)).toBe(true)

      inputState.keyUp(Keys.KeyA)
      inputState.update()

      expect(inputState.isKeyUp(Keys.KeyA)).toBe(true)
      expect(inputState.isKeyHeld(Keys.KeyA)).toBe(false)

      inputState.update()

      expect(inputState.isKeyUp(Keys.KeyA)).toBe(false)
      expect(inputState.isKeyHeld(Keys.KeyA)).toBe(false)
    })
  })

  describe('Reset', () => {
    it('deve resetar todo o estado do input', () => {
      inputState.keyDown(Keys.KeyA)
      inputState.mouseDown(0)
      inputState.mouseMove(10, 20)
      inputState.setMousePosition(100, 200)
      inputState.update()

      inputState.reset()

      expect(inputState.isKeyHeld(Keys.KeyA)).toBe(false)
      expect(inputState.isKeyDown(Keys.KeyA)).toBe(false)
      expect(inputState.isKeyUp(Keys.KeyA)).toBe(false)
      expect(inputState.isMouseButtonHeld(0)).toBe(false)
      expect(inputState.isMouseButtonDown(0)).toBe(false)
      expect(inputState.isMouseButtonUp(0)).toBe(false)
      expect(inputState.getMouseDeltaX()).toBe(0)
      expect(inputState.getMouseDeltaY()).toBe(0)
    })

    it('deve permitir reuso após reset', () => {
      inputState.keyDown(Keys.KeyA)
      inputState.update()
      inputState.reset()

      inputState.keyDown(Keys.KeyB)
      inputState.update()

      expect(inputState.isKeyHeld(Keys.KeyA)).toBe(false)
      expect(inputState.isKeyHeld(Keys.KeyB)).toBe(true)
    })

    it('deve limpar buffers pendentes', () => {
      inputState.keyDown(Keys.KeyA)
      inputState.mouseDown(0)
      inputState.mouseMove(10, 20)

      inputState.reset()
      inputState.update()

      expect(inputState.isKeyHeld(Keys.KeyA)).toBe(false)
      expect(inputState.isMouseButtonHeld(0)).toBe(false)
      expect(inputState.getMouseDeltaX()).toBe(0)
    })

    it('deve resetar posição do mouse', () => {
      inputState.setMousePosition(100, 200)
      inputState.update()

      inputState.reset()

      expect(inputState.getMousePositionX()).toBe(0)
      expect(inputState.getMousePositionY()).toBe(0)
    })
  })

  describe('Cenários Complexos', () => {
    it('deve lidar com entrada simultânea de teclado e mouse', () => {
      inputState.keyDown(Keys.KeyW)
      inputState.keyDown(Keys.KeyA)
      inputState.mouseDown(0)
      inputState.mouseMove(15, 25)
      inputState.setMousePosition(200, 300)
      inputState.update()

      expect(inputState.isKeyHeld(Keys.KeyW)).toBe(true)
      expect(inputState.isKeyHeld(Keys.KeyA)).toBe(true)
      expect(inputState.isMouseButtonHeld(0)).toBe(true)
      expect(inputState.getMouseDeltaX()).toBe(15)
      expect(inputState.getMouseDeltaY()).toBe(25)
      expect(inputState.getMousePositionX()).toBe(200)
      expect(inputState.getMousePositionY()).toBe(300)
    })

    it('deve simular um gameplay loop completo', () => {
      inputState.keyDown(Keys.KeyW)
      inputState.mouseDown(0)
      inputState.mouseMove(5, -5)
      inputState.setMousePosition(400, 300)
      inputState.update()

      expect(inputState.isKeyDown(Keys.KeyW)).toBe(true)
      expect(inputState.isMouseButtonDown(0)).toBe(true)

      inputState.mouseMove(5, -5)
      inputState.setMousePosition(405, 295)
      inputState.update()

      expect(inputState.isKeyDown(Keys.KeyW)).toBe(false)
      expect(inputState.isKeyHeld(Keys.KeyW)).toBe(true)
      expect(inputState.isMouseButtonDown(0)).toBe(false)
      expect(inputState.isMouseButtonHeld(0)).toBe(true)

      inputState.keyUp(Keys.KeyW)
      inputState.mouseUp(0)
      inputState.mouseMove(-10, 10)
      inputState.setMousePosition(395, 305)
      inputState.update()

      expect(inputState.isKeyUp(Keys.KeyW)).toBe(true)
      expect(inputState.isKeyHeld(Keys.KeyW)).toBe(false)
      expect(inputState.isMouseButtonUp(0)).toBe(true)
      expect(inputState.isMouseButtonHeld(0)).toBe(false)
    })

    it('deve suportar múltiplas teclas de movimento', () => {
      inputState.keyDown(Keys.KeyW)
      inputState.keyDown(Keys.KeyA)
      inputState.keyDown(Keys.KeyS)
      inputState.keyDown(Keys.KeyD)
      inputState.update()

      expect(inputState.isKeyHeld(Keys.KeyW)).toBe(true)
      expect(inputState.isKeyHeld(Keys.KeyA)).toBe(true)
      expect(inputState.isKeyHeld(Keys.KeyS)).toBe(true)
      expect(inputState.isKeyHeld(Keys.KeyD)).toBe(true)

      inputState.keyUp(Keys.KeyW)
      inputState.keyUp(Keys.KeyS)
      inputState.update()

      expect(inputState.isKeyHeld(Keys.KeyW)).toBe(false)
      expect(inputState.isKeyHeld(Keys.KeyS)).toBe(false)
      expect(inputState.isKeyHeld(Keys.KeyA)).toBe(true)
      expect(inputState.isKeyHeld(Keys.KeyD)).toBe(true)
    })

    it('deve suportar rapid fire (press/release na mesma frame)', () => {
      inputState.keyDown(Keys.Space)
      inputState.keyUp(Keys.Space)
      inputState.update()

      expect(inputState.isKeyUp(Keys.Space)).toBe(true)
      expect(inputState.isKeyHeld(Keys.Space)).toBe(false)
    })

    it('deve suportar sensibilidade do mouse com múltiplos movimentos', () => {
      const state = new InputState({ mouseSensitivity: 1.5 })

      state.mouseMove(10, 10)
      state.mouseMove(10, 10)
      state.mouseMove(10, 10)
      state.update()

      expect(state.getMouseDeltaX()).toBe(45)
      expect(state.getMouseDeltaY()).toBe(45)
    })
  })
})
