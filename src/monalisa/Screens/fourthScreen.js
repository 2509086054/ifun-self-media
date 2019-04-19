import BasicContainer from '../DisplayObjects/BasicContainer/BasicContainer';
import { Text, TextStyle, Texture, Sprite } from 'pixi.js';
import { loader } from 'pixi.js';
import { path } from '../Constants/AssetsConstants';
import Store from '../Stores/Store';
import { TweenLite, TimelineMax, Bounce, Power2 } from 'gsap/TweenMax';
// eslint-disable-next-line
import { PixiPlugin } from 'gsap/PixiPlugin';
import { OldFilmFilter } from '@pixi/filter-old-film';
import { PopToFront } from '../utils';

/**
 * fourth Screen
 * 播放盖茨比保税区建厂动画
 * @exports fourthScreen
 * @extends BasicContainer
 */

export default class fourthScreen extends BasicContainer {
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
    this.i = 1;
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
   * 2.码头、工厂、铲车
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

    // 港口码头
    const port = new Sprite(this.res[path + 'port.png'].texture);
    port.name = 'port';
    port.anchor.set(0, 1);
    port.width = this.Canvas.initCanvasWidth * 0.4;
    port.height = this.Canvas.initCanvasHeight / 2 + 20;
    port.x = -10 * this.scaleX;
    port.y = this.Canvas.initCanvasHeight;
    this.addChild(port);

    // 工厂
    const factory = new Sprite(this.res[path + 'factory_2.png'].texture);
    factory.name = 'factory';
    factory.anchor.set(1, 0.5); // factory 从底部中间位置拔地而起
    factory.width = this.Canvas.initCanvasWidth * 0.45;
    // factory.height = this.Canvas.initCanvasHeight / 3 + 20;
    factory.height = 0; // 在animateScript1()中拔地而起
    factory.x = 580 * this.scaleX + factory.width / 2;
    factory.y = this.Canvas.initCanvasHeight / 3;
    this.addChild(factory);

    // 工厂先不出现
    // factory.visible = false;

    // 加入人物
    // 人物和泡泡的位置与第3屏对比，都是翻转的
    // scale.x *= -1;
    const Leonardo = new Sprite(this.res[path + 'li2.png'].texture);
    const lucy = new Sprite(this.res[path + 'lu2.png'].texture);
    Leonardo.width = lucy.width = 50 * this.scaleX;
    Leonardo.height = lucy.height = 70 * this.scaleY;

    lucy.anchor.set(0, 1);
    lucy.x = this.Canvas.initCanvasWidth - 100 * this.scaleX;
    lucy.scale.x *= -1;
    // lucy.rotation -= Math.PI / 180 * 25;
    lucy.name = 'Leonardo';

    Leonardo.anchor.set(0, 1);
    Leonardo.x = 80 * this.scaleX;
    Leonardo.rotation = Math.PI / 180 * 25;
    lucy.y = 75 * this.scaleY;
    Leonardo.y = 60 * this.scaleY;
    Leonardo.name = 'lucy';
    this.addChild(Leonardo);
    this.addChild(lucy);

    // 添加泡泡
    const lucyBubbleTexture = Texture.fromFrame('bubble_4.png');
    const lucyBubble = new Sprite(lucyBubbleTexture);
    lucyBubble.anchor.set(0);
    lucyBubble.width = this.Canvas.initCanvasWidth * 0.65;
    lucyBubble.height = this.Canvas.initCanvasHeight * 0.3;
    lucyBubble.x = 670 * this.scaleX;
    lucyBubble.y = 50 * this.scaleY;
    lucyBubble.scale.x *= -1;
    lucyBubble.name = 'lucyBubble';
    // 初始化时不显示，在 playScript()中定义动画
    lucyBubble.visible = false;
    this.addChild(lucyBubble);

    const leonBubbleTexture = Texture.fromFrame('bubble_2.png');
    const leonBubble = new Sprite(leonBubbleTexture);
    leonBubble.anchor.set(1, 0);
    leonBubble.width = lucyBubble.width;
    leonBubble.height = lucyBubble.height;
    leonBubble.x = 130 * this.scaleX;
    leonBubble.y = lucyBubble.y;
    leonBubble.scale.x *= -1;
    leonBubble.name = 'leonBubble';
    // 初始化时不显示，在 playScript()中定义动画
    leonBubble.visible = false;
    this.addChild(leonBubble);

    // 加入对话文字
    const lucyMsg = new Text('', this.textStyle);
    lucyMsg.anchor.set(0);
    lucyMsg.scale.x *= -1;
    lucyMsg.width = lucyBubble.texture.width * 0.89;
    lucyMsg.height = lucyBubble.texture.height * 0.5 * 1.8;
    lucyMsg.x = lucyBubble.texture.width;
    lucyMsg.y = 40;
    lucyMsg.name = 'lucyMsg';
    // 加入泡泡sprite时，会自动缩放
    // 尺寸、位置都要按父容器原图来测量，注意父容器的原点
    lucyBubble.addChild(lucyMsg);

    const leonMsg = new Text('', this.textStyle);
    leonMsg.anchor.set(0, 1);
    leonMsg.scale.x *= -1;
    leonMsg.width = leonBubble.texture.width * 0.89;
    leonMsg.height = leonBubble.texture.height * 0.5 * 1.8;
    leonMsg.x = 10;
    leonMsg.y = leonBubble.texture.height;
    leonMsg.name = 'leonMsg';
    // 加入泡泡sprite时，会自动缩放
    // 尺寸、位置都要按父容器原图来测量，注意父容器的原点
    leonBubble.addChild(leonMsg);

    // 展开剧本时间线
    this.playScript();
  } // this.init()

  /**
   * 第一段台词
   * lucy:说的冠冕堂皇\n其实就是在公海上拿色素兑假酒\n鄙视你
   * leon:哥是负责任的私酒商，好吗？\n酒是真酒，只不过是散装的
   * leon:而且由于公海上条件有限🛠\n自然环境也不可控🎯\n没办法大规模生产
   * leon:所以，哥在纽腰港租了一个保税仓\n流水线出产灌装红酒
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
              lucyMsg.text =
                '说的冠冕堂皇\n其实就是在公海上拿色素兑假酒\n鄙视你👿👿👿';
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
              leonMsg.text =
                '哥，是一个高尚的人，好吗👻？\n酒是真酒，只不过是散装的😅😅😅';
            }
          },
          '+=4'
        )
        .to(
          leonBubble,
          0.5,
          {
            pixi: {
              // rotation: 0, // 文字水平
              ease: Bounce.easeOut
            },
            onStart: () => {
              lucyMsg.text = '';
            },
            onComplete: () => {
              leonMsg.text =
                '而且由于公海上条件有限🛠\n自然环境也不可控🎯\n没办法大规模生产';
            }
          },
          '+=5'
        )
        .to(
          leonBubble,
          0.5,
          {
            pixi: {
              // rotation: 0, // 文字水平
              ease: Bounce.easeOut
            },
            onStart: () => {
              lucyMsg.text = '';
            },
            onComplete: () => {
              leonMsg.text =
                '所以，哥在纽腰港租了一个保税仓\n流水线出产灌装红酒';
            }
          },
          '+=5'
        )
        .to(
          leonMsg,
          0,
          {
            onComplete: () => {
              // leonBubble.visible = false;
              return resolve();
            }
          },
          '+=2.5'
        );
    }); // Promise 对象
  } // this.Script1()

  /**
   * Main animation loop, updates animation store
   * @return {null}
   */
  animate() {
    if (this.active) {
    }
    if (this.activeOldFilm) {
      // 旧电影 filter 动画
      this.getChildByName('bg3_Transparent').filters[0].seed = Math.random();
    }
    requestAnimationFrame(this.animate.bind(this));
  }

  /**
   * 公海灌装
   * 在 this.Script1() 结束后执行
   * 1.初始化
   * 2、剧本：
   * leon:购卖灌装设备生产线\n把仓库改装成工厂
   * 动画：出现工厂
   * leon:散装红酒正规进口\n再拉到工厂成批灌装
   * 动画：出现铲车，在港口和工厂之间行进
   * leon:赚钱那是相当的容易\n可就有一点不好
   * 后接台风动画
   */
  async animateScript1() {
    const factory = this.getChildByName('factory');
    const leonBubble = this.getChildByName('leonBubble');
    const leonMsg = leonBubble.getChildByName('leonMsg');

    // 铲车1
    const Forklift_1 = new Sprite(this.res[path + 'Forklift_1.png'].texture);
    Forklift_1.name = 'Forklift_1';
    Forklift_1.width = 133 * 0.5 * this.scaleX;
    Forklift_1.height = 137 * 0.5 * this.scaleY;
    Forklift_1.x = 670 * this.scaleX;
    Forklift_1.y = factory.y + 75 * this.scaleY;
    this.addChild(Forklift_1);

    // 铲车2
    const Forklift_2 = new Sprite(this.res[path + 'Forklift_2.png'].texture);
    Forklift_2.name = 'Forklift_2';
    Forklift_2.width = 133 * 0.5 * this.scaleX;
    Forklift_2.height = 137 * 0.5 * this.scaleY;
    Forklift_2.x = 340;
    Forklift_2.y = 400 * this.scaleY;
    Forklift_2.scale.x *= -1;
    this.addChild(Forklift_2);

    // 货车1
    const truck_1 = new Sprite(this.res[path + 'truck_2.png'].texture);
    truck_1.name = 'truck_1';
    truck_1.width = 500 * 0.5 * this.scaleX;
    truck_1.height = 400 * 0.5 * this.scaleY;
    truck_1.x = 440 * this.scaleX;
    truck_1.y = 150 * this.scaleY;
    truck_1.scale.x *= -1;
    this.addChild(truck_1);

    // 货车2
    const truck_2 = new Sprite(this.res[path + 'truck_1.png'].texture);
    truck_2.name = 'truck_2';
    truck_2.width = 500 * 0.5 * this.scaleX;
    truck_2.height = 400 * 0.5 * this.scaleY;
    truck_2.x = 480 * this.scaleX;
    truck_2.y = 380 * this.scaleY;
    this.addChild(truck_2);

    // 全部不显示
    Forklift_1.visible = Forklift_2.visible = truck_1.visible = truck_2.visible = false;

    // 货车对话框
    const goodByeTexture = Texture.fromFrame('bubble_6.png');
    const goodByeBubble = new Sprite(goodByeTexture);
    goodByeBubble.anchor.set(0.3, 1);
    goodByeBubble.width = this.Canvas.initCanvasWidth * 0.2;
    goodByeBubble.height = this.Canvas.initCanvasHeight * 0.2;

    // 货车说话
    goodByeBubble.x = truck_2.x + 30 * this.scaleX;
    goodByeBubble.y = truck_2.y + 30 * this.scaleY;
    goodByeBubble.name = 'goodByeBubble';
    goodByeBubble.visible = false;
    this.addChild(goodByeBubble);

    // 加入对话文字
    const goodByeMsg = new Text(
      '💰💰\xA0hurry\xA0\xA0up\xA0💰💰\n挤死😈正规红酒😈',
      this.textStyle
    );
    goodByeMsg.anchor.set(0);
    goodByeMsg.width = goodByeBubble.texture.width * 1.2;
    goodByeMsg.height = goodByeBubble.texture.height * 1.2;
    goodByeMsg.x = -80;
    goodByeMsg.y = -230;
    // 加入泡泡sprite时，会自动缩放
    // 尺寸、位置都要按父容器原图来测量，注意父容器的原点
    goodByeBubble.addChild(goodByeMsg);

    // 定义叉车的运动轨迹
    let curvedWaypoints = [
      // First curve
      [
        // { x: 100 * this.scaleX, y: 300 * this.scaleY },
        { x: 550 * this.scaleX, y: 450 * this.scaleY },
        { x: 400 * this.scaleX, y: 350 * this.scaleY }
        // { x: 680 * this.scaleX, y: 300 * this.scaleY }
      ],
      // Second curve
      [
        { x: 300 * this.scaleX, y: 550 * this.scaleY },
        { x: 510 * this.scaleX, y: 458 * this.scaleY }
        // { x: 250 * this.scaleX, y: 410 * this.scaleY }
      ]
    ];
    const tl = new TimelineMax({ delay: 0 });
    const tagetHeight = this.Canvas.initCanvasHeight / 3 + 20;

    // 返回 Promise 对象
    return new Promise(resolve => {
      tl
        .fromTo(
          factory,
          2,
          {
            pixi: {
              height: 0, // 文字垂直
              ease: Bounce.easeIn
            }
          },
          {
            pixi: {
              height: tagetHeight, // 文字水平
              ease: Bounce.easeOut
            },
            onStart: () => {
              leonMsg.text = '';
              leonBubble.visible = false;
            },
            onComplete: () => {
              // 车辆全部显示
              Forklift_1.visible = Forklift_2.visible = truck_1.visible = truck_2.visible = true;
            }
          },
          '+=1.5'
        )
        .to(
          Forklift_1,
          4,
          {
            bezier: {
              type: 'soft',
              values: curvedWaypoints[0],
              autoRotate: false
            },
            ease: Power2.easeInOut,
            onUpdate: () => {}
          },
          '+=0.5'
        )
        .to(
          Forklift_2,
          4,
          {
            bezier: {
              type: 'soft',
              values: curvedWaypoints[1],
              autoRotate: false
            },
            ease: Power2.easeOut,
            onStart: () => {
              // 气泡出现
              goodByeBubble.visible = true;
            }
          },
          '+=0.5'
        )
        .to(
          truck_2,
          4,
          {
            pixi: {
              x: this.Canvas.initCanvasWidth + 10,
              y: this.Canvas.initCanvasHeight / 2
            },
            ease: Power2.easeOut,
            onStart: () => {
              goodByeBubble.visible = false;
            },
            onComplete: () => {
              return resolve();
            }
          },
          '+=0.5'
        );
    }); // Promise 对象
  } // animateScript1

  /**
   * 在 this.animateScript1() 结束后执行
   * 1、初始化：蒙板和对话框
   * 2、剧本：
   * 动画：蒙板出现
   * 动画：蒙板着色
   * leon：这样做起来，各种证照齐全\n欧盟认证等级，绝对是真酒
   * leon:再注册一个洋品牌，一瓶酒成本也就10多块钱\n零售50/60元钱\n大纽腰人民喜欢的不要不要的
   * lucy:但是，散酒在海上漂几个月，没有真空包装\n灌装车间也没有无菌环境\n这个酒的质量不行吧
   * leon:饿...😅😅😅~~~\n为了赚钱，💝➡🖤只能把良心先别在前列腺上了💝➡🖤
   */
  async animateScript2() {
    // 涉及到的精灵
    const leonBubble = this.getChildByName('leonBubble');
    const leonMsg = leonBubble.getChildByName('leonMsg');
    const lucyBubble = this.getChildByName('lucyBubble');
    const lucyMsg = lucyBubble.getChildByName('lucyMsg');

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

    // 将2个头像 Z-index 调整到最前
    this.children = PopToFront(this.children)(this.getChildByName('Leonardo'));
    this.children = PopToFront(this.children)(this.getChildByName('lucy'));
    // 将对话框 Z-index 调整到最前
    this.children = PopToFront(this.children)(leonBubble);
    this.children = PopToFront(this.children)(lucyBubble);

    // 动画时间线
    const tl = new TimelineMax({ delay: 0 });
    // 返回 Promise 对象
    return new Promise(resolve => {
      tl
        .to(
          bg,
          0.5,
          {
            pixi: {
              tint: 0x7d7979, // 蒙板着色，灰色
              ease: Bounce.easeOut
            }
          },
          '+=1'
        )
        .fromTo(
          leonBubble,
          0.5,
          {
            pixi: {
              ease: Bounce.easeIn
            }
          },
          {
            pixi: {
              ease: Bounce.easeOut
            },
            onStart: () => {
              lucyBubble.visible = false;
              lucyMsg.text = '';
              leonBubble.visible = true;
              leonMsg.text =
                '这样做起来，各种证照齐全📜\n欧盟认证等级📝，绝对是真酒👌💪';
            },
            onComplete: () => {}
          },
          '+=1'
        )
        .to(
          leonBubble,
          0.5,
          {
            pixi: {
              ease: Bounce.easeOut
            },
            onStart: () => {
              lucyMsg.text = '';
              leonMsg.text =
                '再注册一个洋品牌，一瓶酒成本也就10多块钱\n零售50/60元钱💴\n大纽腰人民喜欢的不要不要的💸💰';
            },
            onComplete: () => {}
          },
          '+=5'
        )
        .fromTo(
          lucyBubble,
          0.5,
          {
            pixi: {
              ease: Bounce.easeIn
            }
          },
          {
            pixi: {
              ease: Bounce.easeOut
            },
            onStart: () => {
              lucyMsg.text = '';
              lucyBubble.visible = true;
              leonBubble.visible = false;
              lucyMsg.text =
                '但是，散酒在海上漂几个月，没有真空包装🎈🎈\n⛑️👣灌装车间也没有无菌环境👣⛑️\n这个酒的质量不行吧💩💩💩';
            },
            onComplete: () => {}
          },
          '+=5'
        )
        .to(
          leonBubble,
          0.5,
          {
            pixi: {
              ease: Bounce.easeOut
            },
            onStart: () => {
              leonMsg.text = '';
              lucyBubble.visible = false;
              leonBubble.visible = true;
              leonMsg.text =
                '饿...\xA0\xA0😅😅😅\n为了赚钱，💝➡🖤只能先把\xA0良心\xA0别在\xA0前列腺\xA0上了💝➡🖤';
            },
            onComplete: () => {}
          },
          '+=6'
        )
        .to(
          leonMsg,
          0,
          {
            onComplete: () => {
              // leonBubble.visible = false;
              return resolve();
            }
          },
          '+=6'
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
    // 创建滤镜
    let filter = new OldFilmFilter({
      sepia: 0, // 0.3
      noise: 0, // 0.3
      scratch: 0, // 0.5
      scratchDensity: 0, // 0.3
      scratchWidth: 1.5,
      // 以下设置后，vignetting 从0-1，屏幕体现圆形消失效果
      vignettingBlur: 0,
      vignettingAlpha: 1,
      vignetting: 0
    });

    this.getChildByName('bg3_Transparent').filters = [filter]; // 蒙板上加 filter
    // 加入动态效果
    filter.seed = Math.random();
    this.activeOldFilm = true;
    requestAnimationFrame(this.animate.bind(this));

    // 加入超人
    const superman = new Sprite(this.res[path + 'superman.png'].texture);
    superman.anchor.set(0.5);
    superman.width = this.Canvas.initCanvasWidth * 0.4;
    superman.height = this.Canvas.initCanvasHeight * 0.8;
    superman.x = this.Canvas.initCanvasWidth / 2;
    superman.y = this.Canvas.initCanvasHeight / 2;
    this.addChild(superman);

    // 泡泡
    const bubbleTexture = Texture.fromFrame('tips-0.png');
    const Bubble = new Sprite(bubbleTexture);
    Bubble.anchor.set(0, 1);
    Bubble.width = this.Canvas.initCanvasWidth / 4;
    Bubble.height = this.Canvas.initCanvasHeight / 3;
    Bubble.x = superman.x + superman.width / 5;
    Bubble.y = superman.y - superman.height / 5;

    // Add text as a child of the Sprite
    const text = new Text(
      '这种酒真的少喝为妙\n千万不要因小失大💊',
      this.textStyle
    );
    text.anchor.set(0, 0.5);
    text.width = Bubble.texture.width * 1.15;
    text.height = Bubble.texture.height * 0.9;
    text.x = 30;
    text.y = -Bubble.texture.height / 2 + 5;
    Bubble.addChild(text);
    this.addChild(Bubble);

    // 超人不显示
    superman.visible = Bubble.visible = false;

    // oldfilm 效果
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
          // 头像和气泡不显示
          this.getChildByName('Leonardo').visible = this.getChildByName(
            'lucy'
          ).visible = this.getChildByName('leonBubble').visible = false;
          // 显示超人
          superman.visible = Bubble.visible = true;
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
          this.removeChildren();
          this.done();
        }
      });
    });

    repeatButton.on('pointertap', () => {
      this.active = false;
      this.activeOldFilm = false;
      this.removeChildren();
      this.init();
    });
  }

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
}
