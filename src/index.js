import "./styles.css";

import * as PIXI from "pixi.js";
import { CrossHatchFilter } from "@pixi/filter-cross-hatch";
import { AsciiFilter } from "@pixi/filter-ascii";
import { DotFilter } from "@pixi/filter-dot";
import { AdjustmentFilter } from "@pixi/filter-adjustment";

import { OutlineFilter } from "@pixi/filter-outline";
import { PixelateFilter } from "@pixi/filter-pixelate";
import { NoiseFilter } from "@pixi/filter-noise";
import { BlurFilter } from "@pixi/filter-blur";

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
const canvasWidth = 744;
const canvasHeight = 1039;
const app = new PIXI.Application({
  width: canvasWidth,
  height: canvasHeight,
  antialias: true
});
document.body.appendChild(app.view);

const addLayover = () => {
  // create a new Sprite from an image path
  const bunny = PIXI.Sprite.from("./card.png");

  // center the sprite's anchor point
  bunny.anchor.set(0);

  // move the sprite to the center of the screen
  bunny.x = 0;
  bunny.y = 0;
  bunny.alpha = 0.5;
  app.stage.addChild(bunny);
};

const build = (card) => {
  const w = 644;
  const nameBox = { x: 50, y: 50, w: w, h: 62 };
  const artBox = { x: 50, y: nameBox.y + nameBox.h, w: w, h: 470 };
  const typeBox = { x: 50, y: artBox.y + artBox.h, w: w, h: 62 };
  const rulesBox = { x: 50, y: typeBox.y + typeBox.h, w: w, h: 321 };

  const graphicsFrame = new PIXI.Graphics();

  graphicsFrame.beginFill(0xffffff);
  graphicsFrame.drawRoundedRect(30, 30, canvasWidth - 60, 500, 20);
  graphicsFrame.drawRoundedRect(30, 100, canvasWidth - 60, 820, 60);
  //graphicsFrame.filters = [
  //   new AdjustmentFilter({ brightness: 2.5 }),
  //   new NoiseFilter(1.5)
  // ];
  app.stage.addChild(graphicsFrame);

  const graphics = new PIXI.Graphics();

  const drawRect = (shape) => {
    graphics.drawRect(shape.x, shape.y, shape.w, shape.h);
  };

  // Rectangle
  graphics.beginFill(0xffffff);
  graphics.lineStyle(4, 0x000000, 1);

  // Name Box
  drawRect(nameBox);

  // Type Box
  drawRect(artBox);
  // Type Box
  drawRect(typeBox);

  // Rules Box
  drawRect(rulesBox);

  // Power toughness
  // graphics.lineStyle(10, 0xffffff, 1);
  // graphics.drawRoundedRect(580, 924, 122, 58, 15);
  graphics.lineStyle(4, 0x0, 1);
  graphics.drawRoundedRect(580, 924, 122, 58, 15);

  // Rectangle + line style 1
  // graphics.lineStyle(2, 0xfeeb77, 1);
  // graphics.beginFill(0x650a5a);
  // graphics.drawRect(200, 50, 100, 100);
  // graphics.endFill();

  app.stage.addChild(graphics);

  // Add Name
  let text = new PIXI.Text(card.name, {
    fontFamily: "Hoefler Text",
    fontSize: 36,
    fill: 0x0
  });

  text.x = nameBox.x + 20;
  text.y = nameBox.y + 10;

  app.stage.addChild(text);

  // Mana Cost
  let cmcText = (card.mana_cost ?? "").replace(/[\{|\}]+/g, "");
  let cmcStyle = new PIXI.TextStyle({
    fontFamily: "monospace",
    fontSize: 36,
    fill: 0x0,
    align: "right"
  });
  let cmc = new PIXI.Text(cmcText, cmcStyle);
  let cmcMetrics = PIXI.TextMetrics.measureText(cmcText, cmcStyle);

  cmc.x = nameBox.x - 20 + w - cmcMetrics.width;
  cmc.y = nameBox.y + 10;

  app.stage.addChild(cmc);

  //

  // Add Type
  let type = new PIXI.Text(card.type_line, {
    fontFamily: "Hoefler Text",
    fontSize: 36,
    fill: 0x0
  });

  type.x = typeBox.x + 20;
  type.y = typeBox.y + 10;

  app.stage.addChild(type);

  // Add Type

  let rulesStyle = new PIXI.TextStyle({
    fontFamily: "Hoefler Text",
    fontSize: 32,
    //fontStyle: "italic",
    lineHeight: 32,
    fill: 0x0,
    wordWrap: true,
    wordWrapWidth: rulesBox.w - 40
  });

  let rulesPadding = { x: 20, y: 15 };
  let rules = new PIXI.Text(card.oracle_text, rulesStyle);
  rules.x = rulesBox.x + rulesPadding.x;
  rules.y = rulesBox.y + rulesPadding.y;

  let rulesTextWidth = rulesBox.w - rulesPadding.x * 2;
  let rulesTextHeight = rulesBox.h - rulesPadding.y * 2;

  let rulesMetrics = PIXI.TextMetrics.measureText(
    card.oracle_text,
    rules.style
  );
  let rulesScale = rulesTextHeight / rulesMetrics.height;
  while (rulesScale < 1 && rules.style.fontSize > 5) {
    rules.style.fontSize--;
    rules.style.lineHeight = rules.style.fontSize;
    rulesMetrics = PIXI.TextMetrics.measureText(card.oracle_text, rules.style);
    rulesScale = rulesTextHeight / rulesMetrics.height;
  }

  app.stage.addChild(rules);

  // Art Box
  const g3 = new PIXI.Graphics();

  // Rectangle
  g3.lineStyle(4, 0xff0000, 1);
  g3.drawRect(rules.x, rules.y, rulesTextWidth, rulesTextHeight);

  app.stage.addChild(g3);

  //image_uris.border_crop
  PIXI.Loader.shared.reset();
  const s = PIXI.Loader.shared.add("image", card.image_uris.art_crop, {
    crossOrigin: "anonymous"
  });
  s.load(() => {
    let s = new PIXI.Sprite(PIXI.Loader.shared.resources.image.texture);

    s.filters = [
      //new BlurFilter(15)
      new AdjustmentFilter({ gamma: 0.9 })
      //new CrossHatchFilter()
      //new DotFilter(0.6, 1.9),
    ];

    s.width = w;
    s.height = artBox.h;
    s.x = 51;
    s.y = artBox.y;
    //s.alpha = 0.5;
    app.stage.addChild(s);

    let s2 = new PIXI.Sprite(PIXI.Loader.shared.resources.image.texture);
    s2.width = s.width;
    s2.height = s.height;
    s2.x = s.x;
    s2.y = s.y;

    let crosshatch = new CrossHatchFilter();
    crosshatch.blendMode = PIXI.BLEND_MODES.ADD;
    s2.filters = [crosshatch];
    app.stage.addChild(s2);

    // Art Box
    const g2 = new PIXI.Graphics();

    // Rectangle
    g2.lineStyle(4, 0x000000, 1);
    g2.drawRect(artBox.x, artBox.y, artBox.w, artBox.h);

    app.stage.addChild(g2);

    //addLayover();
  });
};

fetch("https://api.scryfall.com/cards/random?q=type%3Aplaneswalker")
  .then((resp) => resp.json())
  .then((data) => {
    build(data);
  });
