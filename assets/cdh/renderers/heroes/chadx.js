extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "cdh:chadx_layer1",
    "layer2": "cdh:chadx_layer2",
    "eyes": "cdh:chadx_eyes",
    "cape": "cdh:chadx_cape"
});

var speedster = implement("fiskheroes:external/speedster_utils");
var capes = implement("fiskheroes:external/capes");

var vibration;
var cape;

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => renderLayer == "HELMET" && entity.getData("fiskheroes:mask_open") ? "eyes" : null);
}

function initEffects(renderer) {

    vibration = renderer.createEffect("fiskheroes:vibration");

    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.weight = 0.9;
    physics.maxFlare = 0.5;
    cape = capes.createDefault(renderer, 24, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape");

    speedster.init(renderer, "fiskheroes:lightning_red");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if ((!entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType() === "BOOK_PREVIEW") && entity.getData("fiskheroes:mask_open")) {
        vibration.render();
    }
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        cape.render(entity);
    }
}