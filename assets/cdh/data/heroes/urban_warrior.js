function init(hero) {
    hero.setName("Urban Warrior");
    hero.setTier(5);

    hero.setHelmet("Visor");
    hero.setChestplate("Plate Carrier");
    hero.setLeggings("Tactical Pants");
    hero.setBoots("Tactical Boots");
    hero.addPrimaryEquipment("fiskheroes:grappling_gun", true);
    hero.addEquipment("fiskheroes:compound_bow");
    hero.addEquipment("fiskheroes:quiver");

    hero.addPowers("cdh:urban_combat");
    hero.addAttribute("PUNCH_DAMAGE", 6.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 4.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 2.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 10.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.50, 1);
    hero.addAttribute("BOW_DRAWBACK", 1.0, 1.5);

    hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("GUN_RELOAD", "key.reload", 3);
    hero.addKeyBind("HORIZONTAL_BOW", "key.horizontalBow", 1);
    hero.addKeyBind("UTILITY_BELT", "key.grenades", 2);
    hero.addKeyBindFunc("func_WEB_WINGS", webWingsKey, "key.webWings", 5);
    
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasPermission((entity, permission) => permission == "USE_GUN");
    hero.setHasPermission((entity, permission) => permission == "USE_GRAPPLING_GUN");
    hero.supplyFunction("canAim", entity => entity.getHeldItem().isGun());

    function isKeyBindEnabled(entity, keyBind) {
        switch (keyBind) {
        case "GUN_RELOAD":
            return entity.getHeldItem().isGun() && !entity.getData("fiskheroes:aiming");
        case "UTILITY_BELT":
            return !entity.getHeldItem().isGun();
        default:
            return true;
        }
    }
}

function webWingsKey(player, manager) {
    if (player.isOnGround() || player.isInWater()) {
        return false;
    }

    var flag = player.getData("fiskheroes:gliding");

    if (!flag) {
        manager.setDataWithNotify(player, "fiskheroes:prev_utility_belt_type", player.getData("fiskheroes:utility_belt_type"));
        manager.setDataWithNotify(player, "fiskheroes:utility_belt_type", -1);
    }

    manager.setDataWithNotify(player, "fiskheroes:gliding", !flag);
    return true;
}
