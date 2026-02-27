import type { SkillDefinition } from '../runtime-api';

import skill000 from './001-pound';
import skill001 from './002-karate-chop';
import skill002 from './003-double-slap';
import skill003 from './004-comet-punch';
import skill004 from './005-mega-punch';
import skill005 from './006-pay-day';
import skill006 from './007-fire-punch';
import skill007 from './008-ice-punch';
import skill008 from './009-thunder-punch';
import skill009 from './010-scratch';
import skill010 from './012-guillotine';
import skill011 from './013-razor-wind';
import skill012 from './014-swords-dance';
import skill013 from './015-cut';
import skill014 from './016-gust';
import skill015 from './017-wing-attack';
import skill016 from './018-whirlwind';
import skill017 from './019-fly';
import skill018 from './020-bind';
import skill019 from './021-slam';
import skill020 from './022-vine-whip';
import skill021 from './023-stomp';
import skill022 from './024-double-kick';
import skill023 from './025-mega-kick';
import skill024 from './026-jump-kick';
import skill025 from './027-rolling-kick';
import skill026 from './028-sand-attack';
import skill027 from './029-headbutt';
import skill028 from './030-horn-attack';
import skill029 from './031-fury-attack';
import skill030 from './032-horn-drill';
import skill031 from './033-tackle';
import skill032 from './034-body-slam';
import skill033 from './035-wrap';
import skill034 from './036-take-down';
import skill035 from './037-thrash';
import skill036 from './038-double-edge';
import skill037 from './039-tail-whip';
import skill038 from './040-poison-sting';
import skill039 from './041-twineedle';
import skill040 from './042-pin-missile';
import skill041 from './043-leer';
import skill042 from './044-bite';
import skill043 from './045-growl';
import skill044 from './046-roar';
import skill045 from './047-sing';
import skill046 from './048-supersonic';
import skill047 from './049-sonic-boom';
import skill048 from './050-disable';
import skill049 from './051-acid';
import skill050 from './052-ember';
import skill051 from './053-flamethrower';
import skill052 from './054-mist';
import skill053 from './055-water-gun';
import skill054 from './056-hydro-pump';
import skill055 from './057-surf';
import skill056 from './058-ice-beam';
import skill057 from './059-blizzard';
import skill058 from './060-psybeam';
import skill059 from './061-bubble-beam';
import skill060 from './062-aurora-beam';
import skill061 from './063-hyper-beam';
import skill062 from './064-peck';
import skill063 from './065-drill-peck';
import skill064 from './066-submission';
import skill065 from './067-low-kick';
import skill066 from './068-counter';
import skill067 from './069-seismic-toss';
import skill068 from './070-strength';
import skill069 from './071-absorb';
import skill070 from './072-mega-drain';
import skill071 from './073-leech-seed';
import skill072 from './074-growth';
import skill073 from './075-razor-leaf';
import skill074 from './076-solar-beam';
import skill075 from './077-poison-powder';
import skill076 from './078-stun-spore';
import skill077 from './079-sleep-powder';
import skill078 from './080-petal-dance';
import skill079 from './081-string-shot';
import skill080 from './082-dragon-rage';
import skill081 from './083-fire-spin';
import skill082 from './084-thunder-shock';
import skill083 from './085-thunderbolt';
import skill084 from './086-thunder-wave';
import skill085 from './087-thunder';
import skill086 from './088-rock-throw';
import skill087 from './089-earthquake';
import skill088 from './090-fissure';
import skill089 from './091-dig';
import skill090 from './092-toxic';
import skill091 from './093-confusion';
import skill092 from './094-psychic';
import skill093 from './095-hypnosis';
import skill094 from './096-meditate';
import skill095 from './097-agility';
import skill096 from './098-quick-attack';
import skill097 from './099-rage';
import skill098 from './100-teleport';
import skill099 from './101-night-shade';
import skill100 from './102-mimic';
import skill101 from './103-screech';
import skill102 from './104-double-team';
import skill103 from './105-recover';
import skill104 from './106-harden';
import skill105 from './107-minimize';
import skill106 from './108-smokescreen';
import skill107 from './109-confuse-ray';
import skill108 from './110-withdraw';
import skill109 from './111-defense-curl';
import skill110 from './112-barrier';
import skill111 from './113-light-screen';
import skill112 from './114-haze';
import skill113 from './115-reflect';
import skill114 from './116-focus-energy';
import skill115 from './117-bide';
import skill116 from './118-metronome';
import skill117 from './119-mirror-move';
import skill118 from './120-self-destruct';
import skill119 from './121-egg-bomb';
import skill120 from './122-lick';
import skill121 from './123-smog';
import skill122 from './124-sludge';
import skill123 from './125-bone-club';
import skill124 from './126-fire-blast';
import skill125 from './127-waterfall';
import skill126 from './128-clamp';
import skill127 from './129-swift';
import skill128 from './130-skull-bash';
import skill129 from './131-spike-cannon';
import skill130 from './132-constrict';
import skill131 from './133-amnesia';
import skill132 from './134-kinesis';
import skill133 from './135-soft-boiled';
import skill134 from './136-high-jump-kick';
import skill135 from './137-glare';
import skill136 from './138-dream-eater';
import skill137 from './139-poison-gas';
import skill138 from './140-barrage';
import skill139 from './141-leech-life';
import skill140 from './142-lovely-kiss';
import skill141 from './143-sky-attack';
import skill142 from './144-transform';
import skill143 from './145-bubble';
import skill144 from './146-dizzy-punch';
import skill145 from './147-spore';
import skill146 from './148-flash';
import skill147 from './149-psywave';
import skill148 from './150-splash';
import skill149 from './151-acid-armor';
import skill150 from './152-crabhammer';
import skill151 from './153-explosion';
import skill152 from './154-fury-swipes';
import skill153 from './155-bonemerang';
import skill154 from './156-rest';
import skill155 from './157-rock-slide';
import skill156 from './158-hyper-fang';
import skill157 from './159-sharpen';
import skill158 from './160-conversion';
import skill159 from './161-tri-attack';
import skill160 from './162-super-fang';
import skill161 from './163-slash';
import skill162 from './164-substitute';
import skill163 from './165-struggle';
import skill164 from './166-sketch';
import skill165 from './167-triple-kick';
import skill166 from './168-thief';
import skill167 from './169-spider-web';
import skill168 from './170-mind-reader';
import skill169 from './171-nightmare';
import skill170 from './172-flame-wheel';
import skill171 from './173-snore';
import skill172 from './174-curse';
import skill173 from './175-flail';
import skill174 from './176-conversion-2';
import skill175 from './177-aeroblast';
import skill176 from './178-cotton-spore';
import skill177 from './179-reversal';
import skill178 from './180-spite';
import skill179 from './181-powder-snow';
import skill180 from './182-protect';
import skill181 from './183-mach-punch';
import skill182 from './184-scary-face';
import skill183 from './185-feint-attack';
import skill184 from './186-sweet-kiss';
import skill185 from './187-belly-drum';
import skill186 from './188-sludge-bomb';
import skill187 from './189-mud-slap';
import skill188 from './190-octazooka';
import skill189 from './191-spikes';
import skill190 from './192-zap-cannon';
import skill191 from './193-foresight';
import skill192 from './194-destiny-bond';
import skill193 from './195-perish-song';
import skill194 from './196-icy-wind';
import skill195 from './197-detect';
import skill196 from './198-bone-rush';
import skill197 from './199-lock-on';
import skill198 from './200-outrage';
import skill199 from './201-sandstorm';
import skill200 from './202-giga-drain';
import skill201 from './203-endure';
import skill202 from './204-charm';
import skill203 from './205-rollout';
import skill204 from './206-false-swipe';
import skill205 from './207-swagger';
import skill206 from './208-milk-drink';
import skill207 from './209-spark';
import skill208 from './210-fury-cutter';
import skill209 from './211-steel-wing';
import skill210 from './212-mean-look';
import skill211 from './213-attract';
import skill212 from './214-sleep-talk';
import skill213 from './215-heal-bell';
import skill214 from './216-return';
import skill215 from './217-present';
import skill216 from './218-frustration';
import skill217 from './219-safeguard';
import skill218 from './220-pain-split';
import skill219 from './221-sacred-fire';
import skill220 from './222-magnitude';
import skill221 from './223-dynamic-punch';
import skill222 from './224-megahorn';
import skill223 from './225-dragon-breath';
import skill224 from './226-baton-pass';
import skill225 from './227-encore';
import skill226 from './228-pursuit';
import skill227 from './229-rapid-spin';
import skill228 from './230-sweet-scent';
import skill229 from './231-iron-tail';
import skill230 from './232-metal-claw';
import skill231 from './233-vital-throw';
import skill232 from './234-morning-sun';
import skill233 from './235-synthesis';
import skill234 from './236-moonlight';
import skill235 from './237-hidden-power';
import skill236 from './238-cross-chop';
import skill237 from './239-twister';
import skill238 from './240-rain-dance';
import skill239 from './241-sunny-day';
import skill240 from './242-crunch';
import skill241 from './243-mirror-coat';
import skill242 from './244-psych-up';
import skill243 from './245-extreme-speed';
import skill244 from './246-ancient-power';
import skill245 from './247-shadow-ball';
import skill246 from './248-future-sight';
import skill247 from './249-rock-smash';
import skill248 from './250-whirlpool';
import skill249 from './251-beat-up';
import skill250 from './252-fake-out';
import skill251 from './253-uproar';
import skill252 from './254-stockpile';
import skill253 from './255-spit-up';
import skill254 from './256-swallow';
import skill255 from './257-heat-wave';
import skill256 from './258-hail';
import skill257 from './259-torment';
import skill258 from './260-flatter';
import skill259 from './261-will-o-wisp';
import skill260 from './262-memento';
import skill261 from './263-facade';
import skill262 from './264-focus-punch';
import skill263 from './265-smelling-salts';
import skill264 from './266-follow-me';
import skill265 from './267-nature-power';
import skill266 from './268-charge';
import skill267 from './269-taunt';
import skill268 from './270-helping-hand';
import skill269 from './271-trick';
import skill270 from './272-role-play';
import skill271 from './273-wish';
import skill272 from './274-assist';
import skill273 from './275-ingrain';
import skill274 from './276-superpower';
import skill275 from './277-magic-coat';
import skill276 from './278-recycle';
import skill277 from './279-revenge';
import skill278 from './280-brick-break';
import skill279 from './281-yawn';
import skill280 from './282-knock-off';
import skill281 from './283-endeavor';
import skill282 from './284-eruption';
import skill283 from './285-skill-swap';
import skill284 from './286-imprison';
import skill285 from './287-refresh';
import skill286 from './288-grudge';
import skill287 from './289-snatch';
import skill288 from './290-secret-power';
import skill289 from './291-dive';
import skill290 from './292-arm-thrust';
import skill291 from './293-camouflage';
import skill292 from './294-tail-glow';
import skill293 from './295-luster-purge';
import skill294 from './296-mist-ball';
import skill295 from './297-feather-dance';
import skill296 from './298-teeter-dance';
import skill297 from './299-blaze-kick';
import skill298 from './300-mud-sport';
import skill299 from './301-ice-ball';
import skill300 from './302-needle-arm';
import skill301 from './303-slack-off';
import skill302 from './304-hyper-voice';
import skill303 from './305-poison-fang';
import skill304 from './306-crush-claw';
import skill305 from './307-blast-burn';
import skill306 from './308-hydro-cannon';
import skill307 from './309-meteor-mash';
import skill308 from './310-astonish';
import skill309 from './311-weather-ball';
import skill310 from './312-aromatherapy';
import skill311 from './313-fake-tears';
import skill312 from './314-air-cutter';
import skill313 from './315-overheat';
import skill314 from './316-odor-sleuth';
import skill315 from './317-rock-tomb';
import skill316 from './318-silver-wind';
import skill317 from './319-metal-sound';
import skill318 from './320-grass-whistle';
import skill319 from './321-tickle';
import skill320 from './322-cosmic-power';
import skill321 from './323-water-spout';
import skill322 from './324-signal-beam';
import skill323 from './325-shadow-punch';
import skill324 from './326-extrasensory';
import skill325 from './327-sky-uppercut';
import skill326 from './328-sand-tomb';
import skill327 from './329-sheer-cold';
import skill328 from './330-muddy-water';
import skill329 from './331-bullet-seed';
import skill330 from './332-aerial-ace';
import skill331 from './333-icicle-spear';
import skill332 from './334-iron-defense';
import skill333 from './335-block';
import skill334 from './336-howl';
import skill335 from './337-dragon-claw';
import skill336 from './338-frenzy-plant';
import skill337 from './339-bulk-up';
import skill338 from './340-bounce';
import skill339 from './341-mud-shot';
import skill340 from './342-poison-tail';
import skill341 from './343-covet';
import skill342 from './344-volt-tackle';
import skill343 from './345-magical-leaf';
import skill344 from './346-water-sport';
import skill345 from './347-calm-mind';
import skill346 from './348-leaf-blade';
import skill347 from './349-dragon-dance';
import skill348 from './350-rock-blast';
import skill349 from './351-shock-wave';
import skill350 from './352-water-pulse';
import skill351 from './353-doom-desire';
import skill352 from './354-psycho-boost';
import skill353 from './355-roost';
import skill354 from './356-gravity';
import skill355 from './357-miracle-eye';
import skill356 from './358-wake-up-slap';
import skill357 from './359-hammer-arm';
import skill358 from './360-gyro-ball';
import skill359 from './361-healing-wish';
import skill360 from './362-brine';
import skill361 from './363-natural-gift';
import skill362 from './364-feint';
import skill363 from './365-pluck';
import skill364 from './366-tailwind';
import skill365 from './367-acupressure';
import skill366 from './368-metal-burst';
import skill367 from './369-u-turn';
import skill368 from './370-close-combat';
import skill369 from './371-payback';
import skill370 from './372-assurance';
import skill371 from './373-embargo';
import skill372 from './374-fling';
import skill373 from './375-psycho-shift';
import skill374 from './376-trump-card';
import skill375 from './377-heal-block';
import skill376 from './378-wring-out';
import skill377 from './379-power-trick';
import skill378 from './380-gastro-acid';
import skill379 from './381-lucky-chant';
import skill380 from './382-me-first';
import skill381 from './383-copycat';
import skill382 from './384-power-swap';
import skill383 from './385-guard-swap';
import skill384 from './386-punishment';
import skill385 from './387-last-resort';
import skill386 from './388-worry-seed';
import skill387 from './389-sucker-punch';
import skill388 from './390-toxic-spikes';
import skill389 from './391-heart-swap';
import skill390 from './392-aqua-ring';
import skill391 from './393-magnet-rise';
import skill392 from './394-flare-blitz';
import skill393 from './395-force-palm';
import skill394 from './396-aura-sphere';
import skill395 from './397-rock-polish';
import skill396 from './398-poison-jab';
import skill397 from './399-dark-pulse';
import skill398 from './400-night-slash';
import skill399 from './401-aqua-tail';
import skill400 from './402-seed-bomb';
import skill401 from './403-air-slash';
import skill402 from './404-x-scissor';
import skill403 from './405-bug-buzz';
import skill404 from './406-dragon-pulse';
import skill405 from './407-dragon-rush';
import skill406 from './408-power-gem';
import skill407 from './409-drain-punch';
import skill408 from './410-vacuum-wave';
import skill409 from './411-focus-blast';
import skill410 from './412-energy-ball';
import skill411 from './413-brave-bird';
import skill412 from './414-earth-power';
import skill413 from './415-switcheroo';
import skill414 from './416-giga-impact';
import skill415 from './417-nasty-plot';
import skill416 from './418-bullet-punch';
import skill417 from './419-avalanche';
import skill418 from './420-ice-shard';
import skill419 from './421-shadow-claw';
import skill420 from './422-thunder-fang';
import skill421 from './423-ice-fang';
import skill422 from './424-fire-fang';
import skill423 from './425-shadow-sneak';
import skill424 from './426-mud-bomb';
import skill425 from './427-psycho-cut';
import skill426 from './428-zen-headbutt';
import skill427 from './429-mirror-shot';
import skill428 from './430-flash-cannon';
import skill429 from './431-rock-climb';
import skill430 from './432-defog';
import skill431 from './433-trick-room';
import skill432 from './434-draco-meteor';
import skill433 from './435-discharge';
import skill434 from './436-lava-plume';
import skill435 from './437-leaf-storm';
import skill436 from './438-power-whip';
import skill437 from './439-rock-wrecker';
import skill438 from './440-cross-poison';
import skill439 from './441-gunk-shot';
import skill440 from './442-iron-head';
import skill441 from './443-magnet-bomb';
import skill442 from './444-stone-edge';
import skill443 from './445-captivate';
import skill444 from './446-stealth-rock';
import skill445 from './447-grass-knot';
import skill446 from './448-chatter';
import skill447 from './449-judgment';
import skill448 from './450-bug-bite';
import skill449 from './451-charge-beam';
import skill450 from './452-wood-hammer';
import skill451 from './453-aqua-jet';
import skill452 from './454-attack-order';
import skill453 from './455-defend-order';
import skill454 from './456-heal-order';
import skill455 from './457-head-smash';
import skill456 from './458-double-hit';
import skill457 from './459-roar-of-time';
import skill458 from './460-spacial-rend';
import skill459 from './461-lunar-dance';
import skill460 from './462-crush-grip';
import skill461 from './463-magma-storm';
import skill462 from './464-dark-void';
import skill463 from './465-seed-flare';
import skill464 from './466-ominous-wind';
import skill465 from './467-shadow-force';
import skill466 from './468-hone-claws';
import skill467 from './469-wide-guard';
import skill468 from './470-guard-split';
import skill469 from './471-power-split';
import skill470 from './472-wonder-room';
import skill471 from './473-psyshock';
import skill472 from './474-venoshock';
import skill473 from './475-autotomize';
import skill474 from './476-rage-powder';
import skill475 from './477-telekinesis';
import skill476 from './478-magic-room';
import skill477 from './479-smack-down';
import skill478 from './480-storm-throw';
import skill479 from './481-flame-burst';
import skill480 from './482-sludge-wave';
import skill481 from './483-quiver-dance';
import skill482 from './484-heavy-slam';
import skill483 from './485-synchronoise';
import skill484 from './486-electro-ball';
import skill485 from './487-soak';
import skill486 from './488-flame-charge';
import skill487 from './489-coil';
import skill488 from './490-low-sweep';
import skill489 from './491-acid-spray';
import skill490 from './492-foul-play';
import skill491 from './493-simple-beam';
import skill492 from './494-entrainment';
import skill493 from './495-after-you';
import skill494 from './496-round';
import skill495 from './497-echoed-voice';
import skill496 from './498-chip-away';
import skill497 from './499-clear-smog';
import skill498 from './500-stored-power';
import skill499 from './501-quick-guard';
import skill500 from './502-ally-switch';
import skill501 from './503-scald';
import skill502 from './504-shell-smash';
import skill503 from './505-heal-pulse';
import skill504 from './506-hex';
import skill505 from './507-sky-drop';
import skill506 from './508-shift-gear';
import skill507 from './509-circle-throw';
import skill508 from './510-incinerate';
import skill509 from './511-quash';
import skill510 from './512-acrobatics';
import skill511 from './513-reflect-type';
import skill512 from './514-retaliate';
import skill513 from './515-final-gambit';
import skill514 from './516-bestow';
import skill515 from './517-inferno';
import skill516 from './518-water-pledge';
import skill517 from './519-fire-pledge';
import skill518 from './520-grass-pledge';
import skill519 from './521-volt-switch';
import skill520 from './522-struggle-bug';
import skill521 from './523-bulldoze';
import skill522 from './524-frost-breath';
import skill523 from './525-dragon-tail';
import skill524 from './526-work-up';
import skill525 from './527-electroweb';
import skill526 from './528-wild-charge';
import skill527 from './529-drill-run';
import skill528 from './530-dual-chop';
import skill529 from './531-heart-stamp';
import skill530 from './532-horn-leech';
import skill531 from './533-sacred-sword';
import skill532 from './534-razor-shell';
import skill533 from './535-heat-crash';
import skill534 from './536-leaf-tornado';
import skill535 from './537-steamroller';
import skill536 from './538-cotton-guard';
import skill537 from './539-night-daze';
import skill538 from './540-psystrike';
import skill539 from './541-tail-slap';
import skill540 from './542-hurricane';
import skill541 from './543-head-charge';
import skill542 from './544-gear-grind';
import skill543 from './545-searing-shot';
import skill544 from './546-techno-blast';
import skill545 from './547-relic-song';
import skill546 from './548-secret-sword';
import skill547 from './549-glaciate';
import skill548 from './550-bolt-strike';
import skill549 from './551-blue-flare';
import skill550 from './552-fiery-dance';
import skill551 from './553-freeze-shock';
import skill552 from './554-ice-burn';
import skill553 from './555-snarl';
import skill554 from './556-icicle-crash';
import skill555 from './557-v-create';
import skill556 from './558-fusion-flare';
import skill557 from './559-fusion-bolt';
import skill558 from './560-flying-press';
import skill559 from './561-mat-block';
import skill560 from './562-belch';
import skill561 from './563-rototiller';
import skill562 from './564-sticky-web';
import skill563 from './565-fell-stinger';
import skill564 from './566-phantom-force';
import skill565 from './567-trick-or-treat';
import skill566 from './568-noble-roar';
import skill567 from './569-ion-deluge';
import skill568 from './570-parabolic-charge';
import skill569 from './572-petal-blizzard';
import skill570 from './573-freeze-dry';
import skill571 from './574-disarming-voice';
import skill572 from './575-parting-shot';
import skill573 from './576-topsy-turvy';
import skill574 from './577-draining-kiss';
import skill575 from './578-crafty-shield';
import skill576 from './579-flower-shield';
import skill577 from './580-grassy-terrain';
import skill578 from './581-misty-terrain';
import skill579 from './582-electrify';
import skill580 from './583-play-rough';
import skill581 from './584-fairy-wind';
import skill582 from './585-moonblast';
import skill583 from './586-boomburst';
import skill584 from './587-fairy-lock';
import skill585 from './589-play-nice';
import skill586 from './590-confide';
import skill587 from './591-diamond-storm';
import skill588 from './592-steam-eruption';
import skill589 from './593-hyperspace-hole';
import skill590 from './594-water-shuriken';
import skill591 from './595-mystical-fire';
import skill592 from './596-spiky-shield';
import skill593 from './597-aromatic-mist';
import skill594 from './598-eerie-impulse';
import skill595 from './599-venom-drench';
import skill596 from './600-powder';
import skill597 from './601-geomancy';
import skill598 from './602-magnetic-flux';
import skill599 from './603-happy-hour';
import skill600 from './604-electric-terrain';
import skill601 from './605-dazzling-gleam';
import skill602 from './606-celebrate';
import skill603 from './607-hold-hands';
import skill604 from './608-baby-doll-eyes';
import skill605 from './609-nuzzle';
import skill606 from './610-hold-back';
import skill607 from './611-infestation';
import skill608 from './612-power-up-punch';
import skill609 from './613-oblivion-wing';
import skill610 from './614-thousand-arrows';
import skill611 from './615-thousand-waves';
import skill612 from './617-light-of-ruin';
import skill613 from './618-origin-pulse';
import skill614 from './619-precipice-blades';
import skill615 from './620-dragon-ascent';
import skill616 from './621-hyperspace-fury';
import skill617 from './659-shore-up';
import skill618 from './660-first-impression';
import skill619 from './661-baneful-bunker';
import skill620 from './662-spirit-shackle';
import skill621 from './663-darkest-lariat';
import skill622 from './664-sparkling-aria';
import skill623 from './665-ice-hammer';
import skill624 from './666-floral-healing';
import skill625 from './667-high-horsepower';
import skill626 from './668-strength-sap';
import skill627 from './669-solar-blade';
import skill628 from './670-leafage';
import skill629 from './671-spotlight';
import skill630 from './672-toxic-thread';
import skill631 from './673-laser-focus';
import skill632 from './674-gear-up';
import skill633 from './675-throat-chop';
import skill634 from './676-pollen-puff';
import skill635 from './677-anchor-shot';
import skill636 from './678-psychic-terrain';
import skill637 from './679-lunge';
import skill638 from './680-fire-lash';
import skill639 from './681-power-trip';
import skill640 from './682-burn-up';
import skill641 from './683-speed-swap';
import skill642 from './684-smart-strike';
import skill643 from './685-purify';
import skill644 from './686-revelation-dance';
import skill645 from './687-core-enforcer';
import skill646 from './688-trop-kick';
import skill647 from './689-instruct';
import skill648 from './690-beak-blast';
import skill649 from './691-clanging-scales';
import skill650 from './692-dragon-hammer';
import skill651 from './693-brutal-swing';
import skill652 from './694-aurora-veil';
import skill653 from './704-shell-trap';
import skill654 from './705-fleur-cannon';
import skill655 from './706-psychic-fangs';
import skill656 from './707-stomping-tantrum';
import skill657 from './708-shadow-bone';
import skill658 from './709-accelerock';
import skill659 from './710-liquidation';
import skill660 from './711-prismatic-laser';
import skill661 from './712-spectral-thief';
import skill662 from './713-sunsteel-strike';
import skill663 from './714-moongeist-beam';
import skill664 from './715-tearful-look';
import skill665 from './716-zing-zap';
import skill666 from './718-multi-attack';
import skill667 from './742-double-iron-bash';
import skill668 from './744-dynamax-cannon';
import skill669 from './745-snipe-shot';
import skill670 from './746-jaw-lock';
import skill671 from './747-stuff-cheeks';
import skill672 from './748-no-retreat';
import skill673 from './749-tar-shot';
import skill674 from './750-magic-powder';
import skill675 from './751-dragon-darts';
import skill676 from './752-teatime';
import skill677 from './753-octolock';
import skill678 from './754-bolt-beak';
import skill679 from './755-fishious-rend';
import skill680 from './756-court-change';
import skill681 from './775-clangorous-soul';
import skill682 from './776-body-press';
import skill683 from './777-decorate';
import skill684 from './778-drum-beating';
import skill685 from './779-snap-trap';
import skill686 from './780-pyro-ball';
import skill687 from './781-behemoth-blade';
import skill688 from './782-behemoth-bash';
import skill689 from './783-aura-wheel';
import skill690 from './784-breaking-swipe';
import skill691 from './785-branch-poke';
import skill692 from './786-overdrive';
import skill693 from './787-apple-acid';
import skill694 from './788-grav-apple';
import skill695 from './789-spirit-break';
import skill696 from './790-strange-steam';
import skill697 from './791-life-dew';
import skill698 from './792-obstruct';
import skill699 from './793-false-surrender';
import skill700 from './794-meteor-assault';
import skill701 from './796-steel-beam';

export const generatedSkills: SkillDefinition[] = [
  { id: '001', name: '막치기', handler: skill000 },
  { id: '002', name: '태권당수', handler: skill001 },
  { id: '003', name: '연속뺨치기', handler: skill002 },
  { id: '004', name: '연속펀치', handler: skill003 },
  { id: '005', name: '메가톤펀치', handler: skill004 },
  { id: '006', name: '고양이돈받기', handler: skill005 },
  { id: '007', name: '불꽃펀치', handler: skill006 },
  { id: '008', name: '냉동펀치', handler: skill007 },
  { id: '009', name: '번개펀치', handler: skill008 },
  { id: '010', name: '할퀴기', handler: skill009 },
  { id: '012', name: '가위자르기', handler: skill010 },
  { id: '013', name: '칼바람', handler: skill011 },
  { id: '014', name: '칼춤', handler: skill012 },
  { id: '015', name: '풀베기', handler: skill013 },
  { id: '016', name: '바람일으키기', handler: skill014 },
  { id: '017', name: '날개치기', handler: skill015 },
  { id: '018', name: '날려버리기', handler: skill016 },
  { id: '019', name: '공중날기', handler: skill017 },
  { id: '020', name: '조이기', handler: skill018 },
  { id: '021', name: '힘껏치기', handler: skill019 },
  { id: '022', name: '덩굴채찍', handler: skill020 },
  { id: '023', name: '짓밟기', handler: skill021 },
  { id: '024', name: '두번치기', handler: skill022 },
  { id: '025', name: '메가톤킥', handler: skill023 },
  { id: '026', name: '점프킥', handler: skill024 },
  { id: '027', name: '돌려차기', handler: skill025 },
  { id: '028', name: '모래뿌리기', handler: skill026 },
  { id: '029', name: '박치기', handler: skill027 },
  { id: '030', name: '뿔찌르기', handler: skill028 },
  { id: '031', name: '마구찌르기', handler: skill029 },
  { id: '032', name: '뿔드릴', handler: skill030 },
  { id: '033', name: '몸통박치기', handler: skill031 },
  { id: '034', name: '누르기', handler: skill032 },
  { id: '035', name: '김밥말이', handler: skill033 },
  { id: '036', name: '돌진', handler: skill034 },
  { id: '037', name: '난동부리기', handler: skill035 },
  { id: '038', name: '이판사판태클', handler: skill036 },
  { id: '039', name: '꼬리흔들기', handler: skill037 },
  { id: '040', name: '독침', handler: skill038 },
  { id: '041', name: '더블니들', handler: skill039 },
  { id: '042', name: '바늘미사일', handler: skill040 },
  { id: '043', name: '째려보기', handler: skill041 },
  { id: '044', name: '물기', handler: skill042 },
  { id: '045', name: '울음소리', handler: skill043 },
  { id: '046', name: '울부짖기', handler: skill044 },
  { id: '047', name: '노래하기', handler: skill045 },
  { id: '048', name: '초음파', handler: skill046 },
  { id: '049', name: '소닉붐', handler: skill047 },
  { id: '050', name: '사슬묶기', handler: skill048 },
  { id: '051', name: '용해액', handler: skill049 },
  { id: '052', name: '불꽃세례', handler: skill050 },
  { id: '053', name: '화염방사', handler: skill051 },
  { id: '054', name: '흰안개', handler: skill052 },
  { id: '055', name: '물대포', handler: skill053 },
  { id: '056', name: '하이드로펌프', handler: skill054 },
  { id: '057', name: '파도타기', handler: skill055 },
  { id: '058', name: '냉동빔', handler: skill056 },
  { id: '059', name: '눈보라', handler: skill057 },
  { id: '060', name: '환상빔', handler: skill058 },
  { id: '061', name: '거품광선', handler: skill059 },
  { id: '062', name: '오로라빔', handler: skill060 },
  { id: '063', name: '파괴광선', handler: skill061 },
  { id: '064', name: '쪼기', handler: skill062 },
  { id: '065', name: '회전부리', handler: skill063 },
  { id: '066', name: '지옥의바퀴', handler: skill064 },
  { id: '067', name: '안다리걸기', handler: skill065 },
  { id: '068', name: '카운터', handler: skill066 },
  { id: '069', name: '지구던지기', handler: skill067 },
  { id: '070', name: '괴력', handler: skill068 },
  { id: '071', name: '흡수', handler: skill069 },
  { id: '072', name: '메가드레인', handler: skill070 },
  { id: '073', name: '씨뿌리기', handler: skill071 },
  { id: '074', name: '성장', handler: skill072 },
  { id: '075', name: '잎날가르기', handler: skill073 },
  { id: '076', name: '솔라빔', handler: skill074 },
  { id: '077', name: '독가루', handler: skill075 },
  { id: '078', name: '저리가루', handler: skill076 },
  { id: '079', name: '수면가루', handler: skill077 },
  { id: '080', name: '꽃잎댄스', handler: skill078 },
  { id: '081', name: '실뿜기', handler: skill079 },
  { id: '082', name: '용의분노', handler: skill080 },
  { id: '083', name: '회오리불꽃', handler: skill081 },
  { id: '084', name: '전기쇼크', handler: skill082 },
  { id: '085', name: '10만볼트', handler: skill083 },
  { id: '086', name: '전기자석파', handler: skill084 },
  { id: '087', name: '번개', handler: skill085 },
  { id: '088', name: '돌떨구기', handler: skill086 },
  { id: '089', name: '지진', handler: skill087 },
  { id: '090', name: '땅가르기', handler: skill088 },
  { id: '091', name: '구멍파기', handler: skill089 },
  { id: '092', name: '맹독', handler: skill090 },
  { id: '093', name: '염동력', handler: skill091 },
  { id: '094', name: '사이코키네시스', handler: skill092 },
  { id: '095', name: '최면술', handler: skill093 },
  { id: '096', name: '요가포즈', handler: skill094 },
  { id: '097', name: '고속이동', handler: skill095 },
  { id: '098', name: '전광석화', handler: skill096 },
  { id: '099', name: '분노', handler: skill097 },
  { id: '100', name: '순간이동', handler: skill098 },
  { id: '101', name: '나이트헤드', handler: skill099 },
  { id: '102', name: '흉내내기', handler: skill100 },
  { id: '103', name: '싫은소리', handler: skill101 },
  { id: '104', name: '그림자분신', handler: skill102 },
  { id: '105', name: 'HP회복', handler: skill103 },
  { id: '106', name: '단단해지기', handler: skill104 },
  { id: '107', name: '작아지기', handler: skill105 },
  { id: '108', name: '연막', handler: skill106 },
  { id: '109', name: '이상한빛', handler: skill107 },
  { id: '110', name: '껍질에숨기', handler: skill108 },
  { id: '111', name: '웅크리기', handler: skill109 },
  { id: '112', name: '배리어', handler: skill110 },
  { id: '113', name: '빛의장막', handler: skill111 },
  { id: '114', name: '흑안개', handler: skill112 },
  { id: '115', name: '리플렉터', handler: skill113 },
  { id: '116', name: '기충전', handler: skill114 },
  { id: '117', name: '참기', handler: skill115 },
  { id: '118', name: '손가락흔들기', handler: skill116 },
  { id: '119', name: '따라하기', handler: skill117 },
  { id: '120', name: '자폭', handler: skill118 },
  { id: '121', name: '알폭탄', handler: skill119 },
  { id: '122', name: '핥기', handler: skill120 },
  { id: '123', name: '스모그', handler: skill121 },
  { id: '124', name: '오물공격', handler: skill122 },
  { id: '125', name: '뼈다귀치기', handler: skill123 },
  { id: '126', name: '불대문자', handler: skill124 },
  { id: '127', name: '폭포오르기', handler: skill125 },
  { id: '128', name: '껍질끼우기', handler: skill126 },
  { id: '129', name: '스피드스타', handler: skill127 },
  { id: '130', name: '로케트박치기', handler: skill128 },
  { id: '131', name: '가시대포', handler: skill129 },
  { id: '132', name: '휘감기', handler: skill130 },
  { id: '133', name: '망각술', handler: skill131 },
  { id: '134', name: '숟가락휘기', handler: skill132 },
  { id: '135', name: '알낳기', handler: skill133 },
  { id: '136', name: '무릎차기', handler: skill134 },
  { id: '137', name: '뱀눈초리', handler: skill135 },
  { id: '138', name: '꿈먹기', handler: skill136 },
  { id: '139', name: '독가스', handler: skill137 },
  { id: '140', name: '구슬던지기', handler: skill138 },
  { id: '141', name: '흡혈', handler: skill139 },
  { id: '142', name: '악마의키스', handler: skill140 },
  { id: '143', name: '불새', handler: skill141 },
  { id: '144', name: '변신', handler: skill142 },
  { id: '145', name: '거품', handler: skill143 },
  { id: '146', name: '잼잼펀치', handler: skill144 },
  { id: '147', name: '버섯포자', handler: skill145 },
  { id: '148', name: '플래시', handler: skill146 },
  { id: '149', name: '사이코웨이브', handler: skill147 },
  { id: '150', name: '튀어오르기', handler: skill148 },
  { id: '151', name: '녹기', handler: skill149 },
  { id: '152', name: '찝게햄머', handler: skill150 },
  { id: '153', name: '대폭발', handler: skill151 },
  { id: '154', name: '마구할퀴기', handler: skill152 },
  { id: '155', name: '뼈다귀부메랑', handler: skill153 },
  { id: '156', name: '잠자기', handler: skill154 },
  { id: '157', name: '스톤샤워', handler: skill155 },
  { id: '158', name: '필살앞니', handler: skill156 },
  { id: '159', name: '각지기', handler: skill157 },
  { id: '160', name: '텍스처', handler: skill158 },
  { id: '161', name: '트라이어택', handler: skill159 },
  { id: '162', name: '분노의앞니', handler: skill160 },
  { id: '163', name: '베어가르기', handler: skill161 },
  { id: '164', name: '대타출동', handler: skill162 },
  { id: '165', name: '발버둥', handler: skill163 },
  { id: '166', name: '스케치', handler: skill164 },
  { id: '167', name: '트리플킥', handler: skill165 },
  { id: '168', name: '도둑질', handler: skill166 },
  { id: '169', name: '거미집', handler: skill167 },
  { id: '170', name: '마음의눈', handler: skill168 },
  { id: '171', name: '악몽', handler: skill169 },
  { id: '172', name: '화염자동차', handler: skill170 },
  { id: '173', name: '코골기', handler: skill171 },
  { id: '174', name: '저주', handler: skill172 },
  { id: '175', name: '바둥바둥', handler: skill173 },
  { id: '176', name: '텍스처2', handler: skill174 },
  { id: '177', name: '에어로블라스트', handler: skill175 },
  { id: '178', name: '목화포자', handler: skill176 },
  { id: '179', name: '기사회생', handler: skill177 },
  { id: '180', name: '원한', handler: skill178 },
  { id: '181', name: '눈싸라기', handler: skill179 },
  { id: '182', name: '방어', handler: skill180 },
  { id: '183', name: '마하펀치', handler: skill181 },
  { id: '184', name: '겁나는얼굴', handler: skill182 },
  { id: '185', name: '속여때리기', handler: skill183 },
  { id: '186', name: '천사의키스', handler: skill184 },
  { id: '187', name: '배북', handler: skill185 },
  { id: '188', name: '오물폭탄', handler: skill186 },
  { id: '189', name: '진흙뿌리기', handler: skill187 },
  { id: '190', name: '대포무노포', handler: skill188 },
  { id: '191', name: '압정뿌리기', handler: skill189 },
  { id: '192', name: '전자포', handler: skill190 },
  { id: '193', name: '꿰뚫어보기', handler: skill191 },
  { id: '194', name: '길동무', handler: skill192 },
  { id: '195', name: '멸망의노래', handler: skill193 },
  { id: '196', name: '얼다바람', handler: skill194 },
  { id: '197', name: '판별', handler: skill195 },
  { id: '198', name: '본러쉬', handler: skill196 },
  { id: '199', name: '록온', handler: skill197 },
  { id: '200', name: '역린', handler: skill198 },
  { id: '201', name: '모래바람', handler: skill199 },
  { id: '202', name: '기가드레인', handler: skill200 },
  { id: '203', name: '버티기', handler: skill201 },
  { id: '204', name: '애교부리기', handler: skill202 },
  { id: '205', name: '구르기', handler: skill203 },
  { id: '206', name: '칼등치기', handler: skill204 },
  { id: '207', name: '뽐내기', handler: skill205 },
  { id: '208', name: '우유마시기', handler: skill206 },
  { id: '209', name: '스파크', handler: skill207 },
  { id: '210', name: '연속자르기', handler: skill208 },
  { id: '211', name: '강철날개', handler: skill209 },
  { id: '212', name: '검은눈빛', handler: skill210 },
  { id: '213', name: '헤롱헤롱', handler: skill211 },
  { id: '214', name: '잠꼬대', handler: skill212 },
  { id: '215', name: '치료방울', handler: skill213 },
  { id: '216', name: '은혜갚기', handler: skill214 },
  { id: '217', name: '프레젠트', handler: skill215 },
  { id: '218', name: '화풀이', handler: skill216 },
  { id: '219', name: '신비의부적', handler: skill217 },
  { id: '220', name: '아픔나누기', handler: skill218 },
  { id: '221', name: '성스러운불꽃', handler: skill219 },
  { id: '222', name: '매그니튜드', handler: skill220 },
  { id: '223', name: '폭발펀치', handler: skill221 },
  { id: '224', name: '메가폰', handler: skill222 },
  { id: '225', name: '용의숨결', handler: skill223 },
  { id: '226', name: '바톤터치', handler: skill224 },
  { id: '227', name: '앵콜', handler: skill225 },
  { id: '228', name: '따라가때리기', handler: skill226 },
  { id: '229', name: '고속스핀', handler: skill227 },
  { id: '230', name: '달콤한향기', handler: skill228 },
  { id: '231', name: '아이언테일', handler: skill229 },
  { id: '232', name: '메탈크로우', handler: skill230 },
  { id: '233', name: '받아던지기', handler: skill231 },
  { id: '234', name: '아침햇살', handler: skill232 },
  { id: '235', name: '광합성', handler: skill233 },
  { id: '236', name: '달의불빛', handler: skill234 },
  { id: '237', name: '잠재파워', handler: skill235 },
  { id: '238', name: '크로스촙', handler: skill236 },
  { id: '239', name: '회오리', handler: skill237 },
  { id: '240', name: '비바라기', handler: skill238 },
  { id: '241', name: '쾌청', handler: skill239 },
  { id: '242', name: '깨물어부수기', handler: skill240 },
  { id: '243', name: '미러코트', handler: skill241 },
  { id: '244', name: '자기암시', handler: skill242 },
  { id: '245', name: '신속', handler: skill243 },
  { id: '246', name: '원시의힘', handler: skill244 },
  { id: '247', name: '섀도볼', handler: skill245 },
  { id: '248', name: '미래예지', handler: skill246 },
  { id: '249', name: '바위깨기', handler: skill247 },
  { id: '250', name: '바다회오리', handler: skill248 },
  { id: '251', name: '집단구타', handler: skill249 },
  { id: '252', name: '속이다', handler: skill250 },
  { id: '253', name: '소란피기', handler: skill251 },
  { id: '254', name: '비축하기', handler: skill252 },
  { id: '255', name: '토해내기', handler: skill253 },
  { id: '256', name: '꿀꺽', handler: skill254 },
  { id: '257', name: '열풍', handler: skill255 },
  { id: '258', name: '싸라기눈', handler: skill256 },
  { id: '259', name: '트집', handler: skill257 },
  { id: '260', name: '부추기기', handler: skill258 },
  { id: '261', name: '도깨비불', handler: skill259 },
  { id: '262', name: '추억의선물', handler: skill260 },
  { id: '263', name: '객기', handler: skill261 },
  { id: '264', name: '힘껏펀치', handler: skill262 },
  { id: '265', name: '정신차리기', handler: skill263 },
  { id: '266', name: '날따름', handler: skill264 },
  { id: '267', name: '자연의힘', handler: skill265 },
  { id: '268', name: '충전', handler: skill266 },
  { id: '269', name: '도발', handler: skill267 },
  { id: '270', name: '도우미', handler: skill268 },
  { id: '271', name: '트릭', handler: skill269 },
  { id: '272', name: '역할', handler: skill270 },
  { id: '273', name: '희망사항', handler: skill271 },
  { id: '274', name: '조수', handler: skill272 },
  { id: '275', name: '뿌리박기', handler: skill273 },
  { id: '276', name: '엄청난힘', handler: skill274 },
  { id: '277', name: '매직코트', handler: skill275 },
  { id: '278', name: '리사이클', handler: skill276 },
  { id: '279', name: '리벤지', handler: skill277 },
  { id: '280', name: '깨트리다', handler: skill278 },
  { id: '281', name: '하품', handler: skill279 },
  { id: '282', name: '탁쳐서떨구기', handler: skill280 },
  { id: '283', name: '죽기살기', handler: skill281 },
  { id: '284', name: '분화', handler: skill282 },
  { id: '285', name: '스킬스웹', handler: skill283 },
  { id: '286', name: '봉인', handler: skill284 },
  { id: '287', name: '리프레쉬', handler: skill285 },
  { id: '288', name: '원념', handler: skill286 },
  { id: '289', name: '가로챔', handler: skill287 },
  { id: '290', name: '비밀의힘', handler: skill288 },
  { id: '291', name: '다이빙', handler: skill289 },
  { id: '292', name: '손바닥치기', handler: skill290 },
  { id: '293', name: '보호색', handler: skill291 },
  { id: '294', name: '반딧불', handler: skill292 },
  { id: '295', name: '라스트버지', handler: skill293 },
  { id: '296', name: '미스트볼', handler: skill294 },
  { id: '297', name: '깃털댄스', handler: skill295 },
  { id: '298', name: '흔들흔들댄스', handler: skill296 },
  { id: '299', name: '브레이즈킥', handler: skill297 },
  { id: '300', name: '흙놀이', handler: skill298 },
  { id: '301', name: '아이스볼', handler: skill299 },
  { id: '302', name: '바늘팔', handler: skill300 },
  { id: '303', name: '태만함', handler: skill301 },
  { id: '304', name: '하이퍼보이스', handler: skill302 },
  { id: '305', name: '독엄니', handler: skill303 },
  { id: '306', name: '브레이크크루', handler: skill304 },
  { id: '307', name: '블러스트번', handler: skill305 },
  { id: '308', name: '하이드로캐논', handler: skill306 },
  { id: '309', name: '코멧펀치', handler: skill307 },
  { id: '310', name: '놀래키기', handler: skill308 },
  { id: '311', name: '웨더볼', handler: skill309 },
  { id: '312', name: '아로마테라피', handler: skill310 },
  { id: '313', name: '거짓울음', handler: skill311 },
  { id: '314', name: '에어컷터', handler: skill312 },
  { id: '315', name: '오버히트', handler: skill313 },
  { id: '316', name: '냄새구별', handler: skill314 },
  { id: '317', name: '암석봉인', handler: skill315 },
  { id: '318', name: '은빛바람', handler: skill316 },
  { id: '319', name: '금속음', handler: skill317 },
  { id: '320', name: '풀피리', handler: skill318 },
  { id: '321', name: '간지르기', handler: skill319 },
  { id: '322', name: '코스믹파워', handler: skill320 },
  { id: '323', name: '해수스파우팅', handler: skill321 },
  { id: '324', name: '시그널빔', handler: skill322 },
  { id: '325', name: '섀도펀치', handler: skill323 },
  { id: '326', name: '신통력', handler: skill324 },
  { id: '327', name: '스카이업퍼', handler: skill325 },
  { id: '328', name: '모래지옥', handler: skill326 },
  { id: '329', name: '절대영도', handler: skill327 },
  { id: '330', name: '탁류', handler: skill328 },
  { id: '331', name: '기관총', handler: skill329 },
  { id: '332', name: '제비반환', handler: skill330 },
  { id: '333', name: '고드름침', handler: skill331 },
  { id: '334', name: '철벽', handler: skill332 },
  { id: '335', name: '블록', handler: skill333 },
  { id: '336', name: '멀리짖음', handler: skill334 },
  { id: '337', name: '드래곤크루', handler: skill335 },
  { id: '338', name: '하드플랜트', handler: skill336 },
  { id: '339', name: '벌크업', handler: skill337 },
  { id: '340', name: '뛰어오르다', handler: skill338 },
  { id: '341', name: '머드숏', handler: skill339 },
  { id: '342', name: '포이즌테일', handler: skill340 },
  { id: '343', name: '탐내다', handler: skill341 },
  { id: '344', name: '볼트태클', handler: skill342 },
  { id: '345', name: '메지컬리프', handler: skill343 },
  { id: '346', name: '물놀이', handler: skill344 },
  { id: '347', name: '명상', handler: skill345 },
  { id: '348', name: '리프블레이드', handler: skill346 },
  { id: '349', name: '용의춤', handler: skill347 },
  { id: '350', name: '락블레스트', handler: skill348 },
  { id: '351', name: '전격파', handler: skill349 },
  { id: '352', name: '물의파동', handler: skill350 },
  { id: '353', name: '파멸의소원', handler: skill351 },
  { id: '354', name: '사이코부스트', handler: skill352 },
  { id: '355', name: '날개쉬기', handler: skill353 },
  { id: '356', name: '중력', handler: skill354 },
  { id: '357', name: '미라클아이', handler: skill355 },
  { id: '358', name: '잠깨움뺨치기', handler: skill356 },
  { id: '359', name: '암해머', handler: skill357 },
  { id: '360', name: '자이로볼', handler: skill358 },
  { id: '361', name: '치유소원', handler: skill359 },
  { id: '362', name: '소금물', handler: skill360 },
  { id: '363', name: '자연의은혜', handler: skill361 },
  { id: '364', name: '페인트', handler: skill362 },
  { id: '365', name: '쪼아대기', handler: skill363 },
  { id: '366', name: '순풍', handler: skill364 },
  { id: '367', name: '경혈찌르기', handler: skill365 },
  { id: '368', name: '메탈버스트', handler: skill366 },
  { id: '369', name: '유턴', handler: skill367 },
  { id: '370', name: '인파이트', handler: skill368 },
  { id: '371', name: '보복', handler: skill369 },
  { id: '372', name: '승부굳히기', handler: skill370 },
  { id: '373', name: '금제', handler: skill371 },
  { id: '374', name: '내던지기', handler: skill372 },
  { id: '375', name: '사이코시프트', handler: skill373 },
  { id: '376', name: '마지막수단', handler: skill374 },
  { id: '377', name: '회복봉인', handler: skill375 },
  { id: '378', name: '쥐어짜기', handler: skill376 },
  { id: '379', name: '파워트릭', handler: skill377 },
  { id: '380', name: '위액', handler: skill378 },
  { id: '381', name: '주술', handler: skill379 },
  { id: '382', name: '선취', handler: skill380 },
  { id: '383', name: '흉내쟁이', handler: skill381 },
  { id: '384', name: '파워스웹', handler: skill382 },
  { id: '385', name: '가드스웹', handler: skill383 },
  { id: '386', name: '혼내기', handler: skill384 },
  { id: '387', name: '뒀다쓰기', handler: skill385 },
  { id: '388', name: '고민씨', handler: skill386 },
  { id: '389', name: '기습', handler: skill387 },
  { id: '390', name: '독압정', handler: skill388 },
  { id: '391', name: '하트스웹', handler: skill389 },
  { id: '392', name: '아쿠아링', handler: skill390 },
  { id: '393', name: '전자부유', handler: skill391 },
  { id: '394', name: '플레어드라이브', handler: skill392 },
  { id: '395', name: '발경', handler: skill393 },
  { id: '396', name: '파동탄', handler: skill394 },
  { id: '397', name: '록커트', handler: skill395 },
  { id: '398', name: '독찌르기', handler: skill396 },
  { id: '399', name: '악의파동', handler: skill397 },
  { id: '400', name: '깜짝베기', handler: skill398 },
  { id: '401', name: '아쿠아테일', handler: skill399 },
  { id: '402', name: '씨폭탄', handler: skill400 },
  { id: '403', name: '에어슬래시', handler: skill401 },
  { id: '404', name: '시저크로스', handler: skill402 },
  { id: '405', name: '벌레의야단법석', handler: skill403 },
  { id: '406', name: '용의파동', handler: skill404 },
  { id: '407', name: '드래곤다이브', handler: skill405 },
  { id: '408', name: '파워젬', handler: skill406 },
  { id: '409', name: '드레인펀치', handler: skill407 },
  { id: '410', name: '진공파', handler: skill408 },
  { id: '411', name: '기합구슬', handler: skill409 },
  { id: '412', name: '에너지볼', handler: skill410 },
  { id: '413', name: '브레이브버드', handler: skill411 },
  { id: '414', name: '대지의힘', handler: skill412 },
  { id: '415', name: '바꿔치기', handler: skill413 },
  { id: '416', name: '기가임팩트', handler: skill414 },
  { id: '417', name: '나쁜음모', handler: skill415 },
  { id: '418', name: '불릿펀치', handler: skill416 },
  { id: '419', name: '눈사태', handler: skill417 },
  { id: '420', name: '얼음뭉치', handler: skill418 },
  { id: '421', name: '섀도크루', handler: skill419 },
  { id: '422', name: '번개엄니', handler: skill420 },
  { id: '423', name: '얼음엄니', handler: skill421 },
  { id: '424', name: '불꽃엄니', handler: skill422 },
  { id: '425', name: '야습', handler: skill423 },
  { id: '426', name: '진흙폭탄', handler: skill424 },
  { id: '427', name: '사이코커터', handler: skill425 },
  { id: '428', name: '사념의박치기', handler: skill426 },
  { id: '429', name: '미러숏', handler: skill427 },
  { id: '430', name: '러스터캐논', handler: skill428 },
  { id: '431', name: '락클라임', handler: skill429 },
  { id: '432', name: '안개제거', handler: skill430 },
  { id: '433', name: '트릭룸', handler: skill431 },
  { id: '434', name: '용성군', handler: skill432 },
  { id: '435', name: '방전', handler: skill433 },
  { id: '436', name: '분연', handler: skill434 },
  { id: '437', name: '리프스톰', handler: skill435 },
  { id: '438', name: '파워휩', handler: skill436 },
  { id: '439', name: '암석포', handler: skill437 },
  { id: '440', name: '크로스포이즌', handler: skill438 },
  { id: '441', name: '더스트슈트', handler: skill439 },
  { id: '442', name: '아이언헤드', handler: skill440 },
  { id: '443', name: '마그넷봄', handler: skill441 },
  { id: '444', name: '스톤에지', handler: skill442 },
  { id: '445', name: '유혹', handler: skill443 },
  { id: '446', name: '스텔스록', handler: skill444 },
  { id: '447', name: '풀묶기', handler: skill445 },
  { id: '448', name: '수다', handler: skill446 },
  { id: '449', name: '심판의뭉치', handler: skill447 },
  { id: '450', name: '벌레먹음', handler: skill448 },
  { id: '451', name: '차지빔', handler: skill449 },
  { id: '452', name: '우드해머', handler: skill450 },
  { id: '453', name: '아쿠아제트', handler: skill451 },
  { id: '454', name: '공격지령', handler: skill452 },
  { id: '455', name: '방어지령', handler: skill453 },
  { id: '456', name: '회복지령', handler: skill454 },
  { id: '457', name: '양날박치기', handler: skill455 },
  { id: '458', name: '더블어택', handler: skill456 },
  { id: '459', name: '시간의포효', handler: skill457 },
  { id: '460', name: '공간절단', handler: skill458 },
  { id: '461', name: '초승달춤', handler: skill459 },
  { id: '462', name: '묵사발', handler: skill460 },
  { id: '463', name: '마그마스톰', handler: skill461 },
  { id: '464', name: '다크홀', handler: skill462 },
  { id: '465', name: '시드플레어', handler: skill463 },
  { id: '466', name: '괴상한바람', handler: skill464 },
  { id: '467', name: '섀도다이브', handler: skill465 },
  { id: '468', name: '손톱갈기', handler: skill466 },
  { id: '469', name: '와이드가드', handler: skill467 },
  { id: '470', name: '가드셰어', handler: skill468 },
  { id: '471', name: '파워셰어', handler: skill469 },
  { id: '472', name: '원더룸', handler: skill470 },
  { id: '473', name: '사이코쇼크', handler: skill471 },
  { id: '474', name: '베놈쇼크', handler: skill472 },
  { id: '475', name: '바디퍼지', handler: skill473 },
  { id: '476', name: '분노가루', handler: skill474 },
  { id: '477', name: '텔레키네시스', handler: skill475 },
  { id: '478', name: '매직룸', handler: skill476 },
  { id: '479', name: '떨어뜨리기', handler: skill477 },
  { id: '480', name: '업어후리기', handler: skill478 },
  { id: '481', name: '불꽃튀기기', handler: skill479 },
  { id: '482', name: '오물웨이브', handler: skill480 },
  { id: '483', name: '나비춤', handler: skill481 },
  { id: '484', name: '헤비봄버', handler: skill482 },
  { id: '485', name: '싱크로노이즈', handler: skill483 },
  { id: '486', name: '일렉트릭볼', handler: skill484 },
  { id: '487', name: '물붓기', handler: skill485 },
  { id: '488', name: '니트로차지', handler: skill486 },
  { id: '489', name: '똬리틀기', handler: skill487 },
  { id: '490', name: '로킥', handler: skill488 },
  { id: '491', name: '애시드봄', handler: skill489 },
  { id: '492', name: '속임수', handler: skill490 },
  { id: '493', name: '심플빔', handler: skill491 },
  { id: '494', name: '동료만들기', handler: skill492 },
  { id: '495', name: '당신먼저', handler: skill493 },
  { id: '496', name: '돌림노래', handler: skill494 },
  { id: '497', name: '에코보이스', handler: skill495 },
  { id: '498', name: '야금야금', handler: skill496 },
  { id: '499', name: '클리어스모그', handler: skill497 },
  { id: '500', name: '어시스트파워', handler: skill498 },
  { id: '501', name: '퍼스트가드', handler: skill499 },
  { id: '502', name: '사이드체인지', handler: skill500 },
  { id: '503', name: '열탕', handler: skill501 },
  { id: '504', name: '껍질깨기', handler: skill502 },
  { id: '505', name: '치유파동', handler: skill503 },
  { id: '506', name: '병상첨병', handler: skill504 },
  { id: '507', name: '프리폴', handler: skill505 },
  { id: '508', name: '기어체인지', handler: skill506 },
  { id: '509', name: '배대뒤치기', handler: skill507 },
  { id: '510', name: '불태우기', handler: skill508 },
  { id: '511', name: '순서미루기', handler: skill509 },
  { id: '512', name: '애크러뱃', handler: skill510 },
  { id: '513', name: '미러타입', handler: skill511 },
  { id: '514', name: '원수갚기', handler: skill512 },
  { id: '515', name: '목숨걸기', handler: skill513 },
  { id: '516', name: '기프트패스', handler: skill514 },
  { id: '517', name: '연옥', handler: skill515 },
  { id: '518', name: '물의맹세', handler: skill516 },
  { id: '519', name: '불꽃의맹세', handler: skill517 },
  { id: '520', name: '풀의맹세', handler: skill518 },
  { id: '521', name: '볼트체인지', handler: skill519 },
  { id: '522', name: '벌레의저항', handler: skill520 },
  { id: '523', name: '땅고르기', handler: skill521 },
  { id: '524', name: '얼음숨결', handler: skill522 },
  { id: '525', name: '드래곤테일', handler: skill523 },
  { id: '526', name: '분발', handler: skill524 },
  { id: '527', name: '일렉트릭네트', handler: skill525 },
  { id: '528', name: '와일드볼트', handler: skill526 },
  { id: '529', name: '드릴라이너', handler: skill527 },
  { id: '530', name: '더블촙', handler: skill528 },
  { id: '531', name: '하트스탬프', handler: skill529 },
  { id: '532', name: '우드호른', handler: skill530 },
  { id: '533', name: '성스러운칼', handler: skill531 },
  { id: '534', name: '셸블레이드', handler: skill532 },
  { id: '535', name: '히트스탬프', handler: skill533 },
  { id: '536', name: '그래스믹서', handler: skill534 },
  { id: '537', name: '하드롤러', handler: skill535 },
  { id: '538', name: '코튼가드', handler: skill536 },
  { id: '539', name: '나이트버스트', handler: skill537 },
  { id: '540', name: '사이코브레이크', handler: skill538 },
  { id: '541', name: '스위프뺨치기', handler: skill539 },
  { id: '542', name: '폭풍', handler: skill540 },
  { id: '543', name: '아프로브레이크', handler: skill541 },
  { id: '544', name: '기어소서', handler: skill542 },
  { id: '545', name: '화염탄', handler: skill543 },
  { id: '546', name: '테크노버스터', handler: skill544 },
  { id: '547', name: '옛노래', handler: skill545 },
  { id: '548', name: '신비의칼', handler: skill546 },
  { id: '549', name: '얼다세계', handler: skill547 },
  { id: '550', name: '뇌격', handler: skill548 },
  { id: '551', name: '푸른불꽃', handler: skill549 },
  { id: '552', name: '불꽃춤', handler: skill550 },
  { id: '553', name: '프리즈볼트', handler: skill551 },
  { id: '554', name: '콜드플레어', handler: skill552 },
  { id: '555', name: '바크아웃', handler: skill553 },
  { id: '556', name: '고드름떨구기', handler: skill554 },
  { id: '557', name: 'V제너레이트', handler: skill555 },
  { id: '558', name: '크로스플레임', handler: skill556 },
  { id: '559', name: '크로스썬더', handler: skill557 },
  { id: '560', name: '플라잉프레스', handler: skill558 },
  { id: '561', name: '마룻바닥세워막기', handler: skill559 },
  { id: '562', name: '트림', handler: skill560 },
  { id: '563', name: '일구기', handler: skill561 },
  { id: '564', name: '끈적끈적네트', handler: skill562 },
  { id: '565', name: '마지막일침', handler: skill563 },
  { id: '566', name: '고스트다이브', handler: skill564 },
  { id: '567', name: '핼러윈', handler: skill565 },
  { id: '568', name: '부르짖기', handler: skill566 },
  { id: '569', name: '플라스마샤워', handler: skill567 },
  { id: '570', name: '파라볼라차지', handler: skill568 },
  { id: '572', name: '꽃보라', handler: skill569 },
  { id: '573', name: '프리즈드라이', handler: skill570 },
  { id: '574', name: '차밍보이스', handler: skill571 },
  { id: '575', name: '막말내뱉기', handler: skill572 },
  { id: '576', name: '뒤집어엎기', handler: skill573 },
  { id: '577', name: '드레인키스', handler: skill574 },
  { id: '578', name: '트릭가드', handler: skill575 },
  { id: '579', name: '플라워가드', handler: skill576 },
  { id: '580', name: '그래스필드', handler: skill577 },
  { id: '581', name: '미스트필드', handler: skill578 },
  { id: '582', name: '송전', handler: skill579 },
  { id: '583', name: '치근거리기', handler: skill580 },
  { id: '584', name: '요정의바람', handler: skill581 },
  { id: '585', name: '문포스', handler: skill582 },
  { id: '586', name: '폭음파', handler: skill583 },
  { id: '587', name: '페어리록', handler: skill584 },
  { id: '589', name: '친해지기', handler: skill585 },
  { id: '590', name: '비밀이야기', handler: skill586 },
  { id: '591', name: '다이아스톰', handler: skill587 },
  { id: '592', name: '스팀버스트', handler: skill588 },
  { id: '593', name: '다른차원홀', handler: skill589 },
  { id: '594', name: '물수리검', handler: skill590 },
  { id: '595', name: '매지컬플레임', handler: skill591 },
  { id: '596', name: '니들가드', handler: skill592 },
  { id: '597', name: '아로마미스트', handler: skill593 },
  { id: '598', name: '괴전파', handler: skill594 },
  { id: '599', name: '베놈트랩', handler: skill595 },
  { id: '600', name: '분진', handler: skill596 },
  { id: '601', name: '지오컨트롤', handler: skill597 },
  { id: '602', name: '자기장조작', handler: skill598 },
  { id: '603', name: '해피타임', handler: skill599 },
  { id: '604', name: '일렉트릭필드', handler: skill600 },
  { id: '605', name: '매지컬샤인', handler: skill601 },
  { id: '606', name: '축하', handler: skill602 },
  { id: '607', name: '손에손잡기', handler: skill603 },
  { id: '608', name: '초롱초롱눈동자', handler: skill604 },
  { id: '609', name: '볼부비부비', handler: skill605 },
  { id: '610', name: '적당히손봐주기', handler: skill606 },
  { id: '611', name: '엉겨붙기', handler: skill607 },
  { id: '612', name: '그로우펀치', handler: skill608 },
  { id: '613', name: '데스윙', handler: skill609 },
  { id: '614', name: '사우전드애로', handler: skill610 },
  { id: '615', name: '사우전드웨이브', handler: skill611 },
  { id: '617', name: '파멸의빛', handler: skill612 },
  { id: '618', name: '근원의파동', handler: skill613 },
  { id: '619', name: '단애의칼', handler: skill614 },
  { id: '620', name: '화룡점정', handler: skill615 },
  { id: '621', name: '다른차원러시', handler: skill616 },
  { id: '659', name: '모래모으기', handler: skill617 },
  { id: '660', name: '만나자마자', handler: skill618 },
  { id: '661', name: '토치카', handler: skill619 },
  { id: '662', name: '그림자꿰메기', handler: skill620 },
  { id: '663', name: 'DD래리어트', handler: skill621 },
  { id: '664', name: '물거품아리아', handler: skill622 },
  { id: '665', name: '아이스해머', handler: skill623 },
  { id: '666', name: '플라워힐', handler: skill624 },
  { id: '667', name: '10만마력', handler: skill625 },
  { id: '668', name: '힘흡수', handler: skill626 },
  { id: '669', name: '솔라블레이드', handler: skill627 },
  { id: '670', name: '나뭇잎', handler: skill628 },
  { id: '671', name: '스포트라이트', handler: skill629 },
  { id: '672', name: '독실', handler: skill630 },
  { id: '673', name: '예민해지기', handler: skill631 },
  { id: '674', name: '어시스트기어', handler: skill632 },
  { id: '675', name: '지옥찌르기', handler: skill633 },
  { id: '676', name: '꽃가루경단', handler: skill634 },
  { id: '677', name: '앵커숏', handler: skill635 },
  { id: '678', name: '사이코필드', handler: skill636 },
  { id: '679', name: '덤벼들기', handler: skill637 },
  { id: '680', name: '불꽃채찍', handler: skill638 },
  { id: '681', name: '기어오르기', handler: skill639 },
  { id: '682', name: '불사르기', handler: skill640 },
  { id: '683', name: '스피드스웹', handler: skill641 },
  { id: '684', name: '스마트호른', handler: skill642 },
  { id: '685', name: '정화', handler: skill643 },
  { id: '686', name: '잠재댄스', handler: skill644 },
  { id: '687', name: '코어퍼니셔', handler: skill645 },
  { id: '688', name: '트로피컬킥', handler: skill646 },
  { id: '689', name: '지휘', handler: skill647 },
  { id: '690', name: '부리캐논', handler: skill648 },
  { id: '691', name: '스케일노이즈', handler: skill649 },
  { id: '692', name: '드래곤해머', handler: skill650 },
  { id: '693', name: '세차게휘두르기', handler: skill651 },
  { id: '694', name: '오로라베일', handler: skill652 },
  { id: '704', name: '트랩셸', handler: skill653 },
  { id: '705', name: '플뢰르캐논', handler: skill654 },
  { id: '706', name: '사이코팽', handler: skill655 },
  { id: '707', name: '분함의발구르기', handler: skill656 },
  { id: '708', name: '섀도본', handler: skill657 },
  { id: '709', name: '엑셀록', handler: skill658 },
  { id: '710', name: '아쿠아브레이크', handler: skill659 },
  { id: '711', name: '프리즘레이저', handler: skill660 },
  { id: '712', name: '섀도스틸', handler: skill661 },
  { id: '713', name: '메테오드라이브', handler: skill662 },
  { id: '714', name: '섀도레이', handler: skill663 },
  { id: '715', name: '눈물그렁그렁', handler: skill664 },
  { id: '716', name: '찌리리따끔따끔', handler: skill665 },
  { id: '718', name: '멀티어택', handler: skill666 },
  { id: '742', name: '더블펀처', handler: skill667 },
  { id: '744', name: '다이맥스포', handler: skill668 },
  { id: '745', name: '노려맞히기', handler: skill669 },
  { id: '746', name: '물고버티기', handler: skill670 },
  { id: '747', name: '볼가득넣기', handler: skill671 },
  { id: '748', name: '배수의진', handler: skill672 },
  { id: '749', name: '타르숏', handler: skill673 },
  { id: '750', name: '마법가루', handler: skill674 },
  { id: '751', name: '드래곤애로', handler: skill675 },
  { id: '752', name: '다과회', handler: skill676 },
  { id: '753', name: '문어굳히기', handler: skill677 },
  { id: '754', name: '전격부리', handler: skill678 },
  { id: '755', name: '아가미물기', handler: skill679 },
  { id: '756', name: '코트체인지', handler: skill680 },
  { id: '775', name: '소울비트', handler: skill681 },
  { id: '776', name: '바디프레스', handler: skill682 },
  { id: '777', name: '데코레이션', handler: skill683 },
  { id: '778', name: '드럼어택', handler: skill684 },
  { id: '779', name: '집게덫', handler: skill685 },
  { id: '780', name: '화염볼', handler: skill686 },
  { id: '781', name: '거수참', handler: skill687 },
  { id: '782', name: '거수탄', handler: skill688 },
  { id: '783', name: '오라휠', handler: skill689 },
  { id: '784', name: '와이드브레이커', handler: skill690 },
  { id: '785', name: '가지찌르기', handler: skill691 },
  { id: '786', name: '오버드라이브', handler: skill692 },
  { id: '787', name: '사과산', handler: skill693 },
  { id: '788', name: 'G의힘', handler: skill694 },
  { id: '789', name: '소울크래시', handler: skill695 },
  { id: '790', name: '원더스팀', handler: skill696 },
  { id: '791', name: '생명의물방울', handler: skill697 },
  { id: '792', name: '블로킹', handler: skill698 },
  { id: '793', name: '사죄의찌르기', handler: skill699 },
  { id: '794', name: '스타어설트', handler: skill700 },
  { id: '796', name: '철제광선', handler: skill701 },
];

export const findGeneratedSkill = (name: string) => generatedSkills.find((skill) => skill.name === name) ?? null;
export const findGeneratedSkillById = (id: string) => generatedSkills.find((skill) => skill.id === id) ?? null;