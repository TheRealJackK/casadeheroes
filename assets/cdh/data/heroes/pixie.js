var super_boost = implement("fiskheroes:external/super_boost_with_cooldown");
var falcon_base = implement("fiskheroes:external/falcon_base");

function init(hero) {
    hero.setName("Pixie");
    hero.setTier(4);

    hero.setHelmet("Collar");
    hero.setChestplate("Chestplate");
    hero.setLeggings("Leggings");
    hero.setBoots("Boots");

    hero.addPowers("cdh:pixie");
    hero.addAttribute("PUNCH_DAMAGE", 5.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 4.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.1, 1);
    hero.addAttribute("IMPACT_DAMAGE", 0.3, 1);

    hero.addKeyBind("CHARGED_BEAM", "Energy Blast", 1);
    hero.addKeyBind("SHIELD", "key.wingShield", 2);

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