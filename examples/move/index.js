import { ComponentFieldType, Game, System, createComponent } from './engine.js'

const Position = createComponent('Position', {
  x: ComponentFieldType.F32,
  y: ComponentFieldType.F32,
})

class MySystem extends System {

  constructor() {
    super()

    this.query = null
    this.playerPrefab = null
  }

  initialize({ world }) {
    this.query = world.createQuery([Position.id])
    this.playerPrefab = world.createPrefab()
      .with(Position, { x: 10 })
      .build()

    this.playerPrefab.spawn({
      Position: { y: 100 }
    })
  }

  update({ time }) {
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
}

const game = new MyGame()

game.start()
