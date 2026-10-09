import { AFTER_DARK, DAYTIME, L, WAKING } from "@/lib/perfect-day/activity-lines";
import type { ActivityLine } from "@/lib/perfect-day/activity-lines";

export const SNOW_DAY_LINES: ActivityLine[] = [
  L("a pot of stew, wool socks, and watching the street go still."),
  L("a second mug of cocoa and a full-length record front to back."),
  L("soup, a board game, and the good blanket."),
  L("rereading a book you love."),
  L("watching snow fall from the kitchen window with the radio on."),
  L("making winter wishes."),
  L("the slowest breakfast you can stretch."),
  L("mending something you’ve been meaning to."),
  L("shoveling a narrow path and going nowhere.", DAYTIME),
  L("baking something that refuses to be rushed.", DAYTIME),
  L("a grocery run only if the bread is gone.", DAYTIME),
  L("bootprints to the mailbox and straight back in.", DAYTIME),
  L("melting cheese on anything and calling it dinner.", AFTER_DARK),
  L("tea and a slow look through old photo albums.", AFTER_DARK),
  L("a candle, a quilt, and no plans after this.", AFTER_DARK),
  L("leftover soup reheated like it is new.", AFTER_DARK),
  L("extra blankets and the hush of a snowed-in street.", ["night"]),
  L("the porch light off so you can watch the flakes.", ["night"]),
  L("writing down a memory before you forget the quiet.", ["night"]),
];

export const HEAVY_RAIN_LINES: ActivityLine[] = [
  L("a pot of tea and a documentary."),
  L("organizing the junk drawer."),
  L("the book that has been looking at you."),
  L("lentil soup and laundry."),
  L("writing a letter to yourself."),
  L("writing a letter you don’t have to send today."),
  L("a crossword you will not finish."),
  L("oil on the cutting board and something that simmers."),
  L("baking sourdough and roasting root vegetables.", DAYTIME),
  L("a hardware-store errand you can do in one dash.", DAYTIME),
  L("the library, because it is dry and quiet.", DAYTIME),
  L("making stock from whatever’s in the fridge.", WAKING),
  L("a puzzle with rain as the soundtrack.", AFTER_DARK),
  L("your favorite takeaway and a movie marathon.", AFTER_DARK),
  L("rain on the roof and no reason to go out.", AFTER_DARK),
  L("socks on the radiator and a second episode.", AFTER_DARK),
  L("tea and going through old photo albums.", ["night"]),
  L("the windows fogged and a list of people to text tomorrow.", ["night"]),
  L("falling asleep to the gutter doing its job.", ["night"]),
];

export const FALLBACK_LINES: ActivityLine[] = [
  L("whatever you’re already doing — the weather will keep you company."),
  L("starting a thing just to do it."),
  L("one small kindness you can finish today."),
  L("putting a record on and staying near it."),
  L("chatting up your favorite local barista.", WAKING, true),
  L("the errand you’ve been postponing, then a treat.", DAYTIME),
  L("a walk around the block and calling it plenty.", DAYTIME),
  L("a window table and no rush.", DAYTIME),
  L("stretching your legs and coming home early.", ["afternoon", "evening"]),
  L("trying something new.", ["evening"]),
  L("cooking something simple.", AFTER_DARK),
  L("the porch if you want it, the couch if you don’t.", AFTER_DARK),
  L("a special beverage and a slow evening in.", AFTER_DARK),
  L("a chapter, then lights down.", AFTER_DARK),
  L("going through old journals.", ["night"]),
  L("tea and a look through old photo albums.", ["night"]),
  L("the quiet house and nothing on a screen.", ["night"]),
  L("naming one thing that went right today.", ["night"]),
];

export const INDOOR_SCENARIO_LINES: Record<string, ActivityLine[]> = {
  "snow-day": SNOW_DAY_LINES,
  "heavy-rain": HEAVY_RAIN_LINES,
  fallback: FALLBACK_LINES,
};
