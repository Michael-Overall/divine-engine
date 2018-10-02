import { EventEmitter } from "events";
import { RenderComponent } from "../components/rendercomponent";
import { ErrorCode } from "./logging";

/**
 * Message system
 */
export class MessageSystem extends EventEmitter {
    /**
     * Message system constructor.
     */
    constructor() {
        super();
    }
    /**
     * Send a new message to the system. There needs to be either an EventType 
     * or a string. Recommended to make an enumerator list to define your
     * own classes. The message needs to extends from the base Message class.
     * @param type 
     * @param message 
     */
    public sendMessage(type: EventType | string, message: Message): void {
        this.emit(type, message);
    }
    /**
     * Returns the count of all listeners in the system.
     * @returns number
     */
    public allListenersCount(): number {
        var count: number = 0;
        var events = this.eventNames();
        events.forEach((element) => {
            count += this.listenerCount(element);
        });
        return count;
    }
}

/**
 * Base engine message types. These are all message types that are handled by 
 * the system natively.
 */
export enum EventType {
    Entity = "entity", 
    ErrorSystem = "errorsystem",
    IOSystem = "iosystem",
    PhysicsSystem = "physicssystem",
    RenderSystem = "rendersystem",
    SoundSystem = "soundsystem",
    KeyInput = "keyinput",
    MouseInput = "mouseinput",
    TouchInput = "touchinput"
}

/**
 *              ------------
 *              CORE CLASSES
 *              ------------
 *  Notes:
 *  ------
 *  
 *  These are all the core Messages that the system will handle. The 
 *  messages here correspond with the enumerator class `EventType` defined in 
 *  `messagesystem.ts`. For your own messages and message types, please save an
 *  enumerated list in your own message types file and extend these classes 
 *  there as well. 
 *  
 *  Instructions:
 *  -------------
 *  All messages must implement thier own constructor or else they will not 
 *  parse correctly.
 */
/**
 * Message object.
 * The data is saved as a JSON object in string format. It will be parsed based
 * on it's message type. Listeners have a specific format based on class.
 */
export class Message {    
    // Unique message ID. Parse the current time to a hash.
    public guid: string;

    constructor() {
        this.guid = this.createGUID();
    }
    public get JSONString(): string {
        return JSON.stringify(this);
    }
    /**
     * Returns the JSON object.
     * @returns JSON
     */
    public get JSON(): JSON {
        return JSON.parse(JSON.stringify(this));
    }
    /**
     * Unique message ID.
     */
    private createGUID(): string {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }  
        return `${s4() + s4()}-${s4() + s4()}-${s4() + s4()}-${s4() + s4()}`;
    }
}

/** 
 * Testing message for empty messages.
 */
export class TestMessage extends Message {
    constructor(public data?: string | number) {
        super();
        this.data = data;
    }
}

/**
 * Base message data class(class).
 * All messages must extend from this class.
 *  
 *  data: is a JSON string object.
 */

/**
 * EntityMessages class. 
 * All entity messages must extend this class.
 */
export class EntityMessage extends Message {
    constructor() {
        super();
    }
}

/**
 * Error system message class. 
 * All error messages must extend this class.
 */
export class ErrorSystemMessage extends Message {
    constructor(public errorCode: ErrorCode, public data: string | undefined ) {
        super();
        this.errorCode = errorCode;
        this.data = data;
    }
}

/**
 * IO system message class. 
 * All io messages must extend this class.
 */
export class IOSystemMessage extends Message {
    constructor() {
        super();
    }
}

/**
 * Physics system message class. 
 * All physics messages must extend this class.
 */
export class PhysicsSystemMessage extends Message {
    constructor() {
        super();
    }
}

/**
 * Render system message  class. 
 * All render messages must extend this class.
 */
export class RenderSystemMessage extends Message {
    constructor(public renderableComponent: RenderComponent) {
        super();
        this.renderableComponent = renderableComponent;
    }
}

/**
 * Sound system message class. 
 * All sound messages must extend this class.
 */
export class SoundSystemMessage extends Message {
    constructor() {
        super();
    }
}
/**             ----------------
 *              END CORE CLASSES
 *              ----------------
 */

 /**
  * Key Codes for keyboard input
  * 
  * //REVIEW: This is most likely unnecessary
  */
export enum KeyCode {
    a, b, c, d,
    e, f, g, h,
    i, j, k, l,
    m, n, o, p,
    q, r, s, t,
    u, v, w, x,
    y, z, A, B,
    C, D, E, F,
    G, H, I, J,
    K, L, M, N,
    O, P, Q, R,
    S, T, U, V,
    W, X, Y, Z,
}

 /**
  * Key input message class.
  */
export class KeyInputMessage extends IOSystemMessage {
    
    /**
     * @param  {string} entityID 
     * @param  {string} publiccode
     */
    constructor(public keyCode: KeyCode) {
        super();
        this.keyCode = keyCode;
    }
}
/**
 * Mouse input message class.
 */
export class MouseInputMessage extends IOSystemMessage {
    constructor(public x: number, public y: number) {
        super();
        this.x = x;
        this.y = y;
    }
}
/**
 * Touch input message class.
 */
export class TouchInputMessage extends IOSystemMessage {
    constructor(public x: number, public y: number) {
        super();
        this.x = x;
        this. y = y;
    }
}
