var landing = implement("fiskheroes:external/superhero_landing");

function init(hero) {
    hero.setName("Technodrone");
    hero.setTier(7);

    hero.setHelmet("Helmet");
    hero.setChestplate("Chestplate");
    hero.setLeggings("Leggings");
    hero.setBoots("Boots");

    hero.addPowers("cdh:technodrone_armor");
    hero.addAttribute("PUNCH_DAMAGE", 5.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);

    hero.addKeyBind("AIM", "key.aim", 1);
    hero.addKeyBind("BLADE", "key.blade", 2);
    hero.addKeyBind("SENTRY_MODE", "key.sentryMode", 3);

    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("BLADE", {"types": {"SHARP": 1.0}});

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasProperty(hasProperty);
    hero.supplyFunction("canAim", canAim);

    hero.addSoundEvent("MASK_OPEN", "fiskheroes:iron_man_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:iron_man_mask_close");
    hero.addSoundEvent("AIM_START", "fiskheroes:repulsor_charge");
    hero.addSoundEvent("AIM_STOP", "fiskheroes:repulsor_powerdown");
    hero.addSoundEvent("STEP", "fiskheroes:iron_man_walk");
    hero.addSoundOverrides("MK46", {
        "suit": {
            "MASK_OPEN": "fiskheroes:iron_man_mk46_mask_open",
            "MASK_CLOSE": "fiskheroes:iron_man_mk46_mask_close"
        }
    });

    hero.setTickHandler((entity, manager) => {
        var flying = entity.getData("fiskheroes:flying");
        manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, flying);

        var item = entity.getHeldItem();
        flying &= !entity.as("PLAYER").isUsingItem();
        manager.incrementData(entity, "fiskheroes:dyn/booster_r_timer", 2, flying && item.isEmpty() && !entity.isPunching() && entity.getData("fiskheroes:aiming_timer") == 0);
        manager.incrementData(entity, "fiskheroes:dyn/booster_l_timer", 2, flying && !item.doesNeedTwoHands());

        landing.tick(entity, manager);
    });
}

function isModifierEnabled(entity, modifier) {
    return modifier.name() != "fiskheroes:water_breathing" || !entity.getData("fiskheroes:mask_open");
}

function isKeyBindEnabled(entity, keyBind) {
    if (entity.isSprinting() && entity.getData("fiskheroes:flying")) {
        return false;
    }
    return true;
}

function hasProperty(entity, property) {
    return property == "MASK_TOGGLE" || property == "BREATHE_SPACE" && !entity.getData("fiskheroes:mask_open");
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}

function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 7.0, 0);
}

function getProfile(entity) {
    return entity.getData("fiskheroes:blade") ? "BLADE" : null;
}