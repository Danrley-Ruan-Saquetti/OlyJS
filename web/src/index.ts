// @ts-ignore
import Module from '../native/engine.js'

export class Engine {

  private constructor(private engine: any) { }

  static async create() {
    const engine = await Module()

    return new Engine(engine)
  }
}
