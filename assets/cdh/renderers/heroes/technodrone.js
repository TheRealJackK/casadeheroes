extend("fiskheroes:iron_man_base");
loadTextures({
    "layer1": "cdh:technodrone_layer1",
    "layer2": "cdh:technodrone_layer2",
    "lights_layer1": "cdh:technodrone_lights_layer1",
    "lights_layer2": "cdh:technodrone_lights_layer2",
    "lights_suit": "cdh:technodrone_lights_suit.tx.json",
    "suit": "cdh:technodrone_suit.tx.json",
    "mask": "cdh:technodrone_helmet.tx.json",
    "mask_lights": "cdh:technodrone_helmet_lights.tx.json",
    "blade": "cdh:technodrone_blade"
});

var blade;

function initEffects(renderer) {
    blade = renderer.createEffect("fiskheroes:shield");
    blade.texture.set("blade");
    blade.anchor.set("rightArm");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        blade.unfold = entity.getInterpolatedData("fiskheroes:blade_timer");

        var f = Math.min(blade.unfold * 5, 1);
        blade.setOffset(2.9 + 0.1 * f, 6.0 + 3.0 * f, 0.0);
        blade.render();
    }
}