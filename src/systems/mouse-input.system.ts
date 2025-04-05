import { GameSystem } from './game-system.js'
import { InputManager } from '../managers/index.js'
import { Buttons } from '../enums/index.js'
import { IVector2 } from '../interfaces/index.js'

export class MouseSystem extends GameSystem {

  private static KEYS_MAPPED = {
    [Buttons.LEFT]: 'LEFT',
    [Buttons.MIDDLE]: 'MIDDLE',
    [Buttons.RIGHT]: 'RIGHT',
  } as const

  constructor(private canvas: HTMLCanvasElement) {
    super()
  }

  updateAfter() {
    InputManager.mouse.dispose()
  }

  start() {
    this.canvas.addEventListener('mousemove', this.onMouseMove)
    this.canvas.addEventListener('mousedown', this.onMouseDown)
    this.canvas.addEventListener('mouseup', this.onMouseUp)
    this.canvas.addEventListener('wheel', this.onWheel)
    this.canvas.addEventListener('dblclick', this.onDoubleClick)
  }

  stop() {
    this.canvas.removeEventListener('mousemove', this.onMouseMove)
    this.canvas.removeEventListener('mousedown', this.onMouseDown)
    this.canvas.removeEventListener('mouseup', this.onMouseUp)
    this.canvas.removeEventListener('wheel', this.onWheel)
    this.canvas.removeEventListener('dblclick', this.onDoubleClick)
  }

  private onMouseMove = (event: MouseEvent) => {
    this.mouseMove({
      x: event.clientX,
      y: event.clientY,
    })
  }

  private mouseMove(position: IVector2) {
    const rect = this.canvas.getBoundingClientRect()

    InputManager.mouse.move({
      x: position.x - rect.left,
      y: position.y - rect.top,
    })
  }

  private onWheel = (event: WheelEvent) => {
    InputManager.mouse.scroll(event.deltaY)
  }

  private onMouseDown = (event: MouseEvent) => {
    const button = this.parseButton(event.button)

    InputManager.mouse.buttonDown(button)
    InputManager.mouse.buttonPressed(button)
  }

  private onMouseUp = (event: MouseEvent) => {
    InputManager.mouse.buttonUp(this.parseButton(event.button))
  }

  private onDoubleClick = (event: MouseEvent) => {
    InputManager.mouse.doubleClick()
  }

  private parseButton(buttonIndex: number) {
    const key: keyof typeof Buttons = MouseSystem.KEYS_MAPPED[`${buttonIndex}`]

    return Buttons[key]
  }
}
