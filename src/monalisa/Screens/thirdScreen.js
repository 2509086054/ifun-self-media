import BasicContainer from '../DisplayObjects/BasicContainer/BasicContainer';
import { Text, TextStyle, Texture, Sprite } from 'pixi.js';
import { loader, WRAP_MODES, filters } from 'pixi.js';
import { path } from '../Constants/AssetsConstants';
import Store from '../Stores/Store';
import { TweenLite, TimelineMax, Bounce, Power2 } from 'gsap/TweenMax';
// eslint-disable-next-line
import { PixiPlugin } from 'gsap/PixiPlugin';
import { ShockwaveFilter } from '@pixi/filter-shockwave';
import { OldFilmFilter } from '@pixi/filter-old-film';

/**
 * third Screen
 * 播放盖茨比和露西的对话
 * @exports thirdScreen
 * @extends BasicContainer
 */

export default class thirdScreen extends BasicContainer {
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
    this.activeOldFilm = false;
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
   * 1.白色背景
   * 2.大海，两个 filters 特效
   * 3.两个人物头像
   * 4.人物对话框
   */
  init() {
    // 初始化
    this.res = loader.resources;
    this.Canvas = Store.getState().Renderer;
    // 切换背景图
    const loadingbg = new Sprite(this.res[path + 'bg3.jpg'].texture);
    const zoom = 1; // loadingbg.texture.height/250
    loadingbg.width = this.Canvas.initCanvasWidth;
    loadingbg.height = this.Canvas.initCanvasHeight;
    // 在原比例基础上，再次缩放 Y 轴
    loadingbg.scale.y *= zoom;
    // 计算原图与初始设备之间的比例
    this.scaleX = this.Canvas.initCanvasWidth / loadingbg.texture.width;
    this.scaleY =
      this.Canvas.initCanvasHeight / loadingbg.texture.height * zoom;
    loadingbg.name = 'loadingbg';
    this.addChild(loadingbg);

    const sea = new Sprite(this.res[path + 'sea-background.jpg'].texture);
    sea.name = 'sea';
    // 海浪波动时有空白，设置width和x/y，挡住空白
    sea.width = this.Canvas.initCanvasWidth + 20;
    sea.height = this.Canvas.initCanvasHeight / 2 + 20;
    sea.x = -10;
    sea.y = this.Canvas.initCanvasHeight / 2;
    this.addChild(sea);

    // 加入 Filter，模拟海浪效果
    // 先判断横竖屏，确定海浪起点位置
    let startPoint = [0, 0];
    if (window.orientation === 0 || window.orientation === 180) {
      startPoint = [sea.height / 2, 0];
    } else {
      startPoint = [0, sea.height / 2];
    }
    const shockWaveFilter1 = new ShockwaveFilter(startPoint, {
      amplitude: 23,
      wavelength: 100,
      brightness: 0.9,
      radius: loadingbg.width
    });
    const displacementSprite = new Sprite(
      this.res[path + 'water_filter.png'].texture
    );
    // Make sure the sprite is wrapping.
    displacementSprite.texture.baseTexture.wrapMode = WRAP_MODES.REPEAT;
    const displacementFilter = new filters.DisplacementFilter(
      displacementSprite
    );
    displacementFilter.padding = 10;

    displacementSprite.name = 'displacementSprite';
    displacementSprite.position = sea.position;

    displacementSprite.width = sea.width;
    displacementSprite.height = sea.height;
    sea.addChild(displacementSprite);

    sea.filters = [displacementFilter, shockWaveFilter1];

    // 注册广播，及时更新 shockWaveFilter 的起点位置
    Store.subscribe(() => {
      this.shockWaveFilter_ChangeCenter();
    });
    displacementFilter.scale.x = 30;
    displacementFilter.scale.y = 60;

    // animate 刷新 shockWaveFilter1.time 和 displacementSprite.x
    this.active = true;
    requestAnimationFrame(this.animate.bind(this));

    // 加入人物
    const Leonardo = new Sprite(this.res[path + 'li2.png'].texture);
    const lucy = new Sprite(this.res[path + 'lu2.png'].texture);
    Leonardo.width = lucy.width = 50 * this.scaleX;
    Leonardo.height = lucy.height = 70 * this.scaleY;
    Leonardo.anchor.set(0, 1);
    Leonardo.x = this.Canvas.initCanvasWidth - 100 * this.scaleX;
    Leonardo.scale.x *= -1;
    Leonardo.rotation -= Math.PI / 180 * 25;
    Leonardo.name = 'Leonardo';
    lucy.anchor.set(0, 1);
    lucy.x = 80 * this.scaleX;
    Leonardo.y = 60 * this.scaleY;
    lucy.y = 75 * this.scaleY;
    lucy.name = 'lucy';
    this.addChild(Leonardo);
    this.addChild(lucy);

    // 添加泡泡
    const lucyBubbleTexture = Texture.fromFrame('bubble_4.png');
    const lucyBubble = new Sprite(lucyBubbleTexture);
    lucyBubble.anchor.set(0);
    lucyBubble.width = this.Canvas.initCanvasWidth * 0.65;
    lucyBubble.height = this.Canvas.initCanvasHeight * 0.3;
    lucyBubble.x = 130 * this.scaleX;
    lucyBubble.y = 50 * this.scaleY;
    lucyBubble.name = 'lucyBubble';
    // 初始化时不显示，在 playScript()中定义动画
    lucyBubble.visible = false;
    this.addChild(lucyBubble);

    const leonBubbleTexture = Texture.fromFrame('bubble_2.png');
    const leonBubble = new Sprite(leonBubbleTexture);
    leonBubble.anchor.set(1, 0);
    leonBubble.width = lucyBubble.width;
    leonBubble.height = lucyBubble.height;
    leonBubble.x = 670 * this.scaleX;
    leonBubble.y = lucyBubble.y;
    leonBubble.name = 'leonBubble';
    // 初始化时不显示，在 playScript()中定义动画
    leonBubble.visible = false;
    this.addChild(leonBubble);

    // 加入对话文字
    const lucyMsg = new Text('', this.textStyle);
    lucyMsg.anchor.set(0);
    lucyMsg.width = lucyBubble.texture.width * 0.89;
    lucyMsg.height = lucyBubble.texture.height * 0.5 * 1.8;
    lucyMsg.x = 10;
    lucyMsg.y = 40;
    lucyMsg.name = 'lucyMsg';
    // 加入泡泡sprite时，会自动缩放
    // 尺寸、位置都要按父容器原图来测量，注意父容器的原点
    lucyBubble.addChild(lucyMsg);

    const leonMsg = new Text('', this.textStyle);
    leonMsg.anchor.set(0, 1);
    leonMsg.width = leonBubble.texture.width * 0.89;
    leonMsg.height = leonBubble.texture.height * 0.5 * 1.8;
    leonMsg.x = -leonBubble.texture.width;
    leonMsg.y = leonBubble.texture.height;
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
      await this.Script1();
      await this.animateScript1();
      await this.animateScript2();
      this.OldFilmFilter();
    };
    playTimeline();
  }

  /**
   * 第一段台词
   * lucy:为什么你的酒\n这么便宜啊
   * leon:因为哥是大纽腰\n最早做“公海灌装”红酒的大BOSS
   */
  async Script1() {
    const leonBubble = this.getChildByName('leonBubble');
    const leonMsg = leonBubble.getChildByName('leonMsg');
    const lucyBubble = this.getChildByName('lucyBubble');
    const lucyMsg = lucyBubble.getChildByName('lucyMsg');

    // 定义动画的时间线
    const tl = new TimelineMax({ delay: 1 });
    // 返回 Promise 对象
    return new Promise(resolve => {
      tl
        .fromTo(
          lucyBubble,
          0.5,
          {
            pixi: {
              // rotation: -90, // 文字垂直
              ease: Bounce.easeIn
            }
          },
          {
            pixi: {
              // rotation: 0, // 文字水平
              ease: Bounce.easeOut
            },
            onStart: () => {
              lucyBubble.visible = true;
            },
            onComplete: () => {
              lucyMsg.text = '为什么你的酒🍷\n这么便宜啊😱😱😱';
            }
          }
        )
        .fromTo(
          leonBubble,
          0.5,
          {
            pixi: {
              // rotation: 90, // 文字垂直
              ease: Bounce.easeIn
            }
          },
          {
            pixi: {
              // rotation: 0, // 文字水平
              ease: Bounce.easeOut
            },
            onStart: () => {
              lucyBubble.visible = false;
              lucyMsg.text = '';
              leonBubble.visible = true;
            },
            onComplete: () => {
              leonMsg.text = '🤴因为哥是大纽腰\n最早做“公海灌装”红酒的大BOSS🤴';
            }
          },
          '+=2'
        )
        .to(
          leonMsg,
          0,
          {
            onComplete: () => {
              leonBubble.visible = false;
              return resolve();
            }
          },
          '+=2.5'
        );
    }); // Promise 对象
  } // this.Script1()

  /**
   * 公海灌装
   * 在 this.Script1() 结束后执行
   * 1.初始化精灵：货轮、小木船、橡木桶、对话框
   * 2、剧本：
   * leon:先用货轮从国外运输散装红酒\n到大纽腰附近的公海㊙\n天王老子也管不着的地界
   * 动画：出现货轮
   * 动画：货轮航行到近镜
   * leon:在公海上灌装成瓶\n再用大飞偷运进城
   * 动画：出现小木船，航行到货轮附近
   * 动画：装货，橡木桶
   * 动画：小木船出现文字 “走你”
   * leon:赚钱那是相当的容易\n可就有一点不好
   * 后接台风动画
   */
  async animateScript1() {
    const sea = this.getChildByName('sea');
    const leonBubble = this.getChildByName('leonBubble');
    const leonMsg = leonBubble.getChildByName('leonMsg');

    // 货轮
    const oceanFreight = new Sprite(
      this.res[path + 'ocean_freight1.png'].texture
    );

    oceanFreight.anchor.set(1, 0.5); // 锚点在船头中间位置，感觉船在海中
    // oceanFreight.scale.x = 0.15
    // oceanFreight.scale.y = 0.65 // 船头朝前
    // oceanFreight.scale.x *= -0.5
    oceanFreight.width = sea.width / 3 * this.scaleX;
    oceanFreight.height = sea.height / 3 * this.scaleY;
    oceanFreight.visible = false;
    oceanFreight.name = 'oceanFreight';
    this.addChild(oceanFreight);

    // 小木船
    const boad = new Sprite(this.res[path + 'boad.png'].texture);
    boad.anchor.set(0.5); // 锚点在船头中间位置，感觉船在海中
    boad.scale.x *= 1.2;
    boad.scale.y *= 1.2;
    boad.x = this.Canvas.initCanvasWidth - 30 * this.scaleX;
    boad.y = this.Canvas.initCanvasHeight + 50 * this.scaleY;
    boad.width = sea.width * 0.35;
    boad.height = sea.height * 0.35;
    boad.name = 'boad';
    this.addChild(boad);

    // 橡木桶
    const oak = new Sprite(this.res[path + 'wine_barrel.png'].texture);
    oak.anchor.set(0.5); // 锚点在船头中间位置，感觉船在海中
    oak.x = -boad.width / 2 + 10;
    oak.y = -200;
    oak.width = boad.width * 1.5;
    oak.height = boad.height * 1.5;
    oak.visible = false;
    oak.name = 'oak';
    boad.addChild(oak);

    // "走你"对话框
    const goodByeTexture = Texture.fromFrame('bubble_5.png');
    const goodByeBubble = new Sprite(goodByeTexture);
    goodByeBubble.anchor.set(0.3, 1);
    goodByeBubble.width = this.Canvas.initCanvasWidth * 0.2;
    goodByeBubble.height = this.Canvas.initCanvasHeight * 0.2;
    // 在装船后赋值
    // goodByeBubble.x = boad.x - 50 * this.scaleX
    // goodByeBubble.y = boad.y
    goodByeBubble.name = 'goodByeBubble';
    goodByeBubble.visible = false;
    this.addChild(goodByeBubble);

    // 加入对话文字
    const goodByeMsg = new Text('👌👌走你💃💃', this.textStyle);
    goodByeMsg.anchor.set(0);
    goodByeMsg.width = goodByeBubble.texture.width * 0.89;
    goodByeMsg.height = goodByeBubble.texture.height * 0.5;
    goodByeMsg.x = -50;
    goodByeMsg.y = -160;
    goodByeMsg.name = 'lucyMsg';
    // 加入泡泡sprite时，会自动缩放
    // 尺寸、位置都要按父容器原图来测量，注意父容器的原点
    goodByeBubble.addChild(goodByeMsg);

    // 定义货轮的运动轨迹
    let curvedWaypoints = [
      // First curve
      [
        // { x: 100 * this.scaleX, y: 300 * this.scaleY },
        { x: 750 * this.scaleX, y: 350 * this.scaleY },
        { x: 580 * this.scaleX, y: 398 * this.scaleY },
        { x: 680 * this.scaleX, y: 300 * this.scaleY }
      ],
      // Second curve
      [
        { x: 300 * this.scaleX, y: 550 * this.scaleY },
        { x: 150 * this.scaleX, y: 458 * this.scaleY },
        { x: 250 * this.scaleX, y: 410 * this.scaleY }
      ]
    ];
    const tl = new TimelineMax({ delay: 0 });
    // 返回 Promise 对象
    return new Promise(resolve => {
      tl
        .fromTo(
          leonBubble,
          0.5,
          {
            pixi: {
              // rotation: 90, // 文字垂直
              ease: Bounce.easeIn
            }
          },
          {
            pixi: {
              // rotation: 0, // 文字水平
              ease: Bounce.easeOut
            },
            onStart: () => {
              leonMsg.text = '';
              leonBubble.visible = true;
            },
            onComplete: () => {
              leonMsg.text =
                '🦊🦊先用货轮从国外运输散装红酒\n到大纽腰附近的公海㊙\n天王老子也管不着的地界🚨';
            }
          },
          '+=0.5'
        )
        .to(oceanFreight, 1, {
          // 船头朝前
          onUpdate: () => {
            // oceanFreight.scale.x += 0.015
          },
          onComplete: () => {
            oceanFreight.x = this.Canvas.initCanvasWidth / 2; // 100 * this.scaleX
            oceanFreight.y =
              this.Canvas.initCanvasHeight / 2 + 10 * this.scaleY;
            oceanFreight.visible = true;
          }
        })
        .to(
          oceanFreight,
          4,
          {
            // 大船轨迹
            bezier: {
              type: 'soft',
              values: curvedWaypoints[0],
              autoRotate: false
            },
            ease: Power2.easeInOut,
            onUpdate: () => {
              oceanFreight.scale.x += 0.001;
              oceanFreight.scale.y += 0.001;
            },
            onComplete: () => {}
          },
          '+=2'
        )
        .fromTo(
          leonBubble,
          0.5,
          {
            pixi: {
              // rotation: 90, // 文字垂直
              ease: Bounce.easeIn
            }
          },
          {
            pixi: {
              // rotation: 0, // 文字水平
              ease: Bounce.easeOut
            },
            onStart: () => {
              leonMsg.text = '';
              leonBubble.visible = true;
            },
            onComplete: () => {
              leonMsg.text = '在公海上灌装成瓶🍷\n再用大飞🚤偷运进城🏰';
            }
          },
          '+=2'
        )
        .to(
          boad,
          4,
          {
            // 小木船轨迹
            bezier: {
              type: 'soft',
              values: curvedWaypoints[1],
              autoRotate: false
            },
            ease: Power2.easeInOut,
            onUpdate: () => {},
            onComplete: () => {
              boad.scale.x *= -1;
            }
          },
          '+=2'
        )
        .to(
          oak,
          4,
          {
            // 装货，橡木桶
            pixi: { y: 0 },
            ease: Power2.easeInOut,
            onStart: () => {
              oak.visible = true;
            },
            onComplete: () => {
              goodByeBubble.x = boad.x - 70 * this.scaleX;
              goodByeBubble.y = boad.y - 50 * this.scaleY;
              goodByeBubble.visible = true;
            }
          },
          '+=2'
        )
        .fromTo(
          leonBubble,
          0.5,
          {
            pixi: {
              // rotation: 90, // 文字垂直
              ease: Bounce.easeIn
            }
          },
          {
            pixi: {
              // rotation: 0, // 文字水平
              ease: Bounce.easeOut
            },
            onStart: () => {
              leonMsg.text = '';
              leonBubble.visible = true;
            },
            onComplete: () => {
              // leonMsg.text = '脑子是个好东西，公海灌装，工作条件有限🛠\n自然环境也不可控🎯\n没办法大规模生产'
              leonMsg.text = '赚钱那是相当的容易😎\n可就有一点不好🤦🤦';
              return resolve();
            }
          },
          '+=2'
        );
    }); // Promise 对象
  } // animateScript1

  /**
   * 台风过处，寸草不生
   * 在 this.animateScript1() 结束后执行
   * 1、初始化：台风和对话框
   * 2、剧本：
   * 动画：台风出现
   * 动画：台风对话框出现“台风过处\n鸡犬不留”
   * 动画：台风轨迹，行进中卷起货轮和小木船
   * 动画：台风对话框出现“卷走你\n嘻嘻”
   */
  async animateScript2() {
    // 涉及到的精灵
    const leonBubble = this.getChildByName('leonBubble');
    const oceanFreight = this.getChildByName('oceanFreight');
    const boad = this.getChildByName('boad');
    const goodByeBubble = this.getChildByName('goodByeBubble');

    // 台风
    const storm = new Sprite(this.res[path + 'storm.png'].texture);
    storm.anchor.set(0.5, 1); // 锚点在台风底部中间位置
    storm.x = 20 * this.scaleX;
    storm.y = 450 * this.scaleY;
    storm.width = this.Canvas.initCanvasWidth * 0.5;
    storm.height = this.Canvas.initCanvasHeight * 0.6;
    storm.visible = false;
    this.addChild(storm);

    // 台风对话框
    const stormTexture = Texture.fromFrame('bubble_6.png');
    const stormBubble = new Sprite(stormTexture);
    stormBubble.anchor.set(1);
    stormBubble.width = this.Canvas.initCanvasWidth * 0.25;
    stormBubble.height = this.Canvas.initCanvasHeight * 0.25;
    // 泡泡翻转
    stormBubble.scale.x *= -1;
    stormBubble.x = 160 * this.scaleX;
    stormBubble.y = 230 * this.scaleY;
    stormBubble.name = 'stormBubble';
    stormBubble.visible = false;
    this.addChild(stormBubble);

    // 加入对话文字
    const stormMsg = new Text('台风过处\n鸡犬不留🐔🐶❌', this.textStyle);
    stormMsg.anchor.set(0);
    // 跟随泡泡，做镜像翻转
    stormMsg.scale.x *= -1;
    stormMsg.width = stormBubble.texture.width * 0.89;
    stormMsg.height = stormBubble.texture.height * 1.05;
    stormMsg.x = -20;
    stormMsg.y = -250;
    stormMsg.name = 'stormMsg';
    // 加入泡泡sprite时，会自动缩放
    // 尺寸、位置都要按父容器原图来测量，注意父容器的原点
    stormBubble.addChild(stormMsg);

    // 台风路径
    let stormPoints = [
      { x: 150 * this.scaleX, y: 300 * this.scaleY },
      { x: 320 * this.scaleX, y: 550 * this.scaleY },
      { x: 560 * this.scaleX, y: 498 * this.scaleY },
      { x: 680 * this.scaleX, y: 450 * this.scaleY }
    ];
    const tl = new TimelineMax({ delay: 0 });
    // 返回 Promise 对象
    return new Promise(resolve => {
      tl
        .to(
          storm,
          1,
          {
            // 台风出现
            pixi: {},
            ease: Power2.easeInOut,
            onComplete: () => {
              leonBubble.visible = goodByeBubble.visible = false;
              storm.visible = true;
              stormBubble.visible = true;
            }
          },
          '+=2'
        )
        .to(
          storm,
          4,
          {
            // 台风轨迹
            bezier: { type: 'soft', values: stormPoints, autoRotate: false },
            // pixi: {x: 620 * this.scaleX },
            ease: Power2.easeOut,
            onStart: () => {
              stormBubble.visible = false;
              oceanFreight.anchor.set(0.5);
              boad.anchor.set(0.5);
            },
            onUpdate: () => {
              oceanFreight.rotation += 0.06;
              oceanFreight.x += 0.2;
              oceanFreight.y -= 0.2;

              boad.rotation += 0.05;
              boad.x += 0.2;
              boad.y -= 0.2;
            },
            onComplete: () => {
              stormBubble.visible = true;
              stormBubble.scale.x *= -1; // 镜像翻转回正常
              stormBubble.x = 500 * this.scaleX;
              stormBubble.y = 200 * this.scaleY;
              stormMsg.text = '🌀🌀卷走你🌀🌀\n嘻嘻😆😆😆';
              stormMsg.scale.x *= -1;
              stormMsg.x = -300;
              oceanFreight.visible = boad.visible = false;
            }
          },
          '+=2'
        )
        .to(
          stormMsg,
          1,
          {
            // 🌀🌀卷走你🌀🌀 停留2秒
            pixi: {},
            ease: Power2.easeInOut,
            onComplete: () => {
              return resolve();
            }
          },
          '+=2'
        );
    }); // Promise 对象
  } // this.animateScript2()

  /**
   * 加入OldFilmFilter滤镜
   * API文档：
   * https://pixijs.io/pixi-filters/docs/PIXI.filters.OldFilmFilter.html
   * DEMO:
   * http://pixijs.io/pixi-filters/tools/demo/
   */
  OldFilmFilter() {
    // 添加透明蒙板
    /**
     * 在容器上覆盖一层透明蒙板
     * 对蒙板添加 filter
     * 这样，按钮可以加在蒙板之上，没有 filter 特效
     */
    const bg = new Sprite(this.res[path + 'bg3.jpg'].texture);
    bg.width = this.Canvas.initCanvasWidth;
    bg.height = this.Canvas.initCanvasHeight;
    bg.name = 'bg3_Transparent';
    bg.alpha = 0.5;
    this.addChild(bg);

    // 创建滤镜
    let filter = new OldFilmFilter({
      sepia: 0, // 0.3
      noise: 0, // 0.3
      scratch: 0, // 0.5
      scratchDensity: 0, // 0.3
      // 以下设置后，vignetting 从0-1，屏幕体现圆形消失效果
      vignettingBlur: 0,
      vignettingAlpha: 1,
      vignetting: 0
    });

    // this.getChildByName('bg3_Transparent')
    this.getChildByName('bg3_Transparent').filters = [filter]; // 蒙板上加 filter
    // 加入动态效果
    filter.seed = Math.random();
    this.activeOldFilm = true;
    // requestAnimationFrame(this.animate.bind(this))
    // 滤镜效果渐变
    TweenLite.to(
      filter,
      0.5,
      {
        // delay: 1, // 延时1秒开始
        sepia: 0.3,
        noise: 0.3,
        scratch: 0.5,
        scratchDensity: 0.3,
        onStart: () => {}, // graphics.visible = true
        onComplete: () => {
          this.addButton();
        }
      },
      '+=1'
    );
  }

  /**
   * 加入互动按钮，在执行旧电影效果后
   */
  addButton() {
    // 两个控制按钮
    const nextButton = new Sprite(Texture.fromFrame('RightArrow.png'));
    const repeatButton = new Sprite(Texture.fromFrame('repeat.png'));
    nextButton.anchor.set(0.5);
    repeatButton.anchor.set(0.5);
    nextButton.width = repeatButton.width = this.Canvas.initCanvasWidth / 6;
    nextButton.height = repeatButton.height = this.Canvas.initCanvasHeight / 6;
    nextButton.x = 200 * this.scaleX; // 原图绝对位置
    nextButton.y = 480 * this.scaleY;
    repeatButton.x = 600 * this.scaleX;
    repeatButton.y = 480 * this.scaleY;
    nextButton.name = 'yesbutton';
    repeatButton.name = 'nobutton';
    nextButton.interactive = repeatButton.interactive = true;
    nextButton.buttonMode = repeatButton.buttonMode = true;

    const nextText = new Text('继续播放', this.textStyle);
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
      const filter = this.getChildByName('bg3_Transparent').filters[0];
      // 滤镜效果渐变
      TweenLite.to(filter, 0.5, {
        vignetting: 1, // 设置晕影效果的半径
        vignettingAlpha: 1, // 不透明，体现圆形消失效果
        // ease: Bounce.easeOut,
        onComplete: () => {
          this.active = false;
          this.activeOldFilm = false;
          this.done();
        }
      });
    });

    repeatButton.on('pointertap', () => {
      this.removeChildren();
      this.active = false;
      this.activeOldFilm = false;
      this.init();
    });
  }

  /**
   * 屏幕 Resize 时，更新 Filter 的 Center 位置
   */
  shockWaveFilter_ChangeCenter() {
    let sea = this.getChildByName('sea');
    if (window.orientation === 0 || window.orientation === 180) {
      sea.filters[1].center = [sea.height / 2, 0];
    } else {
      sea.filters[1].center = [0, sea.height / 2];
    }
  }

  /**
   * Main animation loop, updates animation store
   * @return {null}
   */
  animate() {
    if (this.active) {
      // 波浪 filter 动画
      let displacementSprite = this.getChildByName('sea').getChildByName(
        'displacementSprite'
      );
      let shock = this.getChildByName('sea').filters;
      shock[1].time = shock[1].time >= 3 ? -0.25 : shock[1].time + 0.01;
      displacementSprite.x += 2;
      // Reset x to 0 when it's over width to keep values from going to very huge numbers.
      if (displacementSprite.x > displacementSprite.width) {
        displacementSprite.x = 0;
      }
    }
    if (this.activeOldFilm) {
      // 旧电影 filter 动画
      this.getChildByName('bg3_Transparent').filters[0].seed = Math.random();
    }

    requestAnimationFrame(this.animate.bind(this));
  }
}
