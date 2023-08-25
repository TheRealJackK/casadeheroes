extend("fiskheroes:hero_basic");
loadTextures({
    "repulsor": "fiskheroes:iron_man_repulsor",
    "repulsor_left": "fiskheroes:iron_man_repulsor_left",
    "repulsor_boots": "fiskheroes:iron_man_repulsor_boots"
});

var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("fiskheroes:external/iron_man_boosters");
var iron_man_helmet = implement("fiskheroes:external/iron_man_helmet");

var helmet;
var boosters;

var repulsor;
var metal_heat;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "HELMET" && hasFoldingHelmet() && entity.getInterpolatedData("fiskheroes:mask_open_timer2") > 0) {
            return "layer2";
        }
        return entity.getData("fiskheroes:suit_open_timer") > 0 ? "suit" : renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });
    renderer.setLights((entity, renderLayer) => {
        if (renderLayer == "HELMET" && entity.getInterpolatedData("fiskheroes:mask_open_timer2") > 0) {
            return null;
        }
        else if (renderLayer == "BOOTS" && !hasBootLights()) {
            return null;
        }
        return entity.getData('fiskheroes:suit_open_timer') > 0 ? "lights_suit" : renderLayer == "LEGGINGS" ? "lights_layer2" : "lights_layer1";
    });
}

function initEffects(renderer) {
    repulsor = renderer.createEffect("fiskheroes:overlay");

    if (hasFoldingHelmet()) {
        helmet = iron_man_helmet.createFolding(renderer, "mask", "mask_lights", "fiskheroes:mask_open_timer2");
    }
    else {
        helmet = iron_man_helmet.createFaceplate(renderer, "mask", null);
    }

    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect);

    utils.addCameraShake(renderer, 0.015, 1.5, "fiskheroes:flight_boost_timer");
    var shake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake.factor = entity.isSprinting() && entity.getData("fiskheroes:flying") ? 0.3 * Math.sin(Math.PI * entity.getInterpolatedData("fiskheroes:flight_boost_timer")) : 0;
        return true;
    });
    shake.intensity = 0.05;

    utils.bindParticles(renderer, "fiskheroes:iron_man").setCondition(entity => entity.getData("fiskheroes:flying"));
    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "fiskheroes:repulsor_blast", "rightArm", 0xDC4153, [
        { "firstPerson": [-4.5, 3.75, -7.0], "offset": [-0.5, 9.0, 0.0], "size": [1.5, 1.5] }
    ]);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    utils.addFlightAnimationWithLanding(renderer, "iron_man.FLIGHT", "fiskheroes:flight/iron_man.anim.json");
    utils.addHoverAnimation(renderer, "iron_man.HOVER", "fiskheroes:flight/idle/iron_man");
    utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive");

    addAnimationWithData(renderer, "iron_man.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer")
        .priority = -8;

    addAnimationWithData(renderer, "iron_man.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
        .priority = 10;
}

function hasFoldingHelmet() {
    return true;
}

function hasBootLights() {
    return true;
}

function render(entity, renderLayer, isFirstPersonArm) {
    boosters.render(entity, renderLayer, isFirstPersonArm, false);

    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET") {
            if (hasFoldingHelmet()) {
                helmet.render(entity);
            }
            else {
                helmet.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
            }
        }
        else if (renderLayer == "CHESTPLATE") {
            repulsor.opacity = Math.max(Math.min(entity.getInterpolatedData("fiskheroes:aimed_timer") * 2, 1), entity.getInterpolatedData("fiskheroes:dyn/booster_r_timer"));
            repulsor.texture.set(null, "repulsor");
            repulsor.render();
            repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_l_timer");
            repulsor.texture.set(null, "repulsor_left");
            repulsor.render();
        }
        else if (renderLayer == "BOOTS") {
            repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
            repulsor.texture.set(null, "repulsor_boots");
            repulsor.render();
        }
    }
}