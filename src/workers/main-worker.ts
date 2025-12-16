export class MainWorker extends Worker {

  constructor() {
    super(new URL('./main-worker.runtime.js', import.meta.url), { type: 'module' })
  }
}
