import { expect } from "chai";
import { Engine, EngineArguments, SceneManager } from "../../src";

describe("SceneManager class unit tests", () => {
    var sm: SceneManager = new SceneManager();
    it("should be able to be created as empty", () => {
        expect(sm).to.not.be.undefined;
    });
    it("should have an empty scene loaded initially", () => {
        expect(sm.scene).to.be.undefined;
    });
    it("should unload the previous scene when loading the scene", () => {
        expect(sm.scene).to.be.undefined; // NOTE: The scene should be undefined from the previous test
        sm.loadScene("../assets/blankscene.json");
        expect(sm.scene).to.not.be.undefined;
        expect(sm.scene.title).to.equal("blankscene");
    });
    describe("engine's scene manager", () => {
        before(() => {
            Engine.start(new EngineArguments());
        });
        it("should have a scenemanager variable in the engine", () => {
            expect(Engine).to.respondTo("sceneManager");
        });
        it("should have loaded the blank scene for the engine on start", () => {
            expect(Engine.instance.scene.title).to.equal("blankscene");
        });
        it("should load a new scene", () => {
            Engine.instance.sceneManager.loadScene("testscene");
            expect(Engine.instance.scene.title).to.equal("testscene");
        });
        it("should have unloaded the old scene", () => {
            expect(Engine.instance.scene.title).to.not.equal("blankscene");
        });
        it("should be cleaned up on engine shutdown", () => {
            // TODO: this needs to do something...
        });
    });
});