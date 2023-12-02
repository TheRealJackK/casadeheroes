extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "cdh:green_goblin_unlimited_layer1",
    "layer2": "cdh:green_goblin_unlimited_layer2",
    "wings": "cdh:green_goblin_unlimited_wings",
    "jetpack": "cdh:green_goblin_unlimited_jetpack",
    "jetpack_lights": "fiskheroes:falcon_jetpack_lights"
});

var utils = implement("fiskheroes:external/utils");
var wing_utils = implement("fiskheroes:external/wing_utils");
var falcon_boosters = implement("fiskheroes:external/falcon_boosters");

var wings;
var jetpack;

var boosters;

function initEffects(renderer) {
    wings = wing_utils.create(renderer, "wings", null, wing_utils.PRESET_CONTROLLED_FLIGHT);

    jetpack = renderer.createEffect("fiskheroes:model");
    jetpack.setModel(utils.createModel(renderer, "fiskheroes:falcon_jetpack", "jetpack", "jetpack_lights"));
    jetpack.anchor.set("body");

    utils.addCameraShake(renderer, 0.015, 0.75, "fiskheroes:flight_boost_timer");
    utils.addCameraShake(renderer, 0.015, 0.75, "fiskheroes:dyn/flight_super_boost_timer");
    var shake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake.factor = entity.isSprinting() && entity.getData("fiskheroes:flying") ? 0.15 * Math.sin(Math.PI * entity.getInterpolatedData("fiskheroes:flight_boost_timer")) : 0;

        if (entity.getData("fiskheroes:dyn/flight_super_boost") > 0) {
            shake.factor += 0.15 * Math.sin(Math.PI * entity.getInterpolatedData("fiskheroes:dyn/flight_super_boost_timer"));
        }
        return true;
    });
    shake.intensity = 0.05;
    boosters = initBoosters(renderer, utils, falcon_boosters);
}

function initBoosters(renderer, utils, falcon_boosters) {
    utils.bindParticles(renderer, "fiskheroes:falcon").setCondition(entity => entity.getData("fiskheroes:flying"));
    return falcon_boosters.create(renderer, 0x0033FF, "fiskheroes:orange_fire_layer_%s", {
        boosters: [
            { anchor: "body", offset: [0.0, 4.25, 2.6], size: [1.75, 3.0] },
            { anchor: "body", offset: [1.0, 4.25, 2.6], size: [1.5, 2.0], mirror: true }
        ],
        bloom: [
            { anchor: "body", offset: [0.0, 4.25, 2.6], size: [3.0, 1.75, 5.5] }
        ]
    });
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    utils.addHoverAnimation(renderer, "falcon.HOVER", "fiskheroes:flight/idle/falcon");
    utils.addFlightAnimation(renderer, "falcon.FLIGHT", getFlightAnimation(), (entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer"));
        data.load(1, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
        data.load(3, entity.getInterpolatedData("fiskheroes:dyn/flight_super_boost_timer"));
    });

    renderer.reprioritizeDefaultAnimation("RELOAD_GUN", -9);

    utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive");
    utils.addAnimationEvent(renderer, "FLIGHT_DIVE_ROLL", "fiskheroes:falcon_dive_roll");

    addAnimationWithData(renderer, "falcon.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
        .priority = 10;
}

function getFlightAnimation() {
    return "fiskheroes:flight/falcon.anim.json";
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        wings.render(entity, entity.getInterpolatedData("fiskheroes:shield_blocking_timer"));

        if (!isFirstPersonArm) {
            jetpack.render();
            boosters.render(entity);
        }
    }
}
