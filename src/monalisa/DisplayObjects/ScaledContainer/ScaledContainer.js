import { Container, Point } from 'pixi.js';
import Store from '../../Stores/Store';

/**
 * ScaledContainer
 *
 * A DisplayObjectContainer which attempts to scale and best-fit into the
 * window size dispatched from the RendererStore
 *
 * @extends Container
 * @exports ScaledContainer
 */
export default class ScaledContainer extends Container {
  // eslint-disable-next-line lines-around-comment
  /**
   * Set target size
   * @param  {Number} target_w width
   * @param  {number} target_h height
   * @return {null}
   */
  constructor(...args) {
    super(...args);

    this.resizeHandler();
    // 异步调用方法
    this.done = () => {};
    // TODO : init resize should come from renderer
    // 使用箭头函数，将 this 指向调用 subscribe() 的Container实例
    // 否则 resizeHandler()中的 this 指向错误
    Store.subscribe(() => {
      this.resizeHandler();
    });
  }

  // 异步函数，由主程序 entry 调用
  onLoaded(callback = () => {}) {
    this.done = callback;
  }

  /**
   * Scales and positions Container to best-fit to target dimensions
   * @return {null}
   */
  resizeHandler() {
    let {
      initDeviceWidth,
      initDeviceHeight,
      newDeviceWidth,
      newDeviceHeight,
      forceRotation
    } = Store.getState().Renderer;
    // console.log(Store.getState().Renderer.newDeviceWidth + '==resizeHandler===========');
    // 旋转判断
    let newWidth = newDeviceWidth;
    let newHeight = newDeviceHeight;
    // if (window.orientation === 90 || window.orientation === -90) {
    if (
      forceRotation &&
      (window.orientation === 0 || window.orientation === 180)
    ) {
      newWidth = newDeviceHeight;
      newHeight = newDeviceWidth;
    }

    // 计算缩放比
    const Xratio = newWidth / initDeviceWidth;
    const Yratio = newHeight / initDeviceHeight;
    let scale = new Point(Xratio, Yratio);

    // 容器新的起点为左上角(0,0)
    let offsetX = newWidth - initDeviceWidth * Xratio;
    let offsetY = newHeight - initDeviceHeight * Yratio;
    this.position.x = offsetX;
    this.position.y = offsetY;
    // console.log(neweight / 2)
    // console.log(initDeviceHeight / 2 * Yratio);
    // 根容器自适应新缩放比例
    // 内部的 Sprite 同比例缩放，会有一定的失真
    this.scale = scale;

    // 强制横屏
    if (
      forceRotation &&
      (window.orientation === 0 || window.orientation === 180)
    ) {
      // 翻转 90度
      this.rotation = Math.PI / 2;
      // 容器新的起点左下角(screenRect.width,0)
      // newHeight 已经赋值为 screenRect.width
      this.position.x = newHeight;
    } else {
      this.rotation = 0;
      // this.position.y = 0
    }
  }
}
