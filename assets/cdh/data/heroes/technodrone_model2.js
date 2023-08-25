var landing = implement("fiskheroes:external/superhero_landing");

function init(hero) {
    hero.setName("Technodrone Model 2");
    hero.setTier(8);

    hero.setChestplate("Suit Housing");

    hero.addPowers("cdh:technodrone_nano_armor");
    hero.addAttribute("PUNCH_DAMAGE", 8.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.1, 1);
    hero.addAttribute("JUMP_HEIGHT", 0.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);

    hero.addKeyBind("AIM", "key.crabCannon", 1);
    hero.addKeyBind("BLADE", "key.blade", 2);
    hero.addKeyBind("SHIELD", "key.forcefield", 4);
    hero.addKeyBind("NANITE_TRANSFORM", "key.naniteTransform", 5);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasProperty(hasProperty);
    hero.setTierOverride(getTierOverride);
    hero.supplyFunction("canAim", canAim);

    hero.addAttributeProfile("INACTIVE", inactiveProfile);
    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("BLADE", {
        "types": {
            "SHARP": 1.0,
            "ENERGY": 0.7
        }
    });

    hero.addSoundEvent("MASK_OPEN", "fiskheroes:mk50_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:mk50_mask_close");
    hero.addSoundEvent("AIM_START", ["fiskheroes:mk50_cannon_aim", "fiskheroes:mk50_cannon_static"]);
    hero.addSoundEvent("AIM_STOP", "fiskheroes:mk50_cannon_retract");

    hero.setTickHandler((entity, manager) => {
        var flying = entity.getData("fiskheroes:flying");
        manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, flying);

        var item = entity.getHeldItem();
        flying &= !entity.as("PLAYER").isUsingItem();
        manager.incrementData(entity, "fiskheroes:dyn/booster_r_timer", 2, flying && item.isEmpty() && !entity.isPunching() && entity.getData("fiskheroes:aiming_timer") == 0 && entity.getData("fiskheroes:blade_timer") == 0);
        manager.incrementData(entity, "fiskheroes:dyn/booster_l_timer", 2, flying && !item.doesNeedTwoHands());

        landing.tick(entity, manager);
    });
}

function getTierOverride(entity) {
    return entity.getData("fiskheroes:dyn/nanites") ? entity.getData("fiskheroes:shield_blocking") ? 7 : 8 : 0;
}

function inactiveProfile(profile) {
    profile.revokeAugments();
}

function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 10.5, 0);
    profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
    profile.addAttribute("FALL_RESISTANCE", 9.5, 0);
}

function getProfile(entity) {
    if (!entity.getData("fiskheroes:dyn/nanites")) {
        return "INACTIVE";
    }
    return entity.getData("fiskheroes:blade") ? "BLADE" : null;
}

function isModifierEnabled(entity, modifier) {
    if (modifier.name() != "fiskheroes:transformation" && modifier.name() != "fiskheroes:cooldown" && (!entity.getData("fiskheroes:dyn/nanites") || modifier.name() == "fiskheroes:controlled_flight" && entity.getData("fiskheroes:dyn/nanite_timer") < 1)) {
        return false;
    }

    switch (modifier.name()) {
        case "fiskheroes:energy_bolt":
            return entity.getData("fiskheroes:aimed_timer") >= 1;
        case "fiskheroes:blade":
            return !entity.getData("fiskheroes:aiming") && !entity.getData("fiskheroes:shield") && !(entity.isSprinting() && entity.getData("fiskheroes:flying"));
        case "fiskheroes:regeneration":
            return !entity.getData("fiskheroes:blade");
        case "fiskheroes:water_breathing":
            return !entity.getData("fiskheroes:mask_open") && entity.getData("fiskheroes:dyn/nanites");
        default:
            return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    if (keyBind == "NANITE_TRANSFORM") {
        return entity.getData("fiskheroes:mask_open_timer") == 0;
    }
    else if (!entity.getData("fiskheroes:dyn/nanites")) {
        return false;
    }
    else if (entity.isSprinting() && entity.getData("fiskheroes:flying")) {
        return false;
    }

    switch (keyBind) {
        case "SHIELD":
            return entity.isSneaking() || entity.isBookPlayer();
        case "BLADE":
            return !entity.isSneaking() && !entity.getData("fiskheroes:shield");
        default:
            return true;
    }
}

function hasProperty(entity, property) {
    switch (property) {
        case "MASK_TOGGLE":
            return entity.getData("fiskheroes:dyn/nanite_timer") == 1;
        case "BREATHE_SPACE":
            return !entity.getData("fiskheroes:mask_open") && entity.getData("fiskheroes:dyn/nanites");
        default:
            return false;
    }
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:dyn/nanites") && !entity.getData("fiskheroes:shield");
}