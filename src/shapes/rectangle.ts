import { Shape } from './shape.js'
import { IRectangle } from '../interfaces/index.js'

export class Rectangle extends Shape implements IRectangle {

  constructor(
    public width: number,
    public height: number
  ) {
    super()
  }

  resize(newWidth: number, newHeight = newWidth) {
    this.width = newWidth
    this.height = newHeight
  }

  scale(newWidth: number, amountHeight = newWidth) {
    this.width *= newWidth
    this.height *= amountHeight
  }

  inflate(amount: number) {
    this.width += amount * 2
    this.height += amount * 2
  }

  resized(newWidth: number, newHeight: number) {
    return new Rectangle(newWidth, newHeight)
  }

  scaled(amountWidth: number, amountHeight = amountWidth) {
    return new Rectangle(this.width * amountWidth, this.height * amountHeight)
  }

  inflated(amount: number) {
    return new Rectangle(this.width + amount * 2, this.height + amount * 2)
  }

  getArea() {
    return this.width * this.height
  }

  getPerimeter() {
    return 2 * (this.width + this.height)
  }

  getAspectRatio() {
    return this.width / this.height
  }

  isSquare() {
    return this.width == this.height
  }

  equals(other: Rectangle) {
    return this.width == other.width && this.height == other.height
  }

  fitsInside(other: Rectangle) {
    return this.width <= other.width && this.height <= other.height
  }

  hasSameAspectRatio(other: Rectangle) {
    return this.getAspectRatio() == other.getAspectRatio()
  }

  clone() {
    return new Rectangle(this.width, this.height)
  }

  toString() {
    return `Rectangle(${this.width}, ${this.height})`
  }
}
