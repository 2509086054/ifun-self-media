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
 * https://rishabhp.github.io/bideo.js/
 */

export class Bideo {
  // eslint-disable-next-line lines-around-comment
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
    if (this.options.resize) {
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
          // this.videoEl.setAttribute(key,val)
        }
      }
      this.videoEl.appendChild(source);
    });

    this.options.playButton.onclick = () => {
      this.options.pauseButton.style.display = 'inline-block';
      this.options.playButton.style.display = 'none';
      this.videoEl.play();
      this.videoEl.style.zIndex = 99;
    };

    this.options.pauseButton.onclick = () => {
      this.options.pauseButton.style.display = 'none';
      this.options.playButton.style.display = 'inline-block';
      this.videoEl.pause();
    };
  }
  resizeHandler() {}
  resizeHandler1() {
    // IE/Edge still don't support object-fit: cover
    if ('object-fit' in document.body.style) return;

    // Video's intrinsic dimensions
    var w = this.videoEl.videoWidth,
      h = this.videoEl.videoHeight;

    // Intrinsic ratio
    // Will be more than 1 if W > H and less if H > W
    var videoRatio = (w / h).toFixed(2);

    // Get the container DOM element and its styles
    //
    // Also calculate the min dimensions required (this will be
    // the container dimentions)
    var container = this.options.container,
      containerStyles = global.getComputedStyle(container),
      minW = parseInt(containerStyles.getPropertyValue('width')),
      minH = parseInt(containerStyles.getPropertyValue('height'));

    // If !border-box then add paddings to width and height
    if (containerStyles.getPropertyValue('box-sizing') !== 'border-box') {
      var paddingTop = containerStyles.getPropertyValue('padding-top'),
        paddingBottom = containerStyles.getPropertyValue('padding-bottom'),
        paddingLeft = containerStyles.getPropertyValue('padding-left'),
        paddingRight = containerStyles.getPropertyValue('padding-right');

      paddingTop = parseInt(paddingTop);
      paddingBottom = parseInt(paddingBottom);
      paddingLeft = parseInt(paddingLeft);
      paddingRight = parseInt(paddingRight);

      minW += paddingLeft + paddingRight;
      minH += paddingTop + paddingBottom;
    }

    // What's the min:intrinsic dimensions
    //
    // The idea is to get which of the container dimension
    // has a higher value when compared with the equivalents
    // of the video. Imagine a 1200x700 container and
    // 1000x500 video. Then in order to find the right balance
    // and do minimum scaling, we have to find the dimension
    // with higher ratio.
    //
    // Ex: 1200/1000 = 1.2 and 700/500 = 1.4 - So it is best to
    // scale 500 to 700 and then calculate what should be the
    // right width. If we scale 1000 to 1200 then the height
    // will become 600 proportionately.
    var widthRatio = minW / w;
    var heightRatio = minH / h;

    // Whichever ratio is more, the scaling
    // has to be done over that dimension
    if (widthRatio > heightRatio) {
      var new_width = minW;
      var new_height = Math.ceil(new_width / videoRatio);
    } else {
      new_height = minH;
      new_width = Math.ceil(new_height * videoRatio);
    }

    this.videoEl.style.width = new_height + 'px';
    this.videoEl.style.height = new_width + 'px';
  }
}
