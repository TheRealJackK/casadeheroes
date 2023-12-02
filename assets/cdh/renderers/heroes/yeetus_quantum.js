extend("fiskheroes:hero_basic");
loadTextures({
    "base": "cdh:yeetus_quantum_suit",
    "suit": "cdh:technodrone_nano/quantum/technodrone_nano_suit_quantum.tx.json",
    "mask": "cdh:technodrone_nano/quantum/technodrone_nano_mask_quantum.tx.json",
    "mask_lights": "cdh:technodrone_nano/quantum/technodrone_nano_suit_mask_quantum_lights",
    "lights": "cdh:technodrone_nano/quantum/technodrone_nano_suit_quantum_lights",
    "reactor": "cdh:technodrone_nano/technodrone_nano_reactor",
    "reactor_lights": "cdh:technodrone_nano/technodrone_nano_reactor_lights",
    "blade": "cdh:technodrone_nano/technodrone_nano_blade",
    "blade_lights": "cdh:technodrone_nano/technodrone_nano_blade_lights",
    "backpack": "cdh:technodrone_nano/technodrone_nano_suit_backpack",
    "cannon1": "cdh:technodrone_nano/technodrone_nano_cannon1",
    "cannon2": "cdh:technodrone_nano/technodrone_nano_cannon2",
    "cannon1_lights": "cdh:technodrone_nano/technodrone_nano_cannon1_lights",
    "cannon2_lights": "cdh:technodrone_nano/technodrone_nano_cannon2_lights",
    "cannon_inner": "cdh:technodrone_nano/technodrone_nano_cannon_inner",
    "repulsor": "fiskheroes:iron_man_repulsor",
    "repulsor_left": "fiskheroes:iron_man_repulsor_left",
    "repulsor_boots": "fiskheroes:iron_man_repulsor_boots",
    "segment": "cdh:technodrone_arms",
    "claw": "cdh:technodrone_claw",
    "claw_lights": "cdh:technodrone_claw_light"
});

var utils = implement("fiskheroes:external/utils");
var mk50_cannon = implement("fiskheroes:external/mk50_cannon");
var mk85_backpack = implement("fiskheroes:external/mk85_backpack");
var iron_man_boosters = implement("fiskheroes:external/iron_man_boosters");

var chest;
var backpack;
var cannon;
var boosters;

var repulsor;
var blade;
var metal_heat;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "mask";
        }
        else if (!entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType() === "BOOK_PREVIEW") {
            var timer = entity.getInterpolatedData("fiskheroes:dyn/nanite_timer");
            return timer == 0 ? "reactor" : timer < 1 ? "suit" : "base";
        }
        return "base";
    });
    renderer.setLights((entity, renderLayer) => {
        if (entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "mask_lights";
        }
        return (!entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType() === "BOOK_PREVIEW") && entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") < 1 ? "reactor_lights" : "lights";
    });

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    chest = renderer.createEffect("fiskheroes:chest");
    chest.setExtrude(1).setYOffset(1);

    repulsor = renderer.createEffect("fiskheroes:overlay");

    blade = renderer.createEffect("fiskheroes:shield");
    blade.texture.set("blade", "blade_lights");
    blade.anchor.set("rightArm");
    blade.setOffset(1.5, 8.0, 0.0);
    blade.large = true;

    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0xDC4153);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.15;
        return true;
    });

    cannon = mk50_cannon.create(renderer, "rightArm", 0xDC4153);
    backpack = mk85_backpack.create(renderer, "backpack");
    boosters = iron_man_boosters.create(renderer, "fiskheroes:red_fire_layer_%s", true);

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(blade, cannon.c1, cannon.c2, backpack.b1, backpack.b2, backpack.b3);

    utils.addCameraShake(renderer, 0.015, 1.5, "fiskheroes:flight_boost_timer");
    var shake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake.factor = entity.isSprinting() && entity.getData("fiskheroes:flying") ? 0.3 * Math.sin(Math.PI * entity.getInterpolatedData("fiskheroes:flight_boost_timer")) : 0;
        return true;
    });
    shake.intensity = 0.05;

    utils.bindParticles(renderer, "fiskheroes:iron_man").setCondition(entity => entity.getData("fiskheroes:flying"));
    renderer.bindProperty("fiskheroes:energy_bolt").color.set(0xDC4153);

    utils.bindParticles(renderer, "fiskheroes:iron_man").setCondition(entity => entity.getData("fiskheroes:flying"));
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:charged_beam", "body", 0xDC4153, [
        { "offset": [6.75, 10.0, 3.0], "size": [2.0, 2.0] },
        { "offset": [10.0, 0.5, 3.0], "size": [2.0, 2.0] },
        { "offset": [6.5, -4.5, 3.0], "size": [2.0, 2.0] },
        { "offset": [-6.75, 10.0, 3.0], "size": [2.0, 2.0] },
        { "offset": [-10.0, 0.5, 3.0], "size": [2.0, 2.0] },
        { "offset": [-6.5, -4.5, 3.0], "size": [2.0, 2.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));

    var ock_arm = utils.createModel(renderer, "fiskheroes:ock_arm", "segment");
    var ock_claw = utils.createModel(renderer, "fiskheroes:ock_claw", "claw", "claw_lights");
    ock_claw.bindAnimation("fiskheroes:ock_claw").setData((entity, data) => {
        var t = entity.as("TENTACLE");
        data.load(0, 1 - Math.min(t.getCaster().getInterpolatedData("fiskheroes:tentacle_extend_timer") * 2, 1));
        data.load(1, t.getIndex());
        data.load(2, t.getGrabTimer());
        data.load(3, t.getStrikeTimer());
    });

    var tentacles = renderer.bindProperty("fiskheroes:tentacles").setTentacles([
        { "offset": [2.0, -4.5, -2.0], "direction": [13.0, 10.0, -10.0] },
        { "offset": [-2.0, -4.5, -2.0], "direction": [-13.0, 10.0, -10.0] },
        { "offset": [2.0, -7.5, -2.0], "direction": [13.0, -10.0, -10.0] },
        { "offset": [-2.0, -7.5, -2.0], "direction": [-13.0, -10.0, -10.0] }
    ]);
    tentacles.anchor.set("body");
    tentacles.setSegmentModel(ock_arm);
    tentacles.setHeadModel(ock_claw);
    tentacles.segmentLength = 1.8;
    tentacles.segments = 16;

    utils.setOpacityWithData(renderer, 0.5, 1.0, "fiskheroes:intangibility_timer");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.AIMING");
    addAnimationWithData(renderer, "basic.AIMING", "fiskheroes:aiming_fpcorr", "fiskheroes:aiming_timer");
    addAnimation(renderer, "basic.CHARGED_BEAM", "fiskheroes:dual_aiming").setData((entity, data) => data.load(Math.max(entity.getInterpolatedData("fiskheroes:beam_charge") * 5 - 4, 0)));

    utils.addFlightAnimationWithLanding(renderer, "iron_man.FLIGHT", "fiskheroes:flight/iron_man.anim.json");
    utils.addHoverAnimation(renderer, "iron_man.HOVER", "fiskheroes:flight/idle/iron_man");
    utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive");

    addAnimationWithData(renderer, "iron_man.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer")
        .priority = -8;

    addAnimationWithData(renderer, "iron_man.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
        .priority = 10;
}

function render(entity, renderLayer, isFirstPersonArm) {
    repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_r_timer");
    repulsor.texture.set(null, "repulsor");
    repulsor.render();
    repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_l_timer");
    repulsor.texture.set(null, "repulsor_left");
    repulsor.render();
    repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
    repulsor.texture.set(null, "repulsor_boots");
    repulsor.render();

    blade.unfold = entity.getInterpolatedData("fiskheroes:blade_timer");
    blade.render();

    cannon.render(entity.getInterpolatedData("fiskheroes:aimed_timer"));
    backpack.render(entity.getInterpolatedData("fiskheroes:beam_charge"));
    boosters.render(entity, renderLayer, isFirstPersonArm, true);

    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();

    chest.render();
}