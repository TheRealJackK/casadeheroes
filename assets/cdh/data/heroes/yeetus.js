var utils = implement("fiskheroes:external/utils");

function init(hero) {
    hero.setName("Yeetus");
    hero.setTier(8);

    hero.setHelmet("Hood");
    hero.setChestplate("Cloak");
    hero.setLeggings("Leggings");
    hero.setBoots("Boots");

    hero.addPowers("cdh:yeetus");
    hero.addAttribute("PUNCH_DAMAGE", 11.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.15, 1);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);

    hero.addKeyBind("SONIC_WAVES", "key.canaryCry", 1);
    hero.addKeyBind("INTANGIBILITY", "key.intangibility", 2);
    hero.addKeyBind("AIM", "key.shadowChain", 3);
    hero.addKeyBind("TELEKINESIS", "key.shadowChain", 3);

    hero.setTickHandler((entity, manager) => {
        utils.flightOnIntangibility(entity, manager);
    });
}