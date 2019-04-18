import BasicContainer from '../DisplayObjects/BasicContainer/BasicContainer';
import { Text, TextStyle, Texture, Sprite, Graphics } from 'pixi.js';
import { loader, extras } from 'pixi.js';
import { path } from '../Constants/AssetsConstants';
import Store from '../Stores/Store';
import {
  TweenMax,
  TweenLite,
  TimelineLite,
  Bounce,
  Power2
} from 'gsap/TweenMax';
// eslint-disable-next-line
import { PixiPlugin } from 'gsap/PixiPlugin';
// import {OldFilmFilter} from 'pixi-filters'
import { OldFilmFilter } from '@pixi/filter-old-film';

/**
 * second Screen
 * 播放盖茨比和露西的对话
 * @exports secondScreen
 * @extends BasicContainer
 */

export default class secondScreen extends BasicContainer {
  constructor() {
    super();
    this.Canvas = {
      initCanvasWidth: 0,
      initCanvasHeight: 0
    };
    this.res = {};
    this.scaleX = this.scaleY = 0;
    // animate 控制开关
    this.active = false;
    // 定义文字样式
    this.textStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 40,
      fontStyle: 'italic',
      // fontVariant
      fontWeight: 'bold',
      lineHeight: 28,
      align: 'center',
      fill: ['#00ff99', '#00ff99'], // gradient
      stroke: '#4a1850',
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 16,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: 2
    });
  }

  /**
   * 初始化函数
   */
  init() {
    // 初始化
    this.res = loader.resources;
    this.Canvas = Store.getState().Renderer;
    // 切换背景图
    const loadingbg = new Sprite(this.res[path + 'stage.jpg'].texture);
    const zoom = loadingbg.texture.height / 250;
    loadingbg.name = 'loadingbg';
    loadingbg.width = this.Canvas.initCanvasWidth;
    loadingbg.height = this.Canvas.initCanvasHeight;
    // 在原比例基础上，再次缩放 Y 轴
    loadingbg.scale.y *= zoom;
    // 计算原图与初始设备之间的比例
    this.scaleX = this.Canvas.initCanvasWidth / loadingbg.texture.width;
    this.scaleY =
      this.Canvas.initCanvasHeight / loadingbg.texture.height * zoom;
    this.addChild(loadingbg);

    // 加入人物
    const Leonardo = new Sprite(this.res[path + 'Leon.png'].texture);
    const lucy = new Sprite(this.res[path + 'lucy.png'].texture);
    Leonardo.width = lucy.width = 100 * this.scaleX;
    Leonardo.height = lucy.height = 130 * this.scaleY;
    Leonardo.anchor.set(1);
    Leonardo.x = 320 * this.scaleX;
    Leonardo.y = 235 * this.scaleY;
    Leonardo.scale.x *= -1;
    Leonardo.name = 'Leonardo';
    lucy.anchor.set(0, 1);
    lucy.x = 40 * this.scaleX;
    lucy.y = 235 * this.scaleY;
    lucy.name = 'lucy';
    this.addChild(Leonardo);
    this.addChild(lucy);

    // 添加泡泡
    const lucyBubbleTexture = Texture.fromFrame('talk-5.png');
    const lucyBubble = new Sprite(lucyBubbleTexture);
    lucyBubble.anchor.set(1, 1);
    lucyBubble.width = lucy.width * 1.4;
    lucyBubble.height = lucy.height * 0.8;
    lucyBubble.x = 97 * this.scaleX;
    lucyBubble.y = 117 * this.scaleY;
    lucyBubble.scale.x *= -1;
    lucyBubble.name = 'lucyBubble';
    // 初始化时不显示，在 playScript()中定义动画
    lucyBubble.visible = false;
    this.addChild(lucyBubble);

    const leonBubbleTexture = Texture.fromFrame('talk-1.png');
    const leonBubble = new Sprite(leonBubbleTexture);
    leonBubble.anchor.set(1, 1);
    leonBubble.width = Leonardo.width * 1.4;
    leonBubble.height = Leonardo.height * 0.8;
    leonBubble.x = 380 * this.scaleX;
    leonBubble.y = 110 * this.scaleY;
    // leonBubble.scale.x *= -1
    leonBubble.name = 'leonBubble';
    // 初始化时不显示，在 playScript()中定义动画
    leonBubble.visible = false;
    this.addChild(leonBubble);

    // 加入对话文字
    const lucyMsg = new Text('', this.textStyle);
    lucyMsg.scale.x *= -1;
    lucyMsg.anchor.set(0, 1);
    lucyMsg.width = lucyBubble.texture.width * 0.89;
    lucyMsg.height = lucyBubble.texture.height * 0.5;
    lucyMsg.x = -10;
    lucyMsg.y = -lucyBubble.texture.height / 2 + 30;
    lucyMsg.name = 'lucyMsg';
    // 加入泡泡sprite时，会自动缩放
    // 尺寸、位置都要按父容器原图来测量，注意父容器的原点
    lucyBubble.addChild(lucyMsg);

    const leonMsg = new Text('', this.textStyle);
    leonMsg.anchor.set(0, 1);
    leonMsg.width = leonBubble.texture.width * 0.89;
    leonMsg.height = leonBubble.texture.height * 0.8;
    leonMsg.x = -leonBubble.texture.width;
    leonMsg.y = -leonBubble.texture.height / 2 + 80;
    leonMsg.name = 'leonMsg';
    // 加入泡泡sprite时，会自动缩放
    // 尺寸、位置都要按父容器原图来测量，注意父容器的原点
    leonBubble.addChild(leonMsg);

    // 展开剧本时间线
    this.playScript();
  } // this.init()

  /**
   * 剧本时间线
   */
  playScript() {
    const playTimeline = async () => {
      // 第一段对话
      await this.Script1();
      this.animateScript1();
    };
    playTimeline();
  }

  async Script1() {
    const leonBubble = this.getChildByName('leonBubble');
    const leonMsg = leonBubble.getChildByName('leonMsg');
    const lucyBubble = this.getChildByName('lucyBubble');
    const lucyMsg = lucyBubble.getChildByName('lucyMsg');
    const leonMsgX = -leonBubble.texture.width;
    // 定义动画的时间线
    const tl = new TimelineLite({ delay: 1 });
    // 返回 Promise 对象
    return new Promise(resolve => {
      tl
        .fromTo(
          lucyBubble,
          0.5,
          {
            pixi: {
              rotation: -90, // 文字垂直
              ease: Bounce.easeIn
            }
          },
          {
            pixi: {
              rotation: 0, // 文字水平
              ease: Bounce.easeOut
            },
            onStart: () => {
              lucyBubble.visible = true;
            },
            onComplete: () => {
              lucyMsg.text = '盖茨比💘😍💘\n趴体太奢华啦\n好嗨呦！👍👍👍';
            }
          }
        )
        .fromTo(
          leonBubble,
          0.5,
          {
            pixi: {
              rotation: 90, // 文字垂直
              ease: Bounce.easeIn
            }
          },
          {
            pixi: {
              rotation: 0, // 文字水平
              ease: Bounce.easeOut
            },
            onStart: () => {
              leonBubble.visible = true;
            },
            onComplete: () => {
              leonMsg.text = '黛西老妹😍\n我也想低调哇\n但实力它不允许啊😈😈😈';
            }
          },
          '+=2'
        )
        .to(
          lucyMsg,
          0.5,
          {
            pixi: {
              x: '+=1000', // 文字飞出
              ease: Power2.easeIn
            },
            onStart: () => {
              lucyMsg.rotation += 2; // 文字垂直
            },
            onComplete: () => {
              lucyMsg.rotation = 0;
              lucyMsg.x = 0;
              lucyMsg.text = '你生意咋做得\n这么大涅？🤑🤑🤑';
            }
          },
          '+=2'
        )
        .to(
          leonMsg,
          0.5,
          {
            pixi: {
              x: '+=1000', // 文字飞出
              ease: Power2.easeIn
            },
            onStart: () => {
              leonMsg.rotation -= 2; // 文字垂直
            },
            onComplete: () => {
              leonMsg.rotation = 0;
              leonMsg.x = leonMsgX;
              leonMsg.text = '纽腰人民都买我的红酒\n生意好到爆🔥🔥🔥';
            }
          },
          '+=2'
        )
        .to(
          leonMsg,
          0,
          {
            onComplete: () => {
              return resolve();
            }
          },
          '+=2'
        );
    }); // Promise 对象
  } // this.Script1()

  /**
   * 红酒价格对比动画
   * 在 this.Script1() 结束后执行
   */
  animateScript1() {
    // 添加透明蒙板
    const graphics = new Graphics();
    // draw a rounded rectangle
    graphics.lineStyle(2, 0xff00ff, 1);
    graphics.beginFill(0xffffff, 0.8);
    graphics.drawRoundedRect(
      20 * this.scaleX,
      20 * this.scaleY,
      this.Canvas.initCanvasWidth * 0.9,
      this.Canvas.initCanvasHeight * 0.95,
      16
    );
    graphics.endFill();
    graphics.name = 'graphics';
    this.addChild(graphics);

    // 加入 Bottle 对比
    const Leon_bottle = new Sprite(this.res[path + 'Leon_bottle.png'].texture);
    const lafei_bottle = new Sprite(
      this.res[path + 'lafei_bottle.png'].texture
    );

    lafei_bottle.width = graphics.width * 0.2;
    lafei_bottle.height = graphics.height * 1.05;
    lafei_bottle.x = graphics.x + 40 * this.scaleX;
    lafei_bottle.y = graphics.y + 15 * this.scaleY;

    Leon_bottle.width = graphics.width * 0.2;
    Leon_bottle.height = graphics.height * 1.05;
    Leon_bottle.x = lafei_bottle.x + lafei_bottle.width + 80 * this.scaleX;
    Leon_bottle.y = lafei_bottle.y;

    this.addChild(Leon_bottle);
    this.addChild(lafei_bottle);

    // 泡泡
    const bubbleTexture = Texture.fromFrame('tips-0.png');
    const Bubble = new Sprite(bubbleTexture);
    Bubble.anchor.set(0, 1);
    Bubble.width = graphics.width / 4;
    Bubble.height = graphics.height / 3;
    Bubble.x = lafei_bottle.x + lafei_bottle.width / 2;
    Bubble.y = lafei_bottle.y + lafei_bottle.height / 2;

    // Add text as a child of the Sprite
    const text = new Text('正规原瓶进口\n成本258元/支', this.textStyle);
    text.anchor.set(0, 1);
    text.width = Bubble.texture.width * 0.8;
    text.height = Bubble.texture.height * 0.5;
    text.x = 50;
    text.y = -Bubble.texture.height / 2 + 80;
    Bubble.addChild(text);
    this.addChild(Bubble);

    const Bubble2 = new Sprite(bubbleTexture);
    Bubble2.anchor.set(0, 1);
    Bubble2.width = graphics.width / 4;
    Bubble2.height = graphics.height / 3;
    Bubble2.x = Leon_bottle.x + Leon_bottle.width / 2;
    Bubble2.y = Leon_bottle.y + Leon_bottle.height / 2;

    // Add text2 as a child of the Sprite
    const text2 = new Text('我也是进口的\n成本8元/支', this.textStyle);
    text2.anchor.set(0, 1);
    text2.width = Bubble2.texture.width * 0.8;
    text2.height = Bubble2.texture.height * 0.5;
    text2.x = 50;
    text2.y = -Bubble2.texture.height / 2 + 80;

    Bubble2.addChild(text2);
    this.addChild(Bubble2);

    // 两个控制按钮
    const nextButton = new Sprite(Texture.fromFrame('RightArrow.png'));
    const repeatButton = new Sprite(Texture.fromFrame('repeat.png'));
    nextButton.anchor.set(0.5);
    repeatButton.anchor.set(0.5);
    nextButton.width = repeatButton.width = graphics.width / 8;
    nextButton.height = repeatButton.height = graphics.width / 8;
    nextButton.x = graphics.width - 20 * this.scaleX;
    nextButton.y = graphics.y + nextButton.height / 2 + 40 * this.scaleY;
    repeatButton.x = nextButton.x;
    repeatButton.y = nextButton.y + repeatButton.height / 2 + 60 * this.scaleY;
    nextButton.name = 'yesbutton';
    repeatButton.name = 'nobutton';
    nextButton.interactive = repeatButton.interactive = true;
    nextButton.buttonMode = repeatButton.buttonMode = true;
    const nextText = new Text('探求原因', this.textStyle);
    const repeatText = new Text('重播本段', this.textStyle);
    nextText.anchor.set(0.5);
    repeatText.anchor.set(0.5);
    nextText.width = repeatText.width = nextButton.texture.width; //* 0.8
    nextText.height = repeatText.height = nextButton.texture.height * 0.5;
    nextText.y = repeatText.y = nextButton.texture.height / 2 + 30;
    // 按钮中加入文字
    nextButton.addChild(nextText);
    repeatButton.addChild(repeatText);
    // 容器中加入按钮
    this.addChild(nextButton);
    this.addChild(repeatButton);
    // 定义按钮事件
    nextButton.on('pointertap', () => {
      this.done();
    });
    repeatButton.on('pointertap', () => {
      this.removeChildren();
      this.active = false;
      this.init();
    });
  } // animateScript1
}
