import { Point } from './point.js'
import { Segment } from './segment.js'

export class Rectangle {
    constructor(
        public x: number,
        public y: number,
        public width: number,
        public height: number,
    ) {
    }

    public getCorners() {
        return {
            nw: new Point(this.x, this.y),
            sw: new Point(this.x, this.y + this.height),
            ne: new Point(this.x + this.width, this.y),
            se: new Point(this.x + this.width, this.y + this.height),
        }
    }

    public getCornerSegments(): Segment[] {
        const { nw, sw, ne, se } = this.getCorners()
        return [
            new Segment(nw.x, nw.y, ne.x, ne.y),
            new Segment(nw.x, nw.y, sw.x, sw.y),
            new Segment(ne.x, ne.y, se.x, se.y),
            new Segment(sw.x, sw.y, se.x, se.y),
        ]
    }

}
