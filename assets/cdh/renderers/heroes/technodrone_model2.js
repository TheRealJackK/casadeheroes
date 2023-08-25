extend("fiskheroes:hero_basic");
loadTextures({
    "base": "cdh:technodrone_nano/technodrone_nano_suit",
    "suit": "cdh:technodrone_nano/technodrone_nano_suit.tx.json",
    "mask": "cdh:technodrone_nano/technodrone_nano_mask.tx.json",
    "mask_lights": "cdh:technodrone_nano/technodrone_nano_suit_mask_lights",
    "lights": "cdh:technodrone_nano/technodrone_nano_suit_mask_lights",
    "reactor": "cdh:technodrone_nano/technodrone_nano_reactor",
    "reactor_lights": "cdh:technodrone_nano/technodrone_nano_reactor_lights",
    "blade": "cdh:technodrone_nano/technodrone_nano_blade",
    "blade_lights": "cdh:technodrone_nano/technodrone_nano_blade_lights",
    "cannon1": "cdh:technodrone_nano/technodrone_nano_cannon1",
    "cannon2": "cdh:technodrone_nano/technodrone_nano_cannon2",
    "cannon1_lights": "cdh:technodrone_nano/technodrone_nano_cannon1_lights",
    "cannon2_lights": "cdh:technodrone_nano/technodrone_nano_cannon2_lights",
    "cannon_inner": "cdh:technodrone_nano/technodrone_nano_cannon_inner",
    "repulsor": "fiskheroes:iron_man_repulsor",
    "repulsor_left": "fiskheroes:iron_man_repulsor_left",
    "repulsor_boots": "fiskheroes:iron_man_repulsor_boots"
});

var utils = implement("fiskheroes:external/utils");
var mk50_cannon = implement("fiskheroes:external/mk50_cannon");
var iron_man_boosters = implement("fiskheroes:external/iron_man_boosters");

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
    repulsor = renderer.createEffect("fiskheroes:overlay");

    blade = renderer.createEffect("fiskheroes:shield");
    blade.texture.set("blade", "blade_lights");
    blade.anchor.set("rightArm");
    blade.setOffset(1.5, 8.0, 0.0);
    blade.large = true;

    cannon = mk50_cannon.create(renderer, "rightArm", 0xDC4153);
    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(blade, cannon.c1, cannon.c2);

    utils.addCameraShake(renderer, 0.015, 1.5, "fiskheroes:flight_boost_timer");
    var shake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake.factor = entity.isSprinting() && entity.getData("fiskheroes:flying") ? 0.3 * Math.sin(Math.PI * entity.getInterpolatedData("fiskheroes:flight_boost_timer")) : 0;
        return true;
    });
    shake.intensity = 0.05;

    utils.bindParticles(renderer, "fiskheroes:iron_man").setCondition(entity => entity.getData("fiskheroes:flying"));
    renderer.bindProperty("fiskheroes:energy_bolt").color.set(0xDC4153);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.AIMING");
    addAnimationWithData(renderer, "basic.AIMING", "fiskheroes:aiming_fpcorr", "fiskheroes:aiming_timer");

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
    boosters.render(entity, renderLayer, isFirstPersonArm, true);

    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}