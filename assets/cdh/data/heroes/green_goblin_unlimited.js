var super_boost = implement("fiskheroes:external/super_boost_with_cooldown");
var falcon_base = implement("fiskheroes:external/falcon_base");

function init(hero) {
    hero.setName("Green Goblin");
    hero.setVersion("Unlimited");
    hero.setTier(4);

    hero.setHelmet("item.superhero_armor.piece.goggles");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("fiskheroes:exo7_flightpack");
    hero.addAttribute("PUNCH_DAMAGE", 5.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 4.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.1, 1);
    hero.addAttribute("IMPACT_DAMAGE", 0.3, 1);

    hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("SHIELD", "key.wingShield", 1);
    hero.addKeyBind("GUN_RELOAD", "key.reload", 1);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasPermission((entity, permission) => permission == "USE_GUN");
    hero.supplyFunction("canAim", canAim);

    super_boost = super_boost.create(200, 150, 20);
    falcon_base.init(hero, super_boost, 2, 0.25, (entity, manager) => {
        if (entity.getData("fiskheroes:shield")) {
            manager.setData(entity, "fiskheroes:flying", false);
        }
    });
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:controlled_flight":
        return (entity.getData("fiskheroes:flight_timer") > 0 || !entity.getData("fiskheroes:shield")) && super_boost.isModifierEnabled(entity, modifier);
    case "fiskheroes:shield":
        return !(entity.isSprinting() && entity.getData("fiskheroes:flying"));
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "SHIELD":
        return entity.getHeldItem().isEmpty() && !(entity.isSprinting() && entity.getData("fiskheroes:flying"));
    case "GUN_RELOAD":
        return entity.getHeldItem().isGun() && !entity.getData("fiskheroes:aiming") && !(entity.isSprinting() && entity.getData("fiskheroes:flying"));
    default:
        return super_boost.isKeyBindEnabled(entity, keyBind);
    }
}

function canAim(entity) {
    return entity.getHeldItem().isGun() && !(entity.isSprinting() && entity.getData("fiskheroes:flying"));
}