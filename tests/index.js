import { Engine } from '../dist/index.js';

const engine = new Engine()

engine.on('engine:test', (data) => {
  console.log(data)
})

engine.start()
engine.send('engine:test', 'Hello World')
engine.send('engine:test', 'Hello World')
engine.tick()
engine.send('engine:test', 'Hello World')
engine.tick()
