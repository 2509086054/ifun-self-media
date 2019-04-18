import './index.html';
import { Bideo } from './utils';

const options = {
  // Video element
  videoEl: document.querySelector('#background_video'),

  // Container element
  container: document.querySelector('body'),

  // Resize
  resize: true,

  // Array of objects containing the src and type
  // of different video formats to add
  mediaSrc: [
    {
      src: '/assets/bideo/night.mp4'
      // type: 'video/mp4'
      // src: '/assets/video/monalisa/test2.mp4'
    }
  ],
  playButton: document.querySelector('#play'),
  pauseButton: document.querySelector('#pause')
};

const bv = new Bideo(options);
bv.oncanplay = () => {
  // document.querySelector('#video_cover').style.display = 'none'
  // document.querySelector('#background_video').style.zindex = '99'
};
