import { Container } from 'pixi.js';

/**
 * BasicContainer
 * @extends Container
 * @exports BasicContainer
 */
export default class BasicContainer extends Container {
  /**
   * Set 异步调用方法
   * @return {null}
   */
  constructor(...args) {
    super(...args);

    // 异步调用方法
    this.done = () => {};
  }

  // 异步函数，由主程序 entry 调用
  onLoaded(callback = () => {}) {
    this.done = callback;
  }

  destroy() {
    super.destroy();
  }
}
