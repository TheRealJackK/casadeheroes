function init(hero) {
    hero.setName("Spider-Man");
    hero.setVersion("Unlimited");
    hero.setTier(7);

    hero.setHelmet("Mask");
    hero.setChestplate("Shirt");
    hero.setLeggings("Pants");
    hero.setBoots("Boots");

    hero.addPowers("fiskheroes:spider_physiology", "fiskheroes:web_shooters");
    hero.addAttribute("FALL_RESISTANCE", 13.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 2.5, 0);
    hero.addAttribute("PUNCH_DAMAGE", 7.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.5, 1);
    hero.addAttribute("STEP_HEIGHT", 0.5, 0);
    hero.addAttribute("IMPACT_DAMAGE", 0.5, 1);

    hero.addKeyBind("UTILITY_BELT", "key.webShooters", 1);
    hero.addKeyBind("WEB_ZIP", "key.webZip", 2);
    hero.addKeyBindFunc("func_WEB_SWINGING", webSwingingKey, "key.webSwinging", 3);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotionHold", 4);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
}

function webSwingingKey(player, manager) {
    var flag = player.getData("fiskheroes:web_swinging");

    if (!flag) {
        manager.setDataWithNotify(player, "fiskheroes:prev_utility_belt_type", player.getData("fiskheroes:utility_belt_type"));
        manager.setDataWithNotify(player, "fiskheroes:utility_belt_type", -1);
    }

    manager.setDataWithNotify(player, "fiskheroes:web_swinging", !flag);
    return true;
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:web_swinging":
        return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:utility_belt_type") == -1;
    case "fiskheroes:leaping":
        return modifier.id() == "springboard" == (entity.getData("fiskheroes:ticks_since_swinging") < 5);
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "func_WEB_SWINGING":
        return entity.getHeldItem().isEmpty();
    default:
        return true;
    }
}
