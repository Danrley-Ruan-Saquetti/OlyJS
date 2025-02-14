import { CameraGameObject } from '../entities/camera.entity.js'
import { Buttons, WheelType } from '../enums/index.js'
import { Input } from '../utils/input.js'
import { GameSystem } from './system.js'

export class MouseSystem extends GameSystem {

  private static KEYS_MAPPED = {
    [Buttons.LEFT]: 'LEFT',
    [Buttons.MIDDLE]: 'MIDDLE',
    [Buttons.RIGHT]: 'RIGHT',
  } as const

  private timerMoveStop: number
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

  updateAfter() {
    Input.mouse.dispose()
  }

  setCameraGameObject(cameraGameObject: CameraGameObject) {
    this.cameraGameObject = cameraGameObject
  }

  private onMouseMove = (event: MouseEvent) => {
    clearTimeout(this.timerMoveStop)

    const rect = this.canvas.getBoundingClientRect()

    const position = {
      x: event.clientX - rect.left - (rect.width / 2),
      y: event.clientY - rect.top - (rect.height / 2),
    }

    Input.mouse.mouseMove(
      position,
      {
        x: position.x + this.cameraGameObject.transform.position.x,
        y: position.y + this.cameraGameObject.transform.position.y,
      }
    )

    this.timerMoveStop = setTimeout(() => {
      this.onMouseStop()
    }, 110)
  }

  private onWheel = (event: WheelEvent) => {
    Input.mouse.wheel(event.deltaY < 0 ? WheelType.UP : WheelType.DOWN)
  }

  private onMouseStop = () => {
    Input.mouse.mouseStop()
  }

  private onMouseDown = (event: MouseEvent) => {
    Input.mouse.buttonPressed(this.parseButton(event.button))
  }

  private onMouseUp = (event: MouseEvent) => {
    Input.mouse.buttonReleased(this.parseButton(event.button))
  }

  private onDoubleClick = (event: MouseEvent) => {
    Input.mouse.doubleClick()
  }

  private parseButton(buttonIndex: number) {
    const key: keyof typeof Buttons = MouseSystem.KEYS_MAPPED[`${buttonIndex}`]

    return Buttons[key]
  }
}
