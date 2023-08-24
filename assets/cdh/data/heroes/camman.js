function init(hero) {
    hero.setName("CamMan");
    hero.setTier(5);

    hero.setHelmet("item.superhero_armor.piece.cowl");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("cdh:cam_suit");
    hero.addAttribute("PUNCH_DAMAGE", 4, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 10.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.2, 1);
    hero.addAttribute("IMPACT_DAMAGE", 0.5, 1);

    hero.addKeyBind("UTILITY_BELT", "key.utilityBelt", 1);
    hero.addKeyBind("WEB_ZIP", "key.webZip", 2);
    hero.addKeyBindFunc("func_WEB_SWINGING", webSwingingKey, "key.webSwinging", 3);

}

function webSwingingKey(player, manager) {
    var flag = player.getData("fiskheroes:web_swinging");

    if (!flag) {
        manager.setDataWithNotify(player, "fiskheroes:prev_utility_belt_type", player.getData("fiskheroes:utility_belt_type"));
        manager.setDataWithNotify(player, "fiskheroes:utility_belt_type", -1);
        manager.setDataWithNotify(player, "fiskheroes:gliding", false);
    }

    manager.setDataWithNotify(player, "fiskheroes:web_swinging", !flag);
    return true;
}
