extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "cdh:ambush_layer1",
    "layer2": "cdh:ambush_layer2"
});

var utils = implement("fiskheroes:external/utils");
var color = 0xCCCC00

function initEffects(renderer) {
    utils.bindCloud(renderer, "fiskheroes:teleportation", "fiskheroes:breach");
    utils.bindBeam(renderer, "fiskheroes:energy_projection", "fiskheroes:energy_projection", "body", color, [
        { "firstPerson": [0.0, 6.0, 0.0], "offset": [0.0, 5.0, -4.0], "size": [4.0, 4.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));
}