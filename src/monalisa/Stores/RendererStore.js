// template : https://github.com/erikras/ducks-modular-redux
import { canvasWidth, canvasHeight } from '../Constants/AppConstants';
const newCanvas = () => ({
  // 设备最新变化后的尺寸
  newDeviceWidth: window.innerWidth,
  newDeviceHeight: window.innerHeight,
  resolution: window.devicePixelRatio,
  stageCenter: { x: window.innerWidth / 2, y: window.innerHeight / 2 }
});

const defaultState = {
  // 设备初始尺寸，由 new Application 传入
  initDeviceWidth: 0,
  initDeviceHeight: 0,
  // Canvas 强制横屏，旋转开关
  forceRotation: true,
  // 缩放比
  SacleX: 1,
  SacleY: 1,
  ...newCanvas()
};

const RESIZE = 'seed/animation/RESIZE';
const InitDevice = 'seed/animation/InitDevice';

export default (state = defaultState, action = {}) => {
  switch (action.type) {
    case RESIZE:
      return {
        ...state,
        ...newCanvas()
      };
    case InitDevice:
      return {
        ...state,
        ...newCanvas(),
        initDeviceWidth: action.value.width,
        initDeviceHeight: action.value.height,
        SacleX: action.value.width / canvasWidth,
        SacleY: action.value.height / canvasHeight
      };
    default:
      return state;
  }
};

export const resize = () => ({ type: RESIZE });
export const updateInitDevice = value => ({ type: InitDevice, value });
