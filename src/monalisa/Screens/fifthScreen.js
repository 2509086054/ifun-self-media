import BasicContainer from '../DisplayObjects/BasicContainer/BasicContainer';
import { Text, TextStyle, Texture, Sprite } from 'pixi.js';
import { loader } from 'pixi.js';
import { path } from '../Constants/AssetsConstants';
import Store from '../Stores/Store';
import { TimelineLite, Bounce, Power2 } from 'gsap/TweenMax';
// eslint-disable-next-line
import { PixiPlugin } from 'gsap/PixiPlugin';
// import {OldFilmFilter} from 'pixi-filters'
import { OldFilmFilter } from '@pixi/filter-old-film';
import { PopToFront } from '../utils';

/**
 * second Screen
 * 播放盖茨比和露西的对话
 * @exports fifthScreen
 * @extends BasicContainer
 */

export default class fifthScreen extends BasicContainer {
  constructor() {
    super();
    this.Device = {
      initDeviceWidth: 0,
      initDeviceHeight: 0
    };
    this.res = {};
    this.scaleX = this.scaleY = 0;
    // animate 控制开关
    this.active = this.activeOldFilm = false;
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
    this.Device = Store.getState().Renderer;
    // 切换背景图
    const loadingbg = new Sprite(this.res[path + 'stage.jpg'].texture);
    const zoom = loadingbg.texture.height / 250;
    loadingbg.name = 'loadingbg';
    loadingbg.width = this.Device.initDeviceWidth;
    loadingbg.height = this.Device.initDeviceHeight;
    // 在原比例基础上，再次缩放 Y 轴
    loadingbg.scale.y *= zoom;
    // 计算原图与初始设备之间的比例
    this.scaleX = this.Device.initDeviceWidth / loadingbg.texture.width;
    this.scaleY =
      this.Device.initDeviceHeight / loadingbg.texture.height * zoom;
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
    lucyMsg.height = lucyBubble.texture.height * 0.8;
    lucyMsg.x = -10;
    lucyMsg.y = -lucyBubble.texture.height / 2 + 50;
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

    // 加入 蒙娜丽莎酒瓶
    const bottle_monalisa = new Sprite(
      this.res[path + 'bottle_monalisa.png'].texture
    );
    bottle_monalisa.width = lucy.width;
    bottle_monalisa.height = lucy.height;
    bottle_monalisa.anchor.set(0.5, 1);
    bottle_monalisa.x = this.Device.initDeviceWidth / 2;
    bottle_monalisa.y = lucy.y;
    bottle_monalisa.name = 'bottle_monalisa';
    bottle_monalisa.alpha = 0.8;
    bottle_monalisa.visible = false;
    this.addChild(bottle_monalisa);

    // 展开剧本时间线
    this.playScript();
  } // this.init()

  /**
   * 第一段台词
   * lucy：不会请我喝的也是这种\xA0“\xA0进口酒\xA0”\xA0吧？怒！不相信！
   * leon：请老妹必须喝好酒呀
   * 动画：蒙娜丽莎酒瓶
   * lucy：呀~~这不是蒙娜丽莎吗，全人类都认识啊，这酒有牌面
   * leon：达芬奇家族酒庄，传承400多年\n是意大利葡萄酒在全球的领航者\n请老妹喝这酒不掉份吧
   * 动画：达芬奇出现，我的后代这么牛B摸\n来来来，你来当祖宗，我来当孙子
   * lucy：看着是不错
   * 动画：河马鲜生卖158/支，我只卖79/支
   * lucy：原瓶进口\n知名品牌\n价格实在，牛牛牛
   * lucy：我以后想买怎么办
   * 动画：蒙娜丽莎出现，给你一个二维码，自己体会
   */

  async Script1() {
    const leonBubble = this.getChildByName('leonBubble');
    const leonMsg = leonBubble.getChildByName('leonMsg');
    const lucyBubble = this.getChildByName('lucyBubble');
    const lucyMsg = lucyBubble.getChildByName('lucyMsg');
    const leonMsgX = -leonBubble.texture.width;
    const bottle_monalisa = this.getChildByName('bottle_monalisa');
    const { _x, _y } = bottle_monalisa.scale; // 原始 bottle_monalisa 的缩放比
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
              lucyMsg.text =
                '请我喝的\n不会也是这种\n\xA0“\xA0进口酒🍷\xA0”\xA0吧？\n👿🙅🙅💔';
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
              leonMsg.text = '哪能啊\n请老妹必须喝好酒呀\n😅❤️️😅❤️️😅❤️️';
            }
          },
          '+=2.5'
        )
        .fromTo(
          // 蒙娜丽莎酒瓶出现
          bottle_monalisa,
          1.5,
          {
            pixi: {
              scaleX: _x * 2,
              scaleY: _y * 2,
              ease: Bounce.easeIn
            }
          },
          {
            pixi: {
              scaleX: _x,
              scaleY: _y,
              ease: Bounce.easeOut
            },
            onStart: () => {
              leonBubble.visible = lucyBubble.visible = false;
              leonMsg.text = lucyMsg.text = '';
              bottle_monalisa.visible = true;
            },
            onUpdate: () => {},
            onComplete: () => {}
          },
          '+=2.5'
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
              lucyBubble.visible = true;
              lucyMsg.rotation += 2; // 文字垂直
            },
            onComplete: () => {
              lucyMsg.rotation = 0;
              lucyMsg.x = 0;
              lucyMsg.text = '呀~~这不是蒙❌❌莎吗😍\n这酒有牌面\n👍👍👍';
            }
          },
          '+=2.5'
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
              leonBubble.visible = true;
              leonMsg.rotation -= 2; // 文字垂直
            },
            onComplete: () => {
              leonMsg.rotation = 0;
              leonMsg.x = leonMsgX;
              leonMsg.text =
                '达芬奇家族酒庄\n400年传承\n意大利销量领先\n喝这酒不掉份吧';
            }
          },
          '+=2'
        )
        .to(
          leonMsg,
          0,
          {
            onComplete: () => {
              // leonBubble.visible = lucyBubble.visible = false;
              this.getChildByName('Leonardo').visible = this.getChildByName(
                'lucy'
              ).visible = false;
              return resolve();
            }
          },
          '+=3.5'
        );
    }); // Promise 对象
  } // this.Script1()

  /**
   * 在 this.Script1() 结束后执行
   * 1.初始化
   * 2、剧本：
   * lucy:我的子孙这么牛B么？\n来来来，画笔给你\n我来当孙子
   * leon:奇大爷\n不要太调皮哟\n
   * lucy:话说这酒\n哪里有的卖
   * leon:奇大爷\n给你一个2维码\n自己慢慢体会
   * lucy:每周六还有粉丝抽奖\n哈哈哈\nI\xA0like
   * leon:感谢大家观看\n别忘了\n点击关注喔
   * 后接2维码
   */
  async animateScript1() {
    // 涉及到的精灵
    const lucy = this.getChildByName('lucy');
    const leon = this.getChildByName('Leonardo');

    // 重用气泡
    const leonBubble = this.getChildByName('leonBubble');
    const leonMsg = leonBubble.getChildByName('leonMsg');
    const lucyBubble = this.getChildByName('lucyBubble');
    const lucyMsg = lucyBubble.getChildByName('lucyMsg');
    const leonMsgX = -leonBubble.texture.width;

    // 加入旧电影 filter
    this.OldFilmFilter();

    // 加入达芬奇
    const davinci = new Sprite(this.res[path + 'davinci.png'].texture);
    davinci.width = lucy.width;
    davinci.height = lucy.height;
    davinci.anchor.set(1, 1); // 与 lucy 一样
    davinci.x = lucy.x;
    davinci.y = lucy.y;
    davinci.scale.x *= -1;
    davinci.name = 'davinci';
    this.addChild(davinci);

    // 加入蒙娜丽莎
    const monalisa = new Sprite(
      this.res[path + 'Sporty_Mona_Lisa-1.jpg'].texture
    );
    monalisa.alpha = 0.8;
    monalisa.anchor.set(0, 1);
    monalisa.width = 100 * this.scaleX;
    monalisa.height = 130 * this.scaleY;
    monalisa.x = leon.x;
    monalisa.y = leon.y;
    this.addChild(monalisa);

    // 加入2维码
    /**
     * 微信浏览器'长按2维码'识别功能
     * 针对的是 img H5元素
     * 这里动态生成 H5 element
    const qrcode = new Sprite(this.res[path + 'qrcode.jpg'].texture);
    qrcode.width = this.Device.initDeviceWidth /3;
    qrcode.height = lucy.height;
    qrcode.anchor.set(0.5,1);
    qrcode.x = this.Device.initDeviceWidth /2;
    qrcode.y = lucy.y;
    qrcode.name = 'qrcode';
    qrcode.alpha = 1;
    qrcode.visible = false;
    this.addChild(qrcode);
    */
    const qrcode = document.createElement('img');
    qrcode.setAttribute('id', 'qrcode');
    qrcode.setAttribute('src', path + 'qrcode.jpg');
    qrcode.setAttribute('style', 'position: fixed;display:block;');

    // 设置中心点
    qrcode.style.transformOrigin = '50% 100%';
    // Opera、Chrome 和 Safari
    qrcode.style.WebkitTransformOrigin = '50% 100%';
    // IE 9
    qrcode.style.msTransformOrigin = '50% 100%';

    qrcode.width = this.Device.initDeviceWidth / 3;
    qrcode.height = lucy.height;
    qrcode.style.left = this.Device.initDeviceWidth / 2 + 'px';
    qrcode.style.top = lucy.y + 'px';
    console.log(lucy.position);
    console.log(this.toGlobal(lucy.position));
    // add the newly created element and its content into the DOM
    const currentDiv = document.getElementById('container');
    currentDiv.appendChild(qrcode);

    // 将对话框 Z-index 调整到最前
    this.children = PopToFront(this.children)(leonBubble);
    this.children = PopToFront(this.children)(lucyBubble);

    // 定义动画的时间线
    const tl = new TimelineLite({ delay: 1 });
    // const {_x,_y} = qrcode.scale; // 原始 qrcode 的缩放比
    // 返回 Promise 对象
    return new Promise(resolve => {
      tl
        .to(
          lucyMsg,
          0.5,
          {
            pixi: {
              x: '+=1000', // 文字飞出
              ease: Power2.easeIn
            },
            onStart: () => {
              lucyBubble.visible = true;
              lucyMsg.rotation += 2; // 文字垂直
            },
            onComplete: () => {
              lucyMsg.rotation = 0;
              lucyMsg.x = 0;
              lucyMsg.text =
                '我的子孙这么牛B么🐮🐮？\n来来来，画笔给你🎨\n我来当孙子👼👶';
            }
          },
          '+=2.5'
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
              leonBubble.visible = true;
              leonMsg.rotation -= 2; // 文字垂直
            },
            onComplete: () => {
              leonMsg.rotation = 0;
              leonMsg.x = leonMsgX;
              leonMsg.text = '奇大爷👴👴\n不要太调皮哟🖐️🖐️🖐️\n';
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
              lucyBubble.visible = true;
              lucyMsg.rotation += 2; // 文字垂直
            },
            onComplete: () => {
              lucyMsg.rotation = 0;
              lucyMsg.x = 0;
              lucyMsg.text = '话说这酒🍷🍷🍷\n哪里有的卖💥💥💥';
            }
          },
          '+=2.5'
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
              leonBubble.visible = true;
              leonMsg.rotation -= 2; // 文字垂直
            },
            onComplete: () => {
              leonMsg.rotation = 0;
              leonMsg.x = leonMsgX;
              leonMsg.text = '奇大爷👴👴\n给你一个2维码\n自己慢慢体会🔱🔱';
            }
          },
          '+=2'
        )
        .fromTo(
          // 2维码出现
          qrcode,
          1.5,
          {
            transform: 'scale(2)',
            ease: Bounce.easeIn
          },
          {
            transform: 'scale(1)',
            ease: Bounce.easeOut,
            onStart: () => {
              qrcode.style.display = 'block';
              // this.getChildByName('bottle_monalisa').visible = false;
            },
            onUpdate: () => {},
            onComplete: () => {}
          },
          '+=2.5'
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
              lucyBubble.visible = true;
              lucyMsg.rotation += 2; // 文字垂直
            },
            onComplete: () => {
              lucyMsg.rotation = 0;
              lucyMsg.x = 0;
              lucyMsg.text =
                '每周六还有粉丝抽奖🎅🎅🎅\n哈哈哈~~~\nI\xA0like😍😍😍';
            }
          },
          '+=2.5'
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
              leonBubble.visible = true;
              leonMsg.rotation -= 2; // 文字垂直
            },
            onComplete: () => {
              leonMsg.rotation = 0;
              leonMsg.x = leonMsgX;
              leonMsg.text = '感谢大家观看👍👍👍\n别忘了\n点击关注喔♑';
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
          '+=3.5'
        );
    }); // Promise 对象
  } // animateScript1

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
    bg.width = this.Device.initDeviceWidth;
    bg.height = this.Device.initDeviceHeight;
    bg.name = 'bg3_Transparent';
    bg.alpha = 0.5;
    this.addChild(bg);

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

    bg.filters = [filter]; // 蒙板上加 filter
    // 加入动态效果
    filter.seed = Math.random();
    this.activeOldFilm = true;
    requestAnimationFrame(this.animate.bind(this));

    // oldfilm 效果
    // 动画时间线
    const tl = new TimelineLite({ delay: 0 });
    tl
      .to(bg, 0.5, {
        pixi: {
          tint: 0x7d7979, // 蒙板着色，灰色
          ease: Bounce.easeOut
        }
      })
      .to(
        filter,
        0.5,
        {
          // delay: 1, // 延时1秒开始
          sepia: 0.3,
          noise: 0.3,
          scratch: 0.5,
          scratchDensity: 0.3,
          onStart: () => {},
          onComplete: () => {}
        },
        '+=1'
      );
  }

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
   * 剧本时间线
   */
  playScript() {
    const playTimeline = async () => {
      // 第一段对话
      // await this.Script1();
      await this.animateScript1();
    };
    playTimeline();
  }
}
