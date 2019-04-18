import BasicContainer from '../DisplayObjects/BasicContainer/BasicContainer';
import { Text, Texture, Sprite } from 'pixi.js';
import { loader, extras } from 'pixi.js';
import * as assets from '../Constants/AssetsConstants';
import Store from '../Stores/Store';
import { TweenMax, TimelineLite, Bounce, Power4 } from 'gsap/TweenMax';
// eslint-disable-next-line
import { PixiPlugin } from 'gsap/PixiPlugin';
import 'pixi-sound';

/**
 * Loader Screen
 * 播放
 * @exports loaderScreen
 * @extends BasicContainer
 */

export default class loaderScreen extends BasicContainer {
  constructor() {
    super();
    this.loader = loader;
    this.res = {};
    this.active = false;
    this.progress = 0;
    this.scaleX = this.scaleY = 0;
    // 从 FBI Warning 开始
    this.exec();
  }

  /*
   * 执行动画
   * 未命名为 play(),以后可能有冲突
   */
  exec() {
    // eslint-disable-next-line lines-around-comment
    /**
     * 执行顺序
     * 1.FBI页面
     * initLoadingAssets()
     * 2.loading 页面
     * onAssetsLoaded()
     * 3.加载APP资源
     * loadAppAssets()
     */

    this.initLoadingAssets();
  }

  /*
   * 显示 FBI warning
   * 同时加载初始化页面所需资源
   */
  initLoadingAssets() {
    // 初始化
    const { initCanvasWidth, initCanvasHeight } = Store.getState().Renderer;

    // FBI Warning
    const FBI = Sprite.fromImage(assets.LoadingAssets[0]);
    FBI.name = 'FBI';
    FBI.width = initCanvasWidth;
    FBI.height = initCanvasHeight;
    this.addChild(FBI);
    // 加载首屏资源
    loader
      .add(assets.LoadingAssets)
      // .add('talk',assets.LoadingJson[0])
      // .add('wine', assets.LoadingJson[1])
      .add(assets.LoadingJson)
      // 注意 this 的指向，以下两种方式均可
      // .load(this.onAssetsLoaded.bind(this))
      // .load(() => {this.onAssetsLoaded()})
      .load();
    loader.onComplete.once(() => {
      TweenMax.to(
        // FBI屏幕从不透明到透明
        FBI,
        2,
        // { pixi: { alpha: 0.2, ease: Power4.easeIn } },
        {
          pixi: { alpha: 0.3, ease: Power4.easeOut },
          onUpdate: () => {
            // console.log(FBI.alpha);
          },
          onComplete: () => {
            // 切换到loading 页面
            this.onAssetsLoaded();
          }
        }
      );
    });
  }

  /*
   * load complete 后更新 BG
   */
  onAssetsLoaded() {
    // loading 页面全体精灵初始化
    this.res = loader.resources;
    const { initCanvasWidth, initCanvasHeight } = Store.getState().Renderer;

    // 切换背景图
    let FBI = this.getChildByName('FBI');

    const loadingbg = new Sprite(this.res[assets.path + 'stage.jpg'].texture);
    const zoom = loadingbg.texture.height / 250;
    loadingbg.name = 'loadingbg';
    loadingbg.width = initCanvasWidth;
    loadingbg.height = initCanvasHeight;
    // 在原比例基础上，再次缩放 Y 轴
    loadingbg.scale.y *= zoom;
    // 计算原图与初始设备之间的比例
    this.scaleX = initCanvasWidth / loadingbg.texture.width;
    this.scaleY = initCanvasHeight / loadingbg.texture.height * zoom;

    // loadingbg.anchor.set(0.5)
    this.addChild(loadingbg);
    // 释放FBI
    this.removeChild(FBI);
    FBI.destroy();

    // 在背景图上测量绝对位置，再乘以缩放比，计算 monalisa 相对位置
    const monalisa = new Sprite(
      this.res[assets.path + 'Sporty_Mona_Lisa-1.jpg'].texture
    );
    monalisa.alpha = 0.8;
    monalisa.width = 100 * this.scaleX;
    monalisa.height = 130 * this.scaleY;

    monalisa.anchor.set(1);
    monalisa.x = 40 * this.scaleX;
    monalisa.y = 235 * this.scaleY;
    monalisa.scale.x *= -1;
    this.addChild(monalisa);

    /*
    // 泡泡是monalisa的子节点，monalisa原点(0,0)的坐标(501,0)
    // (160,200)是泡泡的预期位置，X坐标要计算一下，是负坐标
    // 不用管 monalisa.scale.x *= -1 的翻转，PIXI自动处理
    let bubbleTexture = Texture.fromFrame('talk-5.png')
    const Bubble = new Sprite(bubbleTexture)
    Bubble.anchor.set(1, 1)

    // (501-160) = 341
    Bubble.x = -341
    Bubble.y = 200

    // Bubble.scale.x *= -1
    monalisa.addChild(Bubble)
    */
    let bubbleTexture = Texture.fromFrame('talk-5.png');
    const Bubble = new Sprite(bubbleTexture);
    Bubble.anchor.set(1, 1);
    Bubble.width = monalisa.width * 1.4;
    Bubble.height = monalisa.height;
    Bubble.x = 110 * this.scaleX;
    Bubble.y = 140 * this.scaleY;
    Bubble.scale.x *= -1;
    // Bubble.rotation = Math.PI / 180 * 20
    Bubble.name = 'bubble';
    this.addChild(Bubble);

    // Add text as a child of the Sprite
    const text = new Text('来啦老妹\n就等你了！', {
      fontFamily: 'Arial',
      fontSize: 40,
      fontStyle: 'italic',
      // fontVariant
      fontWeight: 'bold',
      lineHeight: 22,
      align: 'center',
      fill: ['#ffffff', '#00ff99'], // gradient
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

    /*
     * text是 Bubble 的子精灵
     * 绝对位置是相对于 Bubble.texture
     * 即 Bubble 原图中测量出来的
     * Bubble原图的 (0,0)原点位置定义在 Bubble.anchor上
     */
    text.scale.x *= -1;
    text.anchor.set(0, 1);
    text.width = Bubble.texture.width * 0.89;
    text.x = -10;
    text.y = -Bubble.texture.height / 2 + 30;
    text.name = 'talk';
    // 加入泡泡sprite时，会自动缩放
    // 尺寸、位置都要按父容器原图来测量，注意父容器的原点
    Bubble.addChild(text);
    this.playScript();
  }
  // 剧本时间线
  playScript() {
    const talk = this.getChildByName('bubble').getChildByName('talk');
    // 定义动画的时间线
    const tl = new TimelineLite({ delay: 1 });
    tl
      .to(talk, 0.5, {
        pixi: {
          rotation: 90, // 文字垂直
          ease: Bounce.easeIn
        },
        onUpdate: () => {},
        onComplete: () => {}
      })
      .to(talk, 0.5, {
        pixi: {
          x: '+=1000', // 文字飞出
          ease: Bounce.easeOut
        },
        onUpdate: () => {},
        onComplete: () => {
          talk.text = ' 本案例\n仅供学习交流\n请勿用于商业用途';
          talk.rotation = 0;
          talk.x = 0;
        }
      })
      .to(
        talk,
        0.5, // 1秒后文字垂直
        {
          pixi: {
            rotation: 90,
            ease: Bounce.easeOut
          },
          onUpdate: () => {},
          onComplete: () => {}
        },
        '+=1.5'
      )
      .to(talk, 0.5, {
        pixi: {
          x: '+=1000', // 飞出后，显示 party 文字
          ease: Bounce.easeOut
        },
        onUpdate: () => {},
        onComplete: () => {
          talk.text = '\n盖茨比在大纽腰\n轰·趴\n精彩马上开始';
          talk.rotation = 0;
          talk.x = 0;
          // loader 重新赋值,加载整个APP资源
          this.loadAppAssets();
          loader.load();
        }
      });
  }

  /*
   * loader 重新赋值,加载整个APP资源
   */
  loadAppAssets() {
    const { initCanvasWidth } = Store.getState().Renderer;

    loader
      .add(assets.AppAssets)
      .add(assets.VideoAssets)
      .add(assets.AppJson);
    loader.onProgress.add(this.onUpdate.bind(this));
    loader.onComplete.add(this.onComplete.bind(this));

    // 定义红酒杯
    // create an array to store the textures
    let textures = [],
      i;
    for (i = 18; i < 53; i++) {
      let framekey = 'out-' + i + '.png';
      let texture = Texture.fromFrame(framekey);
      textures.push(texture);
    }

    // create a wine AnimatedSprite
    const wine = new extras.AnimatedSprite(textures);
    wine.anchor.set(1);
    wine.width = 20 * this.scaleX;
    wine.height = 25 * this.scaleY;
    wine.animationSpeed = 0.1;
    wine.name = 'wine';

    // 定义进度条
    let bar01 = new Sprite(this.res[assets.path + 'loadingbar01.png'].texture);
    let bar02 = new Sprite(this.res[assets.path + 'loadingbar02.png'].texture);
    bar01.anchor.set(0);
    bar01.x = 130 * this.scaleX; // initCanvasWidth / 2
    bar01.y = 220 * this.scaleY; // (initCanvasHeight/2 + 20)//
    bar01.height = 20 * this.scaleY;
    bar01.width = initCanvasWidth * 0.6;
    bar01.name = 'bar01';

    bar02.anchor.set(0, 0);
    bar02.height = bar01.height * 0.85;
    bar02.width = 0;
    bar02.name = 'bar02';
    // 设置起始位置
    bar02.x = wine.x = bar01.x;
    bar02.y = wine.y = bar01.y;
    wine.play();
    this.addChild(wine);
    this.addChild(bar01);
    this.addChild(bar02);
  }

  // eslint-disable-next-line
  onUpdate(loader, resources) {
    this.progress = ~~loader.progress / 100;
    this.getChildByName('bar02').width =
      this.getChildByName('bar01').width * this.progress;
    this.getChildByName('wine').x =
      this.getChildByName('bar02').x + this.getChildByName('bar02').width;
  }

  /* APP 资源加载完成后执行 */
  onComplete() {
    let sound =
      loader.resources['/assets/sounds/monalisa/American Money_80.mp3'].sound;
    sound.loop = true;
    sound.volume = 0.1;
    sound.play();
    setTimeout(() => {
      this.done();
    }, 1000);
  }
}
