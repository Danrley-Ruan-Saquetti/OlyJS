import { Engine } from '../build/web/index.js';

async function main() {
  const engine = await Engine.create();

  const counterEl = document.getElementById('counter')
  const stepBtn = document.getElementById('step')

  let value = 0

  engine.engine._init()

  stepBtn.addEventListener('click', () => {
    value = engine.engine._step(1, 0.016)
    counterEl.textContent = value.toString()
  })
}

main()
