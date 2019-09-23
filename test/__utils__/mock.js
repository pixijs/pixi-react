import { resolve, relative } from 'path'

const isObject = obj => Object.prototype.toString.call(obj) === '[object Object]'

export const mockToSpy = path => {
  path = resolve(module.parent.filename, path)
  path = relative(module.filename, path)

  let original, mocked

  original = jest.requireActual(path)
  original = original.default ? original.default : original

  mocked = require(path)
  mocked = mocked.default ? mocked.default : mocked

  const traverse = (orig, mocked) => {
    Object.keys(mocked).forEach(prop => {
      const val = mocked[prop]

      if (typeof val === 'function' && typeof val.mockImplementation === 'function') {
        val.mockImplementation((...args) => orig[prop](...args))
      } else if (isObject(val)) {
        traverse(orig[prop], val)
      }
    })
  }

  return traverse(original, mocked)
}

export const getCall = ins => {
  const r = index => {
    if (Array.isArray(ins.mock.calls[index])) {
      return {
        args: ins.mock.calls[index],
      }
    }
    return ins.mock.calls[index]
  }

  r.all = ins.mock.calls
  r.fn = ins
  return r
}


export const addTestStyleSheet = function(css) {
  var style = document.createElement('style');
  style.id = 'test-stylesheet'
  style.setAttribute('data-styled', true);
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);

  return style.sheet;
};


export const removeTestStyleSheet = function() {
  document.getElementById('test-stylesheet').remove()
};


window.matchMedia = jest.fn().mockImplementation(query => {
  // (max-width:1024px) will be the mediaquery to use to test the mq matching cases
  return {
    matches: query === '(max-width:1024px)' ,
    media: query,
    onchange: null,
    addListener: jest.fn(), 
    removeListener: jest.fn(), 
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
});


export const cssInnerHTML = `
  /* here put the animations...comments are to test that they don't break stuff */
  @keyframes slide-bottom {
    /* starting point of the animation */
    from {
      alpha: 0;
    }
    to {
      alpha: 1;
      y: 590;
    }
  }

  /* here all css classes */
  pixi.x100_y100 {
    x: 100;
    y: 100;
  }


  pixi.x100_y100-important {
    /* important style here */
    x: 300 !important;
    y: 500 !important;
  }

  pixi.yellow {
    fill: #FFFF00 !important;
  }


  pixi.x400 {
    x: 400;
  }

  pixi.rotated {
    y: 150;
    rotation: 60;
  }

  pixi.transition-starting-point {
   transition-property: x, y;
   transition-duration: 1000;
   transition-timing-function: ease-out;
   x: 0;
  }

  pixi.transition-animate {
   x: 500;
   y: 550;
  }

  pixi.from-top-to-bottom {
    animation-name: slide-bottom;
    alpha: 0;
    animation-duration: 1000;
    animation-delay: 1000;
  }

  pixi.from-top-to-bottom-with-mediaquery {
    animation-name: slide-bottom;
    alpha: 0;
    animation-duration: 1000;
    animation-delay: 1000;
  }

  pixi.squared-animation {
    alpha: 0;
    animation-name: squared;
    animation-duration: 2000;
    animation-delay: 2000;
  }

  /* check that even when calling animations with same name as classes it won't break stuff */ 
  pixi.pulsate {
    alpha: 0;
    y: 50;
    animation-name: pulsate;
    animation-duration: 500;
    animation-iteration-count: infinite;
  }

  pixi.clickable {
    x: 500;
    y: 700;
    buttonMode: true;
    interactive: true;
  }

  pixi.scalable {
    y: 650;
    scaleX: 2;
    scaleY: 2;
  }

  pixi.clicked {
    scaleX: 1.2;
    scaleY: 1.2;
  }

  pixi.scalable-animation {
    y: 850;
    x: 450;
    pivotX:0.5;
    pivotY:0.5;
    animation-name: pulsate-scale;
    animation-duration: 500;
    animation-iteration-count: infinite;
  }

  .pixi.x200y200 {
    x: 200;
  }

  .pixi.x200y200 {
    y: 200; 
  }

  .pixi.x300.y300 {
    x: 300;
  }

  .pixi.x300.y300 {
    y: 300; 
  }

  .pixi.x700 {
     x: 500;  
     y: 40;  
  }

  .pixi.x700 {
     x: 700;
  }

  @media (min-width: 1024px) {
    pixi.from-top-to-bottom {
      animation-name: slide-bottom;
      animation-duration: 3000;
    }
  }

  @media (max-width: 1024px) {
    pixi.from-top-to-bottom-with-mediaquery {
      animation-name: slide-bottom;
      animation-duration: 3000;
    }
  }
`;



export const cssObject = {
  '.clickable': {
    buttonMode: 'true',
    interactive: 'true',
    x: '500',
    y: '700'
  },
  '.clicked': {
    scaleX: '1.2',
    scaleY: '1.2'
  },
  '.from-top-to-bottom': {
    alpha: '0',
    animationDelay: '1000',
    animationDuration: '1000',
    animationName: 'slide-bottom'
  },
   '.from-top-to-bottom-with-mediaquery': {
    alpha: '0',
    animationDelay: '1000',
    animationDuration: '1000',
    animationName: 'slide-bottom'
  },
  '.x100_y100': {
    x: '100',
    y: '100'
  },
  '.x100_y100-important': {
    x: '300 !important',
    y: '500 !important'
  },
  '.pulsate': {
    alpha: '0',
    animationDuration: '500',
    animationIterationCount: 'infinite',
    animationName: 'pulsate',
    y: '50'
  },
  '.rotated': {
    rotation: '60',
    y: '150'
  },
  '.scalable': {
    scaleX: '2',
    scaleY: '2',
    y: '650'
  },
  '.scalable-animation': {
    animationDuration: '500',
    animationIterationCount: 'infinite',
    animationName: 'pulsate-scale',
    pivotX: '0.5',
    pivotY: '0.5',
    x: '450',
    y: '850'
  },
  '.squared-animation': {
    alpha: '0',
    animationDelay: '2000',
    animationDuration: '2000',
    animationName: 'squared'
  },
  '.transition-animate': {
    x: '500',
    y: '550'
  },
  '.transition-starting-point': {
    transitionDuration: '1000',
    transitionProperty: 'x, y',
    transitionTimingFunction: 'ease-out',
    x: '0'
  },
  '.x400': {
    x: '400'
  },
  '.yellow': {
    fill: '#FFFF00 !important'
  },
  '.x200y200': {
    x: '200',
    y: '200'
  },
  '.x300.y300': {
    x: '300',
    y: '300'
  },
  '.x700': {
    x: '700',
    y: '40'
  }
};

export const allAnimations = [
  {
    content: `/* starting point of the animation */
    from {
      alpha: 0;
    }
    to {
      alpha: 1;
      y: 590;
    }`,
    rule: 'slide-bottom'
  },
  {
    content: `0% {
      alpha: 1;
      x:0;
    }
    25% {
      x: 400;
    }
    50% {
      y: 400;
    }
    75% {
      x: 0;
    }
    100% {
      y: 0;
    }`,
    rule: 'squared'
  },
  {
    content: `0% {
      alpha: 0;
    }
    
    50% {
      alpha: 1;
    }

    100% {
      alpha: 0;
    }`,
    rule: 'pulsate'
  }
];

