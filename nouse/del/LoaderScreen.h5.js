import BasicContainer from '../DisplayObjects/BasicContainer/BasicContainer';
import { Text, TextStyle, Texture, Sprite } from 'pixi.js';
import { loader, extras } from 'pixi.js';
import * as assets from '../Constants/AssetsConstants';
import Store from '../Stores/Store';
import { resize } from '../Stores/RendererStore';
import { PopToFront } from '../utils';

/**
 * Loader Screen
 * 播放
 * @exports LoaderScreen
 * @extends BasicContainer
 */

export default class LoaderScreen extends BasicContainer {
  constructor() {
    super();
    this.loader = loader;
    this.res = {};
    this.active = false;
    this.progress = 0;
    this.scaleX = this.scaleY = 0;
    this.setup();
  }

  /*
   * 初始化函数
   */
  setup() {
    // 初始化
    const { initDeviceWidth, initDeviceHeight } = Store.getState().Renderer;

    // FBI Warning
    let FBI = Sprite.fromImage('/assets/images/monalisa/Loading/FBI.png');

    // 设置和画布同样的尺寸
    FBI.width = initDeviceWidth;
    FBI.height = initDeviceHeight;
    this.addChild(FBI);
    // loading 本页的 Assets
    loader
      .add(assets.LoadingAssets)
      .add('talk', assets.LoadingJson[1])
      .add('loading', assets.LoadingJson[0])
      // 注意 this 的指向，以下两种方式均可
      // .load(this.onAssetsLoaded.bind(this))
      // .load(() => {this.onAssetsLoaded()})
      .load(() => {
        // FBI 再停留1秒后，转入 load complete 后更新BG
        setTimeout(() => {
          this.onAssetsLoaded();
        }, 1);
      });
  }

  /*
   * load complete 后更新 BG
   */
  onAssetsLoaded() {
    // 初始化
    this.res = loader.resources;
    const { initDeviceWidth, initDeviceHeight } = Store.getState().Renderer;

    // 创建背景
    const bg = new Sprite(
      this.res['/assets/images/monalisa/Loading/bg.jpg'].texture
    );

    // 设置和画布同样的尺寸
    bg.width = initDeviceWidth;
    bg.height = initDeviceHeight;
    bg.name = 'bg';
    this.addChild(bg);

    // 计算原图与初始设备之间的比例
    this.scaleX = initDeviceWidth / bg.texture.width;
    this.scaleY = initDeviceHeight / bg.texture.height;

    // 计算 monalisa 位置
    const monalisa = new Sprite(
      this.res['/assets/images/monalisa/Loading/Sporty_Mona_Lisa-1.jpg'].texture
    );
    monalisa.alpha = 0.8;
    monalisa.width = monalisa.texture.width * this.scaleX * 0.6;
    monalisa.height = monalisa.texture.height * this.scaleY * 0.6;
    monalisa.anchor.set(0.5);
    monalisa.x = initDeviceWidth / 2;
    monalisa.y = initDeviceHeight / 2 + 100 * this.scaleY;
    monalisa.scale.x *= -1;
    this.addChild(monalisa);

    // 第1种计算 对话框 位置方式
    // 父容器是this
    // (700,450) 是 bg 上的坐标位置
    let bubbleTexture = Texture.fromFrame('talk-5.png');
    const Bubble = new Sprite(bubbleTexture);
    Bubble.anchor.set(1, 1);
    Bubble.width = monalisa.width * 1.8;
    Bubble.height = monalisa.height;
    Bubble.x = 700 * this.scaleX;
    Bubble.y = 450 * this.scaleY;
    Bubble.scale.x *= -1;
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
     * 位置是相对于 Bubble.texture
     * 即 Bubble 原图中测量出来的
     * Bubble原图的 (0,0)原点位置定义在 Bubble.anchor上
     */
    text.scale.x *= -1;
    text.anchor.set(0.5);
    text.width = Bubble.texture.width * 0.89;
    text.x = -Bubble.texture.width / 2 + 10;
    text.y = -Bubble.texture.height / 2 - 10;
    // 加入泡泡sprite时，会自动缩放
    // 尺寸、位置都要按父容器原图来测量，注意父容器的原点
    Bubble.addChild(text);

    // 第2种计算 对话框 位置方式
    // 父容器是 monalisa
    bubbleTexture = Texture.fromFrame('tips-0.png');
    const Bubble2 = new Sprite(bubbleTexture);
    Bubble2.anchor.set(0, 1);
    // 父容器 X 镜像，所以子精灵的X也要翻转
    Bubble2.x = -130 * -1;
    Bubble2.y = -150;
    // 本例中，子精灵已经随父容器翻转了，不用再次镜像
    // Bubble2.scale.x *= -1
    monalisa.addChild(Bubble2);

    // play按钮 加入 Bubble2 里
    const playTexture = Texture.fromFrame('play.png');
    const play = new Sprite(playTexture);
    play.anchor.set(0.5);
    play.width = Bubble2.texture.width / 2;
    play.height = Bubble2.texture.height / 2;
    play.x = 209;
    play.y = -187;
    play.interactive = true;
    play.buttonMode = true;
    play.on('pointertap', () => {
      this.onPlayVideo();
    });
    Bubble2.addChild(play);
  }
  onPlayVideo() {
    // const videoTexture = Texture.fromVideo('/assets/images/monalisa/Loading/test2.mp4')
    // 设置 H5 Video 标签属性
    const videoH5 = document.getElementById('video');
    videoH5.setAttribute('controls', 'false');
    videoH5.setAttribute('preload', 'auto');
    // // videoH5.setAttribute('width',this.width)
    // // videoH5.setAttribute('height', this.height)
    // // videoH5.setAttribute('poster','images.jpg')  // 视频封面
    videoH5.setAttribute('x-webkit-airplay', 'allow');
    videoH5.setAttribute(
      'webkit-playsinline',
      ''
    ); /* 这个属性是ios 10中设置可以让视频在小窗内播放，也就是不是全屏播放*/
    videoH5.setAttribute('playsinline', ''); // IOS微信浏览器支持小窗内播放
    // videoH5.setAttribute('x5-video-player-type','h5')  // 启用H5播放器,是wechat安卓版特性
    // videoH5.setAttribute('x5-video-player-fullscreen','true')// 全屏设置，设置为 true 是防止横屏
    videoH5.setAttribute('x5-video-orientation', 'landscape'); // 播放器的方向 landscape横屏，默认值为portraint竖屏
    videoH5.setAttribute('crossorigin', '');
    videoH5.style.setProperty('object-position', '0 100%');
    videoH5.style.setProperty('object-fit', 'contain');
    // videoH5.style.setProperty('display', 'block')

    videoH5.setAttribute('src', '/assets/images/monalisa/Loading/test2.mp4');
    videoH5.onended = () => {
      window.alert('=============');
      videoH5.style.setProperty('display', 'none');
      const TVScreen = this.getChildByName('bg');
      this.children = PopToFront(this.children)(TVScreen);
      Store.dispatch(resize());
    };

    const videoTexture = Texture.fromVideo(videoH5);
    const videoSprite = new Sprite(videoTexture);
    videoSprite.name = 'video';
    videoSprite.width = this.width;
    videoSprite.height = this.height;
    this.addChild(videoSprite);
  }
}
