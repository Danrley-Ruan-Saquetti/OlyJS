import Module from '../build/native/engine.js';

async function main() {
  const engine = await Module();

  const counterEl = document.getElementById('counter')
  const stepBtn = document.getElementById('step')

  let value = 0

  engine._init()

  stepBtn.addEventListener('click', () => {
    value = engine._step(1, 0.016)
    counterEl.textContent = value.toString()
  })
}

main()
