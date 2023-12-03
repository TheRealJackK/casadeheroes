function init(hero) {
    hero.setName("Quantum Continuer");
    hero.setTier(9);

    hero.setHelmet("Helmet");
    hero.setChestplate("Lab Coat");
    hero.setLeggings("Leggings");
    hero.setBoots("Boots");

    hero.addPowers("cdh:continuum");
    hero.addAttribute("PUNCH_DAMAGE", 4.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 3.5, 0);

    hero.addKeyBind("SIZE_MANIPULATION", "key.sizeManipulation", 1);
    hero.addKeyBindFunc("func_GIANT_MODE", giantModeKey, "key.giantMode", 2);
    hero.addKeyBind("TENTACLE_GRAB", "key.tentacleGrab", 3);
    hero.addKeyBind("TENTACLE_STRIKE", "key.tentacleStrike", 4);
    hero.addKeyBind("TENTACLES", "key.tentacles", 5);

    hero.addAttributeProfile("GIANT_MODE", giantProfile);
    hero.setAttributeProfile(getAttributeProfile);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasProperty(hasProperty);
    hero.setTierOverride(getTierOverride);
}

function giantModeKey(player, manager) {
    var flag = player.getData("fiskheroes:dyn/giant_mode");
    manager.setData(player, "fiskheroes:dyn/giant_mode", !flag);
    manager.setData(player, "fiskheroes:size_state", flag ? -1 : 1);
    return true;
}

function getTierOverride(entity) {
    return entity.getData("fiskheroes:dyn/giant_mode") ? 6 : 4;
}

function giantProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 6.0, 0);
    profile.addAttribute("JUMP_HEIGHT", 2.0, 0);
    profile.addAttribute("FALL_RESISTANCE", 4.0, 0);
}

function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:dyn/giant_mode_timer") > 0 ? "GIANT_MODE" : null;
}

function isModifierEnabled(entity, modifier) {
    return modifier.name() != "fiskheroes:size_manipulation" || (modifier.id() == "giant") == (entity.getData("fiskheroes:dyn/giant_mode_timer") > 0 || entity.getData("fiskheroes:dyn/giant_mode"));
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "func_GIANT_MODE":
        return entity.getData("fiskheroes:size_state") == 0 && (entity.getData("fiskheroes:dyn/giant_mode") || entity.getData("fiskheroes:dyn/giant_mode_cooldown") == 0);
    case "SIZE_MANIPULATION":
        return !entity.getData("fiskheroes:dyn/giant_mode");
    default:
        return true;
    }
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}