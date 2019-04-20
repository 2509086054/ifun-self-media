/* 默认的画布尺寸
 * 原始设备尺寸/默认的画布尺寸
 * SacleX = initDeviceWidth / canvasWidth
 * SacleY = initDeviceHeight / canvasHeight
 * 以这个比例尺，计算精灵尺寸
 * 4/2之前，使用背景图原图尺寸做分母，计算缩放比
 * 但每屏的背景图尺寸不统一，缩放比也不统一,
 * 造成同样的精灵在不同屏上有大有小，拉伸不一致
 */
export const canvasWidth = 1920;
export const canvasHeight = 1080;
