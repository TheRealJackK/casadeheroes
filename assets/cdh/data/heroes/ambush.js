function init(hero) {
    hero.setName("Ambush");
    hero.setTier(4);

    hero.setHelmet("Bandana");
    hero.setChestplate("Chestplate");
    hero.setLeggings("Leggings");
    hero.setBoots("Boots");

    hero.addPowers("cdh:ambush_powers");
    hero.addAttribute("PUNCH_DAMAGE", 6.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 4.0, 0);

    hero.addKeyBind("EARTHQUAKE", "key.earthquake", 1);
    hero.addKeyBind("GROUND_SMASH", "key.groundSmash", 2);
    hero.addKeyBind("TELEPORT", "key.teleport", 3);
}