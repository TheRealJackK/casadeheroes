var speedster_base = implement("fiskheroes:external/speedster_base");

function init(hero) {
    hero.setName("Chad X");
    hero.setTier(5);

    hero.setHelmet("X Mask");
    hero.setChestplate("Shirt & Sweater");
    hero.setLeggings("Slacks")
    hero.setBoots("Loafers")
    hero.addEquipment("fiskheroes:flash_ring");

    hero.addPowers("cdh:chad_force");
    hero.addAttribute("PUNCH_DAMAGE", 5.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 0.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 4.0, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 6.0, 0);

    hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 1);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 2);
    hero.addKeyBind("BLADE", "key.blade", 3);

    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("BLADE", {"types": {"SHARP": 1.0}});

    hero.setHasProperty((entity, property) => property == "MASK_TOGGLE");

    var speedPunch = speedster_base.createSpeedPunch(hero);
    hero.setDamageProfile(entity => speedPunch.get(entity, null));

    hero.addSoundEvent("MASK_OPEN", ["fiskheroes:reverse_flash_vibration_on", "fiskheroes:reverse_flash_vibration_loop"]);
    hero.addSoundOverrides("NEGATIVE", speedster_base.mergeSounds("fiskheroes:speed_force", speedster_base.SOUNDS_NEGATIVE));

    hero.setTickHandler((entity, manager) => {
        speedster_base.tick(entity, manager);
    });
}

function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 8.0, 0);
}

function getProfile(entity) {
    return entity.getData("fiskheroes:blade") ? "BLADE" : null;
}