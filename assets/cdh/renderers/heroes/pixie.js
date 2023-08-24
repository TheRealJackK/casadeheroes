extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "cdh:pixie_layer1",
    "layer2": "cdh:pixie_layer2",
    "wings": "cdh:pixie_wings",
});

var utils = implement("fiskheroes:external/utils");
var wing_utils = implement("fiskheroes:external/wing_utils");
var falcon_boosters = implement("fiskheroes:external/falcon_boosters");

var wings;

function initEffects(renderer) {
    wings = wing_utils.create(renderer, "wings", null, wing_utils.PRESET_CONTROLLED_FLIGHT);

    var color = 0x66FF47;

    // Charged Beam
    var beam = renderer.createResource("BEAM_RENDERER", "fiskheroes:mysterio_beam");
    utils.bindBeam(renderer, "fiskheroes:charged_beam", beam, "head", color, [
        { "offset": [0.0, 5.0, -22.0], "size": [4.0, 4.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));
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
    
    renderer.removeCustomAnimation("basic.AIMING");
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    
    addAnimation(renderer, "basic.AIMING", "fiskheroes:dual_aiming").setData((entity, data) => {
        var charge = entity.getInterpolatedData("fiskheroes:beam_charge");
        data.load(Math.max(entity.getInterpolatedData("fiskheroes:aiming_timer"), entity.getData("fiskheroes:beam_charging") ? Math.min(charge * 3, 1) : Math.max(charge * 5 - 4, 0)));
    });
}

function getFlightAnimation() {
    return "fiskheroes:flight/falcon.anim.json";
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        wings.render(entity, entity.getInterpolatedData("fiskheroes:shield_blocking_timer"));
    }
}