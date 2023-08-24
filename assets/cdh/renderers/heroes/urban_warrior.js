extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "cdh:urban_warrior_layer1",
    "layer2": "cdh:urban_warrior_layer2",
    "quiver": "fiskheroes:quiver/green_arrow",
    "gun": "fiskheroes:deathstroke_dceu_gun",
    "ammo_bag": "fiskheroes:deathstroke_dceu_ammo_bag"
});

var utils = implement("fiskheroes:external/utils");

function initEffects(renderer) {
    utils.addLivery(renderer, "QUIVER", "quiver");
}