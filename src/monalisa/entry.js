import '../index.html';
import Media from './Application/Media';
import ScaledContainer from './DisplayObjects/ScaledContainer/ScaledContainer';
import * as Screens from './Screens';
// import Store from './Stores/Store'

const app = new Media('container', {
  width: window.innerWidth,
  height: window.innerHeight,
  preserveDrawingBuffer: true

  /* devicePixelRatio: window.devicePixelRatio || 1,
    antialias: true, // 消除锯齿
    transparent: false, // 背景不透明
    resolution: 2, // 像素设置
    roundPixels: true,
    */
  // backgroundColor: 0xffffff //0x1099bb // light blue
});

const root = new ScaledContainer();
app.stage.addChild(root);
app.stop();

const loaderScr = new Screens.loaderScreen();
root.addChild(loaderScr);

/** */
const fifth = new Screens.fifthScreen();
fifth.app = app;
loaderScr.onLoaded(() => {
  fifth.init();
  root.removeChild(loaderScr);
  root.addChild(fifth);
  // 销毁 loaderScr
  loaderScr.destroy();
});
fifth.onLoaded(() => {});

/**
// 定义loader的done()函数
const first = new Screens.firstScreen();
loaderScr.onLoaded(() => {
  // first = new firstScreen()
  first.init();
  root.removeChild(loaderScr);
  root.addChild(first);
  first.play();
  // 销毁 loaderScr
  loaderScr.destroy();
});

// 定义 first 的done()函数
const second = new Screens.secondScreen();
first.onLoaded(() => {
  // second = new secondScreen()
  second.init();
  root.addChild(second);
  root.removeChild(first);
  first.destroy();
});

// 定义 second 的done()函数
const third = new Screens.thirdScreen();
second.onLoaded(() => {
  // second = new secondScreen()
  third.init();
  root.addChild(third);
  root.removeChild(second);
  second.destroy();
});

// 定义 third 的done()函数
const fourth = new Screens.fourthScreen();
third.onLoaded(() => {
  fourth.init();
  root.removeChild(third);
  root.addChild(fourth);
  third.destroy();
});

// 定义 fourth 的done()函数
const fifth = new Screens.fifthScreen();
fourth.onLoaded(() => {
  fifth.init();
  root.removeChild(fourth);
  root.addChild(fifth);
  fourth.destroy();
});
*/
app.start();
// Listen for animate update
app.ticker.add(delta => {
  // rotate the container!
  // use delta to create frame-independent transform
  // console.log(delta + '=APP.ticker')
  /*
   * the renderer is rerendered appropriately at 60fps internally
   * by PIXI.Application in v4
     app.renderer.render(root)
   */
});
