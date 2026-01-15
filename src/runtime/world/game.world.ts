import { EntityId } from '../../ecs/entity'
import { IWorld } from '../../ecs/world'
import { CommandDomain } from '../../runtime/commands/command-domain'

export enum GameWorldCommand {
  ENTITY_ADD = 'entity:add',
  ENTITY_DESTROY = 'entity:destroy',
  COMPONENT_ADD = 'component:add'
}

export enum GameWorldCommandPhase {
  ENTITY_ADD,
  ENTITY_DESTROY,
  COMPONENT_ADD
}

export class GameWorld implements IWorld {

  protected readonly commandDomain = new CommandDomain(Object.keys(GameWorldCommandPhase).length)

  private nextEntityId = 1

  constructor() {
    this.commandDomain.register(GameWorldCommand.ENTITY_ADD, this.performActorAdd.bind(this), GameWorldCommandPhase.ENTITY_ADD)
    this.commandDomain.register(GameWorldCommand.ENTITY_DESTROY, this.performActorDestroy.bind(this), GameWorldCommandPhase.ENTITY_DESTROY)
    this.commandDomain.register(GameWorldCommand.COMPONENT_ADD, this.performComponentAdd.bind(this), GameWorldCommandPhase.COMPONENT_ADD)
  }

  flush() {
    this.commandDomain.flush()
  }

  instantiate() {

  }

  destroy(entityId: EntityId) {
    this.commandDomain.send(GameWorldCommand.ENTITY_DESTROY, entityId)
  }

  addComponent(entityId: EntityId, ComponentClass: any) {

  }

  protected performActorAdd() {

  }

  protected performActorDestroy(entityId: EntityId) {

  }

  protected performComponentAdd() {

  }
}
