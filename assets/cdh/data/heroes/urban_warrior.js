function init(hero) {
    hero.setName("Urban Warrior");
    hero.setTier(5);

    hero.setHelmet("Visor");
    hero.setChestplate("Plate Carrier");
    hero.setLeggings("Tactical Pants");
    hero.setBoots("Tactical Boots");
    hero.addEquipment("fiskheroes:compound_bow");
    hero.addEquipment("fiskheroes:quiver");

    hero.addPowers("cdh:urban_combat");
    hero.addAttribute("PUNCH_DAMAGE", 6.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 4.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 5.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.15, 1);
    hero.addAttribute("BOW_DRAWBACK", 0.6, 1);

    hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("GUN_RELOAD", "key.reload", 3);
    hero.addKeyBind("HORIZONTAL_BOW", "key.horizontalBow", 1);
    hero.addKeyBind("UTILITY_BELT", "key.grenades", 2);
    
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasPermission((entity, permission) => permission == "USE_GUN");
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
