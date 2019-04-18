export const checkScreen = (w, h, cw, ch) => w !== cw || h !== ch;
export const randomRange = (m, x) => Math.random() * (x - m) + m;

/* moves an item in an array to either the front or back
 * 改变容器Container中某个Sprite对象的 zOrder
 * 暂未使用pixi的display和layer来改变 zOrder
 * 改造自：
 * https://github.com/pixijs/pixi-display/wiki 最后栏目 Hipster bring-to-front
 *
 */
export const PopTo = isFront => items => item => {
  const copy = items.concat(); // 得到原数组的copy
  const ret = copy.splice(copy.indexOf(item), 1); // 删除指定item后的数组
  return isFront ? copy.concat(ret) : ret.concat(copy);
};
export const PopToFront = PopTo(true);
export const PopToBack = PopTo(false);

/*
//move item to back
this.children = PopToBack (this.children) (target)
//move item to front
this.children = PopToFront (this.children) (target)
// example:
TVScreen.name = 'somename'
const TVScreen = this.getChildByName('somename')
this.children = PopToFront(this.children)(TVScreen)
*/

/**
 * 全屏 Video 播放类
 * 解决wechat 不同设备之间 video 标签之间的差异
 */

export class Bideo {
  /**
   * Set option
   * H5 video 元素
   * @param  {HTMLVideoElement} videoEl
   * 是否resize
   * @param  {boolean} resize
   * H5 video source 元素
   * @param {array} mediaSrc[{string} src, {string} type]
   * H5 video 的父容器
   * @param {HTMLElement} container
   * 是否是移动设备
   * @param {boolean} isMobile
   */
  constructor(options = {}) {
    // If not set then set to an empty object
    this.options = options = options || {};
    // Video element
    this.videoEl = options.videoEl;
    // 预留函数，供外部定义 video 元素的事件行为
    // 在 this.initVideoElement() 中绑定到 video元素上
    this.oncanplay = () => {};
    this.onended = () => {};
    // 初始化 VideoElement
    this.initVideoElement();
    // 监听系统 resize 事件
    if (this.opt.resize) {
      window.addEventListener('resize', this.resizeHandler.bind(this));
    }
  }

  initVideoElement() {
    // Meta data event
    // 已开始加载视频元数据时，重设 resize
    this.videoEl.onloadedmetadata = () => {
      this.resizeHandler();
    };

    // 视频已准备好开始播放：
    this.videoEl.oncanplay = () => {
      this.oncanplay();
    };
    this.videoEl.onended = () => {
      this.onended();
    };

    // Create `source` for video
    // 为了能够兼容各种浏览器对不同媒体类型的支持，
    // 我们可以用多个 < source > 元素来提供多个不同的媒体类型
    this.options.mediaSrc.forEach(srcOb => {
      let key, val;
      let source = document.createElement('source');
      // Set all the attribute key=val supplied in `src` option
      for (key in srcOb) {
        if (srcOb.hasOwnProperty(key)) {
          val = srcOb[key];
          source.setAttribute(key, val);
        }
      }
      this.videoEl.appendChild(source);
    });
  }
  resizeHandler() {}
}
