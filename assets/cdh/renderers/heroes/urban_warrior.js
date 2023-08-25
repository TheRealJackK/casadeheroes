extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "cdh:urban_warrior_layer1",
    "layer2": "cdh:urban_warrior_layer2",
    "gun": "fiskheroes:deathstroke_dceu_gun",
    "ammo_bag": "fiskheroes:deathstroke_dceu_ammo_bag",
    "web_small": "cdh:web/urban_warrior_web",
	"web_large": "cdh:web/urban_warrior_web_24",
	"web_rope": "cdh:web/urban_warrior_rope",
	"web_rope_base": "cdh:web/urban_warrior_web",
    "web_wings": "cdh:urban_warrior_wings"
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
}

function initEffects(renderer) {
    var webs = renderer.bindProperty("fiskheroes:webs");
	webs.textureSmall.set("web_small");
	webs.textureLarge.set("web_large");
	webs.textureRope.set("web_rope");
	webs.textureRopeBase.set("web_rope_base");

    web_wings = renderer.createEffect("fiskheroes:wingsuit");
    web_wings.texture.set("web_wings");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        web_wings.unfold = entity.getInterpolatedData("fiskheroes:wing_animation_timer");
        web_wings.render();
    }
}