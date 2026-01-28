type ComponentId = bigint;
type ComponentSchema = Record<string, ComponentFieldType>;
interface ComponentDescriptor<TSchema extends ComponentSchema = ComponentSchema> {
    id: ComponentId;
    schema: TSchema;
}
type ComponentDataSchema = Record<string, TypedArray>;
interface IComponentData<TShape extends ComponentDataSchema = ComponentDataSchema> {
    readonly size: number;
    readonly isFull: boolean;
    readonly data: Readonly<TShape>;
    pushDefault(): void;
    pop(): void;
    swap(indexA: number, indexB: number): void;
    copyFrom(other: IComponentData<TShape>, index: number): void;
    field<Field extends keyof TShape>(field: Field): TypedArray;
}

type EntityId = number;

declare enum ComponentFieldType {
    F32 = 0,
    F64 = 1,
    I32 = 2,
    U32 = 3,
    I16 = 4,
    U8 = 5,
    BOOL = 6
}
type TypedArray = Float32Array | Float64Array | Int32Array | Uint32Array | Int16Array | Uint8Array;
type Signature = bigint;
interface IArchetype {
    readonly signature: Signature;
    readonly lastEntity: number;
    readonly size: number;
    addEntity(entityId: EntityId): void;
    addEntityFrom(entityId: EntityId, entityIndex: number, from: IArchetype): void;
    removeEntity(index: number): void;
    component(componentId: ComponentId): IComponentData;
}

declare class Query {
    private readonly archetypes;
    private mask;
    private readonly matched;
    constructor(archetypes: Map<string, IArchetype>, components?: ComponentId[]);
    onArchetypeAdded(archetype: IArchetype): void;
    build(): void;
    view(): readonly IArchetype[];
}

interface IWorld {
    instantiate(): EntityId;
    destroy(entityId: EntityId): void;
    addComponent(entityId: EntityId, componentId: ComponentId): void;
    flush(): void;
    createQuery(components: ComponentId[]): Query;
}

type CommandListener<T = any> = (data: T) => void;
interface ICommandDomain {
    flush(): void;
}
interface ICommandDomainRegister {
    register(command: ICommandDomain): void;
}

declare enum EventPriority {
    HIGH = 0,
    NORMAL = 1,
    LOW = 2
}
type ListenerHandler<T = unknown> = (data: T) => void;
interface IEventSender {
    send(event: string, data: unknown): void;
}
interface IEventEmitter {
    emit(event: string, data: unknown): void;
}
interface IEventSubscriptionPriority {
    on(event: string, listener: ListenerHandler, priority?: EventPriority): void;
}
interface IEventUnsubscription {
    off(event: string, listener: ListenerHandler): void;
    clear(event?: string): void;
}
interface IEventListenerRegistryPriority extends IEventSubscriptionPriority, IEventUnsubscription {
}
interface IEventPublisher extends IEventSender, IEventListenerRegistryPriority {
}
type IEventSink = IEventSender;
type EventTuple = [string, unknown];

interface EngineContext {
    readonly world: IWorld;
    readonly events: IEventPublisher;
    readonly commands: ICommandDomainRegister;
}
interface EngineInitializeContext {
    readonly world: IWorld;
}

interface Input {
    isKeyHeld(key: Keys): boolean;
    isKeyDown(key: Keys): boolean;
    isKeyUp(key: Keys): boolean;
    isMouseButtonHeld(btn: number): boolean;
    isMouseButtonDown(btn: number): boolean;
    isMouseButtonUp(btn: number): boolean;
    getMouseDeltaX(): number;
    getMouseDeltaY(): number;
    getMousePositionX(): number;
    getMousePositionY(): number;
    getMouseDelta(): {
        readonly x: number;
        readonly y: number;
    };
    getMousePosition(): {
        readonly x: number;
        readonly y: number;
    };
}
interface IInputSource {
    readonly state: Input;
}
declare enum Keys {
    KeyA = "KeyA",
    KeyB = "KeyB",
    KeyC = "KeyC",
    KeyD = "KeyD",
    KeyE = "KeyE",
    KeyF = "KeyF",
    KeyG = "KeyG",
    KeyH = "KeyH",
    KeyI = "KeyI",
    KeyJ = "KeyJ",
    KeyK = "KeyK",
    KeyL = "KeyL",
    KeyM = "KeyM",
    KeyN = "KeyN",
    KeyO = "KeyO",
    KeyP = "KeyP",
    KeyQ = "KeyQ",
    KeyR = "KeyR",
    KeyS = "KeyS",
    KeyT = "KeyT",
    KeyU = "KeyU",
    KeyV = "KeyV",
    KeyW = "KeyW",
    KeyX = "KeyX",
    KeyY = "KeyY",
    KeyZ = "KeyZ",
    Digit0 = "Digit0",
    Digit1 = "Digit1",
    Digit2 = "Digit2",
    Digit3 = "Digit3",
    Digit4 = "Digit4",
    Digit5 = "Digit5",
    Digit6 = "Digit6",
    Digit7 = "Digit7",
    Digit8 = "Digit8",
    Digit9 = "Digit9",
    Minus = "Minus",
    Equal = "Equal",
    BracketLeft = "BracketLeft",
    BracketRight = "BracketRight",
    Backslash = "Backslash",
    Semicolon = "Semicolon",
    Quote = "Quote",
    Backquote = "Backquote",
    Comma = "Comma",
    Period = "Period",
    Slash = "Slash",
    Escape = "Escape",
    Enter = "Enter",
    Tab = "Tab",
    Space = "Space",
    Backspace = "Backspace",
    ShiftLeft = "ShiftLeft",
    ShiftRight = "ShiftRight",
    ControlLeft = "ControlLeft",
    ControlRight = "ControlRight",
    AltLeft = "AltLeft",
    AltRight = "AltRight",
    MetaLeft = "MetaLeft",
    MetaRight = "MetaRight",
    CapsLock = "CapsLock",
    NumLock = "NumLock",
    ScrollLock = "ScrollLock",
    ArrowUp = "ArrowUp",
    ArrowDown = "ArrowDown",
    ArrowLeft = "ArrowLeft",
    ArrowRight = "ArrowRight",
    Home = "Home",
    End = "End",
    PageUp = "PageUp",
    PageDown = "PageDown",
    Insert = "Insert",
    Delete = "Delete",
    F1 = "F1",
    F2 = "F2",
    F3 = "F3",
    F4 = "F4",
    F5 = "F5",
    F6 = "F6",
    F7 = "F7",
    F8 = "F8",
    F9 = "F9",
    F10 = "F10",
    F11 = "F11",
    F12 = "F12",
    F13 = "F13",
    F14 = "F14",
    F15 = "F15",
    F16 = "F16",
    F17 = "F17",
    F18 = "F18",
    F19 = "F19",
    F20 = "F20",
    F21 = "F21",
    F22 = "F22",
    F23 = "F23",
    F24 = "F24",
    Numpad0 = "Numpad0",
    Numpad1 = "Numpad1",
    Numpad2 = "Numpad2",
    Numpad3 = "Numpad3",
    Numpad4 = "Numpad4",
    Numpad5 = "Numpad5",
    Numpad6 = "Numpad6",
    Numpad7 = "Numpad7",
    Numpad8 = "Numpad8",
    Numpad9 = "Numpad9",
    NumpadAdd = "NumpadAdd",
    NumpadSubtract = "NumpadSubtract",
    NumpadMultiply = "NumpadMultiply",
    NumpadDivide = "NumpadDivide",
    NumpadDecimal = "NumpadDecimal",
    NumpadEnter = "NumpadEnter",
    MediaPlayPause = "MediaPlayPause",
    MediaStop = "MediaStop",
    MediaTrackNext = "MediaTrackNext",
    MediaTrackPrevious = "MediaTrackPrevious",
    VolumeMute = "VolumeMute",
    VolumeUp = "VolumeUp",
    VolumeDown = "VolumeDown",
    ContextMenu = "ContextMenu",
    PrintScreen = "PrintScreen",
    Pause = "Pause"
}

type DeltaTime = {
    deltaTime: number;
    deltaTimeMilliseconds: number;
    totalElapsedTime: number;
    totalElapsedTimeMilliseconds: number;
};

interface SystemContext {
    readonly world: IWorld;
    readonly time: DeltaTime;
    readonly input: Input;
    readonly events: IEventSink;
    readonly commands: ICommandDomainRegister;
}

interface ISystem {
    initialize(context: EngineContext): void;
    start(): void;
    stop(): void;
    update(context: SystemContext): void;
}

interface IBuffer<T = any> {
    send(item: T): void;
    flush(): T[];
    size(): number;
}
interface IDispatcher<T = any> {
    dispatch(item: T): void;
}

declare class BufferConsumer<T = any> {
    protected buffer: IBuffer<T>;
    protected dispatcher?: IDispatcher<T> | undefined;
    constructor(buffer: IBuffer<T>, dispatcher?: IDispatcher<T> | undefined);
    send(item: T): void;
    execute(): void;
}

declare class DoubleBufferingConsumer<T> extends BufferConsumer<T> {
    constructor(dispatcher?: IDispatcher<T>);
}

declare class CommandScheduler {
    private readonly domains;
    register(domain: ICommandDomain): void;
    flushAll(): void;
}

type PriorityBucket<T = unknown> = ListenerHandler<T>[][];
type ListenersPriorityMap = {
    [K in string]?: PriorityBucket;
};
interface IEventBusPriority extends IEventListenerRegistryPriority, IEventEmitter {
}

declare class EventBusPriority implements IEventBusPriority {
    protected listeners: ListenersPriorityMap;
    on(event: string, listener: ListenerHandler, priority?: EventPriority): void;
    emit(event: string, data: unknown): void;
    off(event: string, listener: ListenerHandler): void;
    clear(event?: string): void;
}

declare class EventDispatcher implements IDispatcher<EventTuple> {
    private bus;
    constructor(bus: IEventBusPriority);
    on(event: string, listener: ListenerHandler, priority?: EventPriority): void;
    off(event: string, listener: ListenerHandler): void;
    clear(event?: string): void;
    dispatch(event: EventTuple): void;
}

declare class SystemScheduler {
    protected readonly context: EngineContext;
    protected readonly systems: ISystem[];
    constructor(context: EngineContext);
    register(system: ISystem): void;
    startAll(): void;
    stopAll(): void;
    tickAll(context: SystemContext): void;
}

interface IEngineController {
    initialize(context: EngineInitializeContext): void;
    start(): void;
    stop(): void;
    tick(context: SystemContext): void;
    registerSystem(system: ISystem): void;
    registerCommandDomain(domain: ICommandDomain): void;
    isRunning(): boolean;
}
interface IEngine extends IEngineController {
    readonly context: EngineContext;
}

declare class Engine implements IEngine {
    protected readonly systemScheduler: SystemScheduler;
    protected readonly commandScheduler: CommandScheduler;
    protected readonly eventBus: EventBusPriority;
    protected readonly eventDispatcher: EventDispatcher;
    protected readonly eventConsumer: DoubleBufferingConsumer<EventTuple>;
    private _context;
    private _isRunning;
    get context(): EngineContext;
    constructor();
    initialize(context: EngineInitializeContext): void;
    start(): void;
    stop(): void;
    tick(context: SystemContext): void;
    registerSystem(system: ISystem): void;
    registerCommandDomain(domain: ICommandDomain): void;
    isRunning(): boolean;
}

declare class CommandDomain implements ICommandDomain {
    private readonly buffers;
    private activeBuffer;
    private readonly handlers;
    private readonly priorities;
    private get writeBuffer();
    private get readBuffer();
    constructor(maxPriority?: number);
    register(command: string, handler: CommandListener, priority?: number): void;
    send(command: string, data: unknown): void;
    flush(): void;
}

declare class GameWorld implements IWorld {
    protected readonly commandDomain: CommandDomain;
    private readonly archetypes;
    private readonly entityLocation;
    private readonly entityPool;
    private readonly queries;
    constructor();
    flush(): void;
    instantiate(): number;
    destroy(entityId: EntityId): void;
    addComponent(entityId: EntityId, componentId: ComponentId): void;
    createQuery(components: ComponentId[]): Query;
    private performCreateEntity;
    private performDestroyEntity;
    private performAddComponent;
    private moveEntity;
    private removeFromArchetype;
    private getOrCreateArchetype;
    private onArchetypeCreated;
}

declare class MutableSystemContext implements SystemContext {
    world: IWorld;
    time: DeltaTime;
    input: Input;
    events: IEventSink;
    commands: ICommandDomainRegister;
}

declare abstract class System implements ISystem {
    initialize(context: EngineContext): void;
    start(): void;
    stop(): void;
    update(context: SystemContext): void;
}

declare class InputSystem extends System implements IInputSource {
    private readonly _state;
    get state(): Input;
    start(): void;
    stop(): void;
    update(): void;
    private onKeyDown;
    private onKeyUp;
    private onMouseDown;
    private onMouseUp;
    private onMouseMove;
    private onBlur;
}

type ScheduleCallback = () => void;

declare class SchedulerSystem extends System {
    private scheduler;
    private elapsedTime;
    update(context: SystemContext): void;
    schedule(callback: ScheduleCallback, delay: number): void;
}

interface ITimeSource {
    readonly time: Readonly<DeltaTime>;
}
interface ITimerTrackerController {
    reset(): void;
    advance(milliseconds: number): void;
}
interface ITimerTracker extends ITimeSource, ITimerTrackerController {
}

declare class Game {
    protected engine: IEngine;
    protected readonly world: GameWorld;
    protected readonly inputSystem: InputSystem;
    protected readonly schedulerSystem: SchedulerSystem;
    protected readonly clock: ITimerTracker;
    protected readonly systemContext: MutableSystemContext;
    private timeout;
    private lastTime;
    constructor();
    start(): void;
    protected initializeEngine(): void;
    protected initialize(): void;
    stop(): void;
    protected update: (timestamp: number) => void;
    private updateEngine;
    registerSystem(system: ISystem): void;
}

declare class TimeTracker implements ITimerTracker {
    protected totalElapsedTime: number;
    protected deltaTime: number;
    protected _time: DeltaTime;
    get time(): DeltaTime;
    reset(): void;
    advance(milliseconds: number): void;
    private updateState;
    getState(): DeltaTime;
}

declare class ComponentRegistry {
    private schemas;
    private signatureCache;
    private nextId;
    register<TSchema extends ComponentSchema>(schema: TSchema): ComponentDescriptor<TSchema>;
    createComponent(id: ComponentId): IComponentData;
    idsFromSignature(sig: Signature): bigint[];
}
declare const GlobalComponentRegistry: ComponentRegistry;
declare function createComponent<TSchema extends ComponentSchema>(schema: TSchema): ComponentDescriptor<TSchema>;

declare class Archetype implements IArchetype {
    readonly signature: Signature;
    private readonly entities;
    private readonly components;
    private readonly componentIds;
    private readonly componentIndex;
    get lastEntity(): number;
    get size(): number;
    constructor(signature: Signature, registry: ComponentRegistry);
    addEntity(entityId: EntityId): void;
    addEntityFrom(entityId: EntityId, entityIndex: number, from: Archetype): void;
    removeEntity(index: number): void;
    component(componentId: ComponentId): IComponentData<ComponentDataSchema>;
}

type SchemaToData<Shape extends ComponentSchema = ComponentSchema> = {
    [K in keyof Shape]: FieldTypeToArray[Shape[K]];
};
type FieldTypeToArray = {
    [ComponentFieldType.F32]: Float32Array;
    [ComponentFieldType.F64]: Float64Array;
    [ComponentFieldType.I32]: Int32Array;
    [ComponentFieldType.U32]: Uint32Array;
    [ComponentFieldType.I16]: Int16Array;
    [ComponentFieldType.U8]: Uint8Array;
    [ComponentFieldType.BOOL]: Uint8Array;
};
declare class ComponentData<S extends ComponentSchema = ComponentSchema, TShape extends ComponentDataSchema = SchemaToData<S>> implements IComponentData<TShape> {
    private readonly schema;
    private readonly fields;
    private _size;
    private capacity;
    get size(): number;
    get isFull(): boolean;
    get data(): TShape;
    constructor(schema: ComponentSchema, initialCapacity?: number);
    pushDefault(): void;
    pop(): void;
    swap(indexA: number, indexB: number): void;
    copyFrom(other: IComponentData<TShape>, index: number): void;
    field<Field extends keyof TShape>(field: Field): TShape[Field];
    private grow;
}

export { Archetype, type CommandListener, ComponentData, type ComponentDataSchema, type ComponentDescriptor, ComponentFieldType, type ComponentId, type ComponentSchema, type DeltaTime, Engine, type EngineContext, type EngineInitializeContext as EngineStartContext, type EntityId, EventPriority, Game, GameWorld, GlobalComponentRegistry, type IArchetype, type ICommandDomain, type ICommandDomainRegister, type IComponentData, type IEventEmitter, type IEventListenerRegistryPriority, type IEventPublisher, type IEventSender, type IEventSink, type IEventSubscriptionPriority, type IEventUnsubscription, type IInputSource, type ISystem, type ITimeSource, type ITimerTracker, type ITimerTrackerController, type IWorld, type Input, Keys, type ListenerHandler, Query, type Signature, System, type SystemContext, TimeTracker, type TypedArray, createComponent };
