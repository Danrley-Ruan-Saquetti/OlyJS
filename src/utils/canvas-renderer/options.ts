import { IRectangle, IVector2 } from '../../interfaces/index.js'

export type DrawOptions = IVector2 & {
  color?: string
  fixed?: boolean
}

export type DrawStrokeOptions = {
  stroke?: string
  strokeWidth?: number
} | {
  stroke: string
  strokeWidth: number
}

export type DrawImageOptions = Omit<DrawOptions, 'color'> & IRectangle & {
  image: HTMLImageElement
}

export type DrawImageFrameOptions = Omit<DrawOptions, 'color'> & Partial<IRectangle> & {
  image: HTMLImageElement
  imageX: number
  imageY: number
  imageWidth: number
  imageHeight: number
}

export type DrawTextOptions = DrawOptions & {
  text: string
  font?: string
  maxWidth?: number
}
