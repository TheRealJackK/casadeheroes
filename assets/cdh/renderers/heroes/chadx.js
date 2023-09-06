extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "cdh:chadx_layer1",
    "layer2": "cdh:chadx_layer2",
    "eyes": "cdh:chadx_eyes",
    "cape": "cdh:chadx_cape",
    "blade": "cdh:chadx_blade"
});

var utils = implement("fiskheroes:external/utils");
var speedster = implement("fiskheroes:external/speedster_utils");
var capes = implement("fiskheroes:external/capes");

var blade;
var vibration;
var cape;

function init(renderer) {
    parent.init(renderer);
    // Eyes
    renderer.setLights((entity, renderLayer) => renderLayer == "HELMET" && entity.getData("fiskheroes:mask_open") ? "eyes" : null);

    // Blade
    renderer.setTexture((entity, renderLayer) => renderLayer == "HELMET" ? "helmet": renderLayer == "LEGGINGS" ? "layer2" : "layer1");

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
    renderer.fixHatLayer("HELMET", "CHESTPLATE");
}

function initEffects(renderer) {
    blade = renderer.createEffect("fiskheroes:shield");
    blade.texture.set("blade");
    blade.anchor.set("rightArm");

    utils.bindParticles(renderer, "fiskheroes:black_lightning").setCondition(entity => entity.getData("fiskheroes:flying"));
    utils.bindBeam(renderer, "fiskheroes:lightning_cast", "fiskheroes:lightning_cast", "rightArm", 0xFE0648, [
        { "firstPerson": [-8.0, 4.5, -10.0], "offset": [-0.5, 9.0, 0.0], "size": [0.75, 0.75] }
    ]);

    vibration = renderer.createEffect("fiskheroes:vibration");

    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.weight = 0.9;
    physics.maxFlare = 0.5;
    cape = capes.createDefault(renderer, 24, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape");

    speedster.init(renderer, "cdh:lightning_chad");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if ((!entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType() === "BOOK_PREVIEW") && entity.getData("fiskheroes:mask_open")) {
        vibration.render();
    }
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        cape.render(entity);
    }
    if (renderLayer == "CHESTPLATE") {
        blade.unfold = entity.getInterpolatedData("fiskheroes:blade_timer");

        var f = Math.min(blade.unfold * 5, 1);
        blade.setOffset(2.9 + 0.1 * f, 6.0 + 3.0 * f, 0.0);
        blade.render();
    }
}