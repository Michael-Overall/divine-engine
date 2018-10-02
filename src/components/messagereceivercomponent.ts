import { Component, EventType, Message } from "../core";

export class MessageReceiverComponent extends Component {
    constructor(eventType: EventType, action: (message: Message) => void) {
        super();
        // Engine.instance!.messageSystem.on(eventType, action); // DEBUG: Hitting before Engine.instance initialized
    }
    public sendMessage(type: EventType | string, message: Message) {
        // Engine.instance!.messageSystem.sendMessage(type, message);
    }
}