export interface IMonoBehaviour {
  wakeUp?(): void
  start?(): void
  update(): void
}