export interface IDestroyable {
  onDestroy?(): void
  destroy(): void
  isDestroyed(): boolean
}