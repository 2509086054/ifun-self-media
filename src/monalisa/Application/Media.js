import { Application } from 'pixi.js';
import Store from '../Stores/Store';
import { resize, updateInitCanvas } from '../Stores/RendererStore';

/**
 * PIXI Application with hooks into a Store
 *
 * Manages main animation loop
 *
 * @exports Media
 * @extends Application
 */
export default class Media extends Application {
  constructor(element, options = {}) {
    super(options);

    // 在 htmlElement 容器的第一个子节点上创建 canvas
    document.getElementById(element).appendChild(this.view);
    this.view.id = 'Media'; // 设置 canvas ID
    const { forceRotation } = Store.getState().Renderer;
    // 保存原始画布尺寸
    // 初始尺寸，由 new 传入
    if (
      forceRotation &&
      (window.orientation === 0 || window.orientation === 180)
    ) {
      Store.dispatch(
        updateInitCanvas({
          width: this._options.height,
          height: this._options.width
        })
      );
    } else {
      Store.dispatch(
        updateInitCanvas({
          width: this._options.width,
          height: this._options.height
        })
      );
    }

    // 监听 resize
    window.addEventListener('resize', this.resizeHandler.bind(this));
    this.resizeHandler();
  }

  /**
   * 保存原始画布尺寸
   * 紧跟 new Game 后调用
   * 构造函数中加入横屏控制后，已废弃
   * @return {null}
   */
  updateInitCanvas() {
    // 初始尺寸，由 new 传入
    const { width, height } = this._options;
    Store.dispatch(
      updateInitCanvas({
        width: width,
        height: height
      })
    );
  }
  resizeHandler() {
    // 渲染器resize成新的尺寸
    this.renderer.resize(window.innerWidth, window.innerHeight);
    // 更新状态
    Store.dispatch(resize());
    console.log(
      Store.getState().Renderer.newCanvasWidth +
        '==resizeHandler2.newCanvasWidth'
    );
  }
}
