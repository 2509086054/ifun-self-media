// template : https://github.com/erikras/ducks-modular-redux
import { canvasWidth, canvasHeight } from '../Constants/AppConstants';
const newCanvas = () => ({
  newCanvasWidth: window.innerWidth,
  newCanvasHeight: window.innerHeight,
  resolution: window.devicePixelRatio,
  stageCenter: { x: window.innerWidth / 2, y: window.innerHeight / 2 }
});

const defaultState = {
  // 画布初始尺寸，由 new Application 传入
  initCanvasWidth: 0,
  initCanvasHeight: 0,
  // Canvas 强制横屏，旋转开关
  forceRotation: true,
  // 缩放比
  SacleX: 1,
  SacleY: 1,
  ...newCanvas()
};

const RESIZE = 'seed/animation/RESIZE';
const InitCanvas = 'seed/animation/InitCanvas';

export default (state = defaultState, action = {}) => {
  switch (action.type) {
    case RESIZE:
      return {
        ...state,
        ...newCanvas()
      };
    case InitCanvas:
      return {
        ...state,
        ...newCanvas(),
        initCanvasWidth: action.value.width,
        initCanvasHeight: action.value.height,
        SacleX: action.value.width / canvasWidth,
        SacleY: action.value.height / canvasHeight
      };
    default:
      return state;
  }
};

export const resize = () => ({ type: RESIZE });
export const updateInitCanvas = value => ({ type: InitCanvas, value });
