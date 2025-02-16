import { CameraGameObject } from '../entities/index.js'
import { Buttons, WheelType } from '../enums/index.js'
import { DeltaTime } from '../utils/index.js'
import { InputManager } from '../managers/index.js'
import { GameSystem } from './system.js'

export class MouseSystem extends GameSystem {

  private static KEYS_MAPPED = {
    [Buttons.LEFT]: 'LEFT',
    [Buttons.MIDDLE]: 'MIDDLE',
    [Buttons.RIGHT]: 'RIGHT',
  } as const

  private cameraGameObject: CameraGameObject

  constructor(
    private canvas: HTMLCanvasElement,
  ) {
    super()
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

  update(deltaTime: DeltaTime) {

  }

  updateAfter() {
    InputManager.mouse.dispose()
  }

  setCameraGameObject(cameraGameObject: CameraGameObject) {
    this.cameraGameObject = cameraGameObject
  }

  private onMouseMove = (event: MouseEvent) => {
    const rect = this.canvas.getBoundingClientRect()

    const position = {
      x: event.clientX - rect.left - (rect.width / 2),
      y: event.clientY - rect.top - (rect.height / 2),
    }

    InputManager.mouse.mouseMove(
      position,
      {
        x: position.x + this.cameraGameObject.transform.position.x,
        y: position.y + this.cameraGameObject.transform.position.y,
      }
    )
  }

  private onWheel = (event: WheelEvent) => {
    InputManager.mouse.wheel(event.deltaY < 0 ? WheelType.UP : WheelType.DOWN)
  }

  private onMouseDown = (event: MouseEvent) => {
    InputManager.mouse.buttonPressed(this.parseButton(event.button))
  }

  private onMouseUp = (event: MouseEvent) => {
    InputManager.mouse.buttonReleased(this.parseButton(event.button))
  }

  private onDoubleClick = (event: MouseEvent) => {
    InputManager.mouse.doubleClick()
  }

  private parseButton(buttonIndex: number) {
    const key: keyof typeof Buttons = MouseSystem.KEYS_MAPPED[`${buttonIndex}`]

    return Buttons[key]
  }
}
