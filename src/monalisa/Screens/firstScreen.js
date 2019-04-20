import BasicContainer from '../DisplayObjects/BasicContainer/BasicContainer';
import { Text, TextStyle, Texture, Sprite, Graphics } from 'pixi.js';
import { loader, extras } from 'pixi.js';
import { VideoAssets, path } from '../Constants/AssetsConstants';
import Store from '../Stores/Store';
import { TweenLite } from 'gsap/TweenMax';
// import {OldFilmFilter} from 'pixi-filters'
import { OldFilmFilter } from '@pixi/filter-old-film';

/**
 * first Screen
 * 播放盖茨比视频
 * @exports firstScreen
 * @extends BasicContainer
 */

export default class firstScreen extends BasicContainer {
  constructor() {
    super();
    this.Device = {
      initDeviceWidth: 0,
      initDeviceHeight: 0
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
      lineHeight: 30,
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
  }
  init() {
    // 初始化
    this.res = loader.resources;
    this.Device = Store.getState().Renderer;
    // 定义切换video，使用 AnimatedSprite
    let videoTextures = [];
    let time = 200;
    VideoAssets.forEach(element => {
      let texture = this.res[element].texture;
      videoTextures.push({ texture, time });
    });
    // video
    this.scaleX =
      this.Device.initDeviceWidth /
      videoTextures[videoTextures.length - 1].texture.width;
    this.scaleY =
      this.Device.initDeviceHeight /
      videoTextures[videoTextures.length - 1].texture.height;

    const video = new extras.AnimatedSprite(videoTextures);
    video.name = 'video';
    video.width = this.Device.initDeviceWidth;
    video.height = this.Device.initDeviceHeight;
    video.animationSpeed = 3.5;
    video.loop = false;
    video.onFrameChange = () => {
      // console.log('====' + videoSprite.currentFrame)
    };
    this.addChild(video);
  }
  play() {
    const video = this.getChildByName('video');
    video.play();

    // 泡泡
    const bubbleTexture = Texture.fromFrame('tips-0.png');
    const Bubble = new Sprite(bubbleTexture);
    Bubble.anchor.set(0, 1);
    Bubble.width = video.width / 4;
    Bubble.height = video.height / 3;
    Bubble.x = 300 * this.scaleX; // video原图绝对位置
    Bubble.y = 170 * this.scaleY;
    Bubble.name = 'bubble';
    // Add text as a child of the Sprite
    const text = new Text('整一口呗\n老妹！', this.textStyle);
    text.anchor.set(0, 1);
    text.width = Bubble.texture.width * 0.8;
    text.height = Bubble.texture.height * 0.5;
    text.x = 50;
    text.y = -Bubble.texture.height / 2 + 80;
    text.name = 'talk';
    Bubble.addChild(text);

    video.onComplete = () => {
      this.addChild(Bubble);
      this.OldFilmFilter();
      // this.exec()
    };
  }

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
      // 以下设置后，vignetting 从0-1，屏幕体现圆形消失效果
      vignettingBlur: 0,
      vignettingAlpha: 1,
      vignetting: 0
    });
    this.getChildByName('video').filters = [filter];
    // 加入动态效果
    filter.seed = Math.random();
    this.active = true;
    requestAnimationFrame(this.animate.bind(this));
    // 滤镜效果渐变
    TweenLite.to(filter, 0.5, {
      delay: 1, // 延时1秒开始
      sepia: 0.3,
      noise: 0.3,
      scratch: 0.5,
      scratchDensity: 0.3,
      onUpdate: () => {},
      onComplete: () => {
        this.addButton();
      }
    });
  }

  /**
   * 加入互动按钮，在执行旧电影效果后
   */
  addButton() {
    // 加入按钮互动
    const yesButton = new Sprite(Texture.fromFrame('wine-glass.png'));
    const noButton = new Sprite(Texture.fromFrame('wine-glass_no.png'));
    yesButton.anchor.set(0.5);
    noButton.anchor.set(0.5);
    yesButton.width = noButton.width = this.getChildByName('video').width / 6;
    yesButton.height = noButton.height =
      this.getChildByName('video').height / 6;
    yesButton.x = 160 * this.scaleX; // video原图绝对位置
    yesButton.y = 220 * this.scaleY;
    noButton.x = 330 * this.scaleX;
    noButton.y = 220 * this.scaleY;
    yesButton.name = 'yesbutton';
    noButton.name = 'nobutton';
    yesButton.interactive = noButton.interactive = true;
    yesButton.buttonMode = noButton.buttonMode = true;
    const yestext = new Text('放飞自我', this.textStyle);
    const notext = new Text('霸气拒绝', this.textStyle);
    yestext.anchor.set(0.5);
    notext.anchor.set(0.5);
    yestext.width = notext.width = yesButton.texture.width; //* 0.8
    yestext.height = notext.height = yesButton.texture.height * 0.5;
    yestext.y = notext.y = yesButton.texture.height / 2 + 30;
    // 按钮中加入文字
    yesButton.addChild(yestext);
    noButton.addChild(notext);
    // 容器中加入按钮
    this.addChild(yesButton);
    this.addChild(noButton);
    // 定义按钮事件
    yesButton.on('pointertap', () => {
      this.onPointerTap_yes();
    });
    noButton.on('pointertap', () => {
      this.onPointerTap_no();
    });
  }

  // 点击Yes按钮，video圆形消失，切换场景
  onPointerTap_yes() {
    const filter = this.getChildByName('video').filters[0];
    // 滤镜效果渐变
    TweenLite.to(filter, 0.5, {
      vignetting: 1, // 设置晕影效果的半径
      vignettingAlpha: 1, // 不透明，体现圆形消失效果
      // ease: Bounce.easeOut,
      onComplete: () => {
        this.active = false;
        this.done();
      }
    });
  }
  // 点击NO按钮，提示错误
  onPointerTap_no() {
    // NO按钮不允许重复点击
    this.getChildByName('nobutton').interactive = false;
    // 添加透明蒙板
    const graphics = new Graphics();
    // draw a rounded rectangle
    graphics.lineStyle(2, 0xff00ff, 1);
    graphics.beginFill(0xffffff, 0.8);
    graphics.drawRoundedRect(
      20 * this.scaleX,
      20 * this.scaleY,
      this.Device.initDeviceWidth * 0.9,
      this.Device.initDeviceHeight * 0.85,
      16
    );
    graphics.endFill();
    graphics.name = 'graphics';
    this.addChild(graphics);
    // 提示错误信息
    const monalisa = new Sprite(
      this.res[path + 'Sporty_Mona_Lisa-2.png'].texture
    );
    monalisa.alpha = 0.8;
    monalisa.width = 100 * this.scaleX;
    monalisa.height = 130 * this.scaleY;
    monalisa.anchor.set(1);
    monalisa.x = 40 * this.scaleX;
    monalisa.y = 235 * this.scaleY;
    monalisa.scale.x *= -1;
    monalisa.name = 'monalisa';
    this.addChild(monalisa);

    let bubbleTexture = Texture.fromFrame('talk-3.png');
    const Bubble = new Sprite(bubbleTexture);
    Bubble.anchor.set(1, 1);
    Bubble.width = monalisa.width * 1.8;
    Bubble.height = monalisa.height * 1.1;
    Bubble.x = 110 * this.scaleX;
    Bubble.y = 140 * this.scaleY;
    Bubble.scale.x *= -1;
    // Bubble.rotation = Math.PI / 180 * 20
    Bubble.name = 'bubble';
    this.addChild(Bubble);

    const errmsg = new Text('老妹🍏\n按套路出牌\n好不好😘😘', this.textStyle);
    errmsg.scale.x *= -1;
    errmsg.anchor.set(0, 1);
    errmsg.width = Bubble.texture.width * 0.89;
    errmsg.height = Bubble.texture.height * 0.5;
    errmsg.x = -10;
    errmsg.y = -Bubble.texture.height / 2 + 30;
    // 加入泡泡sprite时，会自动缩放
    // 尺寸、位置都要按父容器原图来测量，注意父容器的原点
    Bubble.addChild(errmsg);
    // 错误信息停留X秒后，自动消失
    TweenLite.to(this, 0.5, {
      delay: 1,
      onComplete: () => {
        // NO按钮允许点击
        this.getChildByName('nobutton').interactive = true;
        this.removeChild(graphics);
        this.removeChild(monalisa);
        this.removeChild(Bubble);
      }
    });
  }

  /**
   * Main animation loop, updates animation store
   * @return {null}
   */
  animate() {
    if (this.active) {
      requestAnimationFrame(this.animate.bind(this));
      this.getChildByName('video').filters[0].seed = Math.random();
    }
  }

  /**
   * 已封装为secondScreen.js

  exec() {

    // 切换背景图
    let video = this.getChildByName('video')

    const loadingbg = new Sprite(
      this.res[path + 'stage.jpg'].texture
    )
    const zoom = loadingbg.texture.height/250
    loadingbg.name = 'loadingbg'
    loadingbg.width = this.Device.initDeviceWidth
    loadingbg.height = this.Device.initDeviceHeight
    // 在原比例基础上，再次缩放 Y 轴
    loadingbg.scale.y *= zoom
    // 计算原图与初始设备之间的比例
    this.scaleX = this.Device.initDeviceWidth / loadingbg.texture.width
    this.scaleY = this.Device.initDeviceHeight / loadingbg.texture.height * zoom

    // loadingbg.anchor.set(0.5)
    this.addChild(loadingbg)
    // 释放video
    this.removeChild(video)
    video.destroy()
  }
  */
}
