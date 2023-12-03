extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "cdh:quantum_continuer_layer1",
    "layer2": "cdh:quantum_continuer_layer2",
    "segment": "fiskheroes:doctor_octopus_arm",
    "claw": "fiskheroes:doctor_octopus_claw",
    "claw_lights": "fiskheroes:doctor_octopus_claw_lights"
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
}

function initEffects(renderer) {
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
}