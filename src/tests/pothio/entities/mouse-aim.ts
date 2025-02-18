import { CanvasRenderer, GameObject, InputState } from '../../../index.js'

export class MouseAim extends GameObject {

  render(canvasRenderer: CanvasRenderer): void {
    const mousePosition = InputState.positionWindow

    canvasRenderer.drawRectangle({
      x: mousePosition.x - 2,
      y: mousePosition.y + 4,
      width: 4,
      height: 10,
      stroke: 'black',
      strokeWidth: 2,
      color: '#FFF',
      fixed: true,
    })

    canvasRenderer.drawRectangle({
      x: mousePosition.x - 2,
      y: mousePosition.y - 14,
      width: 4,
      height: 10,
      stroke: 'black',
      strokeWidth: 2,
      color: '#FFF',
      fixed: true,
    })

    canvasRenderer.drawRectangle({
      x: mousePosition.x - 2,
      y: mousePosition.y + 4,
      width: 4,
      height: 10,
      stroke: 'black',
      strokeWidth: 2,
      color: '#FFF',
      fixed: true,
    })

    canvasRenderer.drawRectangle({
      x: mousePosition.x - 14,
      y: mousePosition.y - 2,
      width: 10,
      height: 4,
      stroke: 'black',
      strokeWidth: 2,
      color: '#FFF',
      fixed: true,
    })

    canvasRenderer.drawRectangle({
      x: mousePosition.x + 4,
      y: mousePosition.y - 2,
      width: 10,
      height: 4,
      stroke: 'black',
      strokeWidth: 2,
      color: '#FFF',
      fixed: true,
    })
  }
}
