export type Tag = string

export interface ITaggable {
  addTag(tag: Tag): void
  removeTag(tag: Tag): void
  hasTag(...tags: Tag[]): void
  getTags(): Tag[]
}