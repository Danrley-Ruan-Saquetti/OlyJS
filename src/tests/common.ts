export function getCanvas(selector: string) {
  const canvas = document.querySelector<HTMLCanvasElement>(selector)!

  const displayWidth = 800
  const displayHeight = 400
  const scale = 1

  canvas.style.width = displayWidth + 'px'
  canvas.style.height = displayHeight + 'px'
  canvas.width = displayWidth * scale
  canvas.height = displayHeight * scale

  return canvas
}
