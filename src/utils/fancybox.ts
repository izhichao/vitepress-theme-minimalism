import { nextTick } from 'vue';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

// 查找图像之前最近的标题
const findNearestHeading = (imgElement) => {
  // 获取 img 元素的父节点
  let currentElement = imgElement;
  // 循环向上查找
  while (currentElement && currentElement !== document.body) {
    // 在当前元素的前一个兄弟节点中查找 h1-h6 标签
    let previousSibling = currentElement.previousElementSibling;
    while (previousSibling) {
      if (previousSibling.tagName.match(/^H[1-6]$/)) {
        return previousSibling.textContent.replace(/\u200B/g, '').trim(); // 返回找到的标题内容
      }
      previousSibling = previousSibling.previousElementSibling;
    }
    // 如果没有找到，继续向上一级父节点查找
    currentElement = currentElement.parentElement;
  }

  return '';
};

export const bindFancybox = () => {
  nextTick(async () => {
    const { Fancybox, PanzoomAction } = await import('@fancyapps/ui'); // 采用这种导入方式是为了避免构建报错问题
    const imgs = document.querySelectorAll('.vp-doc img');
    imgs.forEach((img) => {
      const image = img as HTMLImageElement;
      if (!image.hasAttribute('data-fancybox')) {
        image.setAttribute('data-fancybox', 'gallery');
      }
      // 赋予 alt 属性
      if (!image.hasAttribute('alt') || image.getAttribute('alt') === '') {
        const heading = findNearestHeading(image);
        image.setAttribute('alt', heading);
      }
      // 赋予 data-caption 属性以便显示图片标题
      const altString = image.getAttribute('alt') || '';
      image.setAttribute('data-caption', altString);
    });

    Fancybox.bind('[data-fancybox="gallery"]', {
      Hash: false,
      caption: false,
      zoomEffect: false,
      Carousel: {
        Zoomable: {
          Panzoom: {
            clickAction: 'iterateZoom',
            maxScale: 2,
            minScale: 0.8
          }
        },
        Toolbar: {
          display: {
            left: ['counter'],
            middle: ['zoomIn', 'zoomOut', 'toggle1to1', 'rotateCCW', 'rotateCW', 'flipX', 'flipY', 'reset'],
            right: ['autoplay', 'thumbs', 'close']
          }
        },
        Thumbs: {
          type: 'classic',
          showOnStart: false
        }
      }
    });
  });
};

export const destroyFancybox = async () => {
  const { Fancybox } = await import('@fancyapps/ui');
  Fancybox.destroy();
};