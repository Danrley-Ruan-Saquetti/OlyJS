import { ComponentFieldType, Game, System, createComponent } from './engine.js'

const Position = createComponent({
  x: ComponentFieldType.F32,
  y: ComponentFieldType.F32,
})

class MySystem extends System {

  constructor() {
    super()

    this.query = null
  }

  initialize({ world }) {
    this.query = world.createQuery([Position.id])
  }

  update({ time }) {
    console.log(time.deltaTimeMilliseconds) // 16ms travado

    for (const archetype of this.query.matched) {
      const position = archetype.component(Position.id)

      const x = position.field('x')
      const y = position.field('y')

      let i = 0, length = archetype.size
      while (i < length) {
        x[i]++
        y[i]++

        i++
      }
    }
  }
}

class MyGame extends Game {

  initializeEngine() {
    super.initializeEngine()

    this.engine.registerSystem(new MySystem())
  }

  initialize() {
    let i = 0
    while (i < 1_000_000) {
      const playerId = this.world.instantiate()

      this.world.addComponent(playerId, Position.id)
      i++
    }
  }
}

const game = new MyGame()

game.start()
