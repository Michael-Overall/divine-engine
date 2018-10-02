import { expect } from "chai";
import "mocha";
import { EntityMessage, EventType, KeyCode, KeyInputMessage, Log, Message, MessageSystem, MouseInputMessage, PhysicsSystemMessage, RenderComponent, RenderSystemMessage, TestMessage } from "../../src";

describe("Message System unit testing", () => {
    describe("Messages", () => {
        it("should be able to be created empty", () => {
            let message: Message = new Message();
            expect(message.guid).is.not.null;
        });
        it("should export as a JSON string", () => {
            let message: Message = new Message();
            expect(message.JSONString).to.equal(`{\"guid\":\"${message.guid}\"}`);
        });
        it("should save data as a string in JSON format", () => {
            let message: Message = new Message();
            expect(message.JSONString).to.equal(`{\"guid\":"${message.guid}"}`);
        });
        it("should be the parent of TestMessage", () => {
            let testMessage: TestMessage = new TestMessage();
            expect(testMessage).to.be.instanceOf(Message);
        });
        it("TestMessages should take a single string or digit of data as a property", () => {
            var message: TestMessage = new TestMessage("Hello world!");
            expect(message.JSONString).to.equal(`{"guid":"${message.guid}","data":"${message.data}"}`);
            message = new TestMessage(1234);
            expect(message.data).to.equal(1234);
        });
        it("should export as a JSON object", () => {
            let message: TestMessage = new TestMessage("1");
            expect(message.JSON).to.instanceOf(Object); // NOTE: Because JSON is an Object
        });
        it("should be able to get properties of TestMessage", () => {
            var message: TestMessage = new TestMessage();
            expect(message.guid).to.not.be.null;
            expect(message.data).to.be.undefined;
            let hw = "Hello world!";
            message = new TestMessage(hw);
            expect(message.data).to.equal(hw);
        });
        it("should be able to get the properties of a RenderMessage", () => {
            let rc: RenderComponent = new RenderComponent("playerRC");
            let message: RenderSystemMessage = new RenderSystemMessage(rc);
            expect(message.renderableComponent).to.deep.equal(rc);
        });
        it("should be able to get the properties of a PhysicsMessage", () => {
            let message: PhysicsSystemMessage = new PhysicsSystemMessage();
            expect(true);
        });
        it("should be able to get properties of MouseInputMessage", () => {
            let message: MouseInputMessage = new MouseInputMessage(11, 23);
            let messageGUID: string = message.guid;
            expect(message.guid).to.be.equal(message.guid);
            expect(message.x).to.equal(11);
            expect(message.y).to.equal(23);
        });
    });
    describe("Message system", () => {
        var data: string = "";
        var data2: string = "";
        var keyInputMessageData: KeyInputMessage;
        var messageSystem: MessageSystem = new MessageSystem();
        function messageDataVariableSave(message: Message) {
            data = message.JSONString;
        }
        function messageDataVariableSave2(message: Message) {
            data2 = message.JSONString;
        }
        function logMessage(message: Message) {
            Log(message.JSONString);
        }
        function keyInputMessageHandler(message: Message) {
            keyInputMessageData = message as KeyInputMessage;
        }
        beforeEach(() => {
            messageSystem.on(EventType.Entity, logMessage);
            messageSystem.on(EventType.ErrorSystem, logMessage);
            messageSystem.on(EventType.IOSystem, logMessage);
            messageSystem.on(EventType.KeyInput, logMessage);
            messageSystem.on(EventType.MouseInput, logMessage);
            messageSystem.on(EventType.PhysicsSystem, logMessage);
            messageSystem.on(EventType.RenderSystem, logMessage);
            messageSystem.on(EventType.SoundSystem, logMessage);
            messageSystem.on(EventType.TouchInput, logMessage);
            expect(messageSystem.allListenersCount()).to.equal(9);
        });
        afterEach(() => {
            data = "";
            data2 = "";
            messageSystem = new MessageSystem();
        });
        it("should get all listeners in the system", () => {
            messageSystem.on(EventType.Entity, messageDataVariableSave);
            messageSystem.on(EventType.ErrorSystem, messageDataVariableSave);
            messageSystem.on(EventType.IOSystem, messageDataVariableSave);
            messageSystem.on(EventType.KeyInput, messageDataVariableSave);
            messageSystem.on(EventType.MouseInput, messageDataVariableSave);
            messageSystem.on(EventType.PhysicsSystem, messageDataVariableSave);
            messageSystem.on(EventType.RenderSystem, messageDataVariableSave);
            messageSystem.on(EventType.TouchInput, messageDataVariableSave);
            messageSystem.on(EventType.SoundSystem, messageDataVariableSave);
            expect(messageSystem.allListenersCount()).to.equal(18);
        });
        it("should add new listener of EventType.RenderSystem", () => {
            messageSystem.on(EventType.RenderSystem, messageDataVariableSave);
            expect(messageSystem.listenerCount(EventType.RenderSystem)).to.equal(2);
        });
        it("should add 3 new listeners of the same EventType.RenderSystem", () => {
            messageSystem.on(EventType.RenderSystem, messageDataVariableSave);
            messageSystem.on(EventType.RenderSystem, messageDataVariableSave);
            messageSystem.on(EventType.RenderSystem, messageDataVariableSave);
            expect(messageSystem.listenerCount(EventType.RenderSystem)).to.equal(4);
        });
        it("should add 3 new listeners of different types, but have the same number of event types", () => {
            messageSystem.on(EventType.PhysicsSystem, messageDataVariableSave);
            messageSystem.on(EventType.RenderSystem, messageDataVariableSave);
            messageSystem.on(EventType.SoundSystem, messageDataVariableSave);
            expect(messageSystem.eventNames()).to.have.length(9);
        });
        it("should add 5 different listeners and remove 1 listener of differnt types", () => {
            messageSystem.on(EventType.PhysicsSystem, messageDataVariableSave);
            messageSystem.on(EventType.RenderSystem, messageDataVariableSave);
            messageSystem.on(EventType.IOSystem, messageDataVariableSave);
            messageSystem.on(EventType.Entity, messageDataVariableSave);
            messageSystem.on(EventType.ErrorSystem, messageDataVariableSave);
            messageSystem.removeListener(EventType.PhysicsSystem, 
                messageDataVariableSave);
            expect(messageSystem.allListenersCount()).to.equal(13);
        });
        it("should be emitting render messages and receiving them", () => {
            messageSystem.on(EventType.RenderSystem, messageDataVariableSave);
            let mouseInputMessageData: MouseInputMessage = new MouseInputMessage(1, 1);
            messageSystem.emit(EventType.RenderSystem, mouseInputMessageData);
            expect(data).to.equal(mouseInputMessageData.JSONString);
            let mouseInputMessageData2: MouseInputMessage = new MouseInputMessage(3, 4);
            let mouseInputMessageData3: MouseInputMessage = new MouseInputMessage(81, 81);
            messageSystem.emit(EventType.RenderSystem, mouseInputMessageData2);
            messageSystem.emit(EventType.RenderSystem, mouseInputMessageData3);
            expect(data).to.equal(mouseInputMessageData3.JSONString);
        });
        it("should be emitting render messages and receiving them", () => {
            messageSystem.on(EventType.RenderSystem, messageDataVariableSave);
            let renderSystemMessageData: RenderSystemMessage = new RenderSystemMessage(new RenderComponent("player"));
            messageSystem.emit(EventType.RenderSystem, renderSystemMessageData);
            expect(data).to.equal(renderSystemMessageData.JSONString);
        });
        it("should send 2 types (EventType.MouseInputMessage and EventType.Entity) and receive only EventType.Entity", 
            () => {
            messageSystem.on(EventType.Entity, logMessage);
            let entityMessageData: EntityMessage = new EntityMessage();
            let entityMessageData2 = new EntityMessage();
            messageSystem.emit(EventType.Entity, entityMessageData);
            messageSystem.emit(EventType.Entity, entityMessageData2);
            expect(data).to.not.equal(entityMessageData);
        });
        it("should send and receive a message of EventType.Entity to two entity listeners", () => {
            messageSystem.on(EventType.Entity, messageDataVariableSave);
            messageSystem.on(EventType.Entity, messageDataVariableSave2);
            let entityMessage = new EntityMessage();
            messageSystem.emit(EventType.Entity, entityMessage);
            expect(data).to.equal(entityMessage.JSONString);
            expect(data2).to.equal(entityMessage.JSONString);
        });
        it("can remove all listeners of 1", () => {
            messageSystem.removeAllListeners();
            messageSystem.on(EventType.RenderSystem, messageDataVariableSave);
            expect(messageSystem.listenerCount(
                EventType.RenderSystem)).to.equal(1);
            messageSystem.removeAllListeners();
            expect(messageSystem.listenerCount(
                EventType.RenderSystem)).to.equal(0);
        });
        it("can remove all listeners of 2, same event type", () => {
            messageSystem.removeAllListeners();
            messageSystem.on(EventType.RenderSystem, messageDataVariableSave);
            messageSystem.on(EventType.RenderSystem, messageDataVariableSave);
            expect(messageSystem.listenerCount(
                EventType.RenderSystem)).to.equal(2);
            messageSystem.removeAllListeners();
            expect(messageSystem.listenerCount(
                EventType.RenderSystem)).to.equal(0);
        });
        it("can remove 1 listener of 1", () => {
            messageSystem.removeAllListeners();
            messageSystem.on(EventType.RenderSystem, messageDataVariableSave);
            expect(messageSystem.listenerCount(
                EventType.RenderSystem)).to.equal(1);
            messageSystem.removeListener(EventType.RenderSystem, 
                messageDataVariableSave);
            expect(messageSystem.listenerCount(
                EventType.RenderSystem)).to.equal(0);
        });
        it("can remove 1 listener of 2 same event type", () => {
            messageSystem.removeAllListeners();
            messageSystem.on(EventType.RenderSystem, messageDataVariableSave);
            messageSystem.on(EventType.RenderSystem, messageDataVariableSave);
            expect(messageSystem.listenerCount(
                EventType.RenderSystem)).to.equal(2);
            messageSystem.removeListener(EventType.RenderSystem, 
                messageDataVariableSave); 
            expect(messageSystem.listenerCount(
                EventType.RenderSystem)).to.equal(1);
        });
        it("can remove 1 listener of 3, different even type", () => {
            messageSystem.removeAllListeners();
            messageSystem.on(EventType.RenderSystem, messageDataVariableSave);
            messageSystem.on(EventType.Entity, messageDataVariableSave);
            messageSystem.on(EventType.PhysicsSystem, 
                (messageDataVariableSave));
            expect(messageSystem.allListenersCount()).to.equal(3);
            messageSystem.removeListener(EventType.Entity, 
                messageDataVariableSave);
            expect(messageSystem.allListenersCount()).to.equal(2);
        });
        it("can remove all listeners of one event type of two even types", 
            () => {
            messageSystem.removeAllListeners();
            messageSystem.on(EventType.RenderSystem, messageDataVariableSave);
            messageSystem.on(EventType.RenderSystem, messageDataVariableSave);
            messageSystem.on(EventType.PhysicsSystem, messageDataVariableSave);
            expect(messageSystem.allListenersCount()).to.equal(3);
            messageSystem.removeAllListeners(EventType.RenderSystem);
            expect(messageSystem.allListenersCount()).to.equal(1);
        });
        it("should be able to send KeyInputMessages", () => {
            let keyInputMessage_A: KeyInputMessage = new KeyInputMessage(KeyCode.A);
            messageSystem.on(EventType.IOSystem, keyInputMessageHandler);
            messageSystem.emit(EventType.IOSystem, keyInputMessage_A);
            expect(keyInputMessageData.keyCode).to.equal(KeyCode.A);
        });
    });
});