import "mocha";
import { Component, Engine, EngineArguments, Entity, EventType, Log, Message, MessageReceiverComponent, Transform } from "../../src";

before(() => {
    Engine.start(new EngineArguments());
});
describe("MessageRecieverComponent", () => {
    function logMessage(message: Message): void {
        Log("Receiving from Entity MessageReceiverComponent");
        Log(message.JSONString);
    }
    let testEntity = new Entity(
        "", 
        new Transform(1, 1), 
        Array<Entity>(), 
        Array<Component>(
            new MessageReceiverComponent(EventType.Entity, logMessage),
        )
    );
    it("should recieve messages from the message system", () => {

    });
});
after(() => {
    Engine.stop();
});