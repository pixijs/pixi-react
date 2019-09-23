import { convertAnimationToTween, convertTransitionToTween } from '../src/cssManager/tweens';

window.TimelineMax = props => {
  return {
    getProps: jest.fn().mockReturnValue(props),
    to: jest.fn(),
    reverse: jest.fn(),
    kill: jest.fn()
  };
};

const baseAnimationProps = {
  steps: {
    0: {
      x: 0,
    },
    50: {
      x: 50,
    },
    100: {
      x: 100,
    },
  },
};

const baseAnimationParams = {
  animationDuration: 1000,
  animationDelay: 1000,
  animationIterationCount: 1,
  animationDirection: 'normal',
  animationTimingFunction: 'linear',
  animationPlayState: 'running',
};


const baseTransitionProps = {
  x: 0,
  y: 0,
}

const baseTransitionParams = {
   transitionProperty: 'x, y',
   transitionDuration: 1000,
   transitionDelay: 1000,
   transitionTimingFunction: 'linear',
}

describe('Tweens with css animations', () => {
  // let animationProps
  // let animationParams

  beforeEach(() => {
    jest.resetAllMocks();


  });
  afterEach(() => {});

  test('that it should convert the cssProps to the proper tween parameters', () => {
    const element = {};
    const animationProps = {
      ...baseAnimationProps,
    };
    const animationParams = {
      ...baseAnimationParams,
    };
    const animationsTimeline = convertAnimationToTween(element, animationProps, animationParams);

    const props = animationsTimeline.getProps();
    expect(props.paused).toEqual(false);
    expect(props.yoyo).toEqual(false);
    expect(props.delay).toEqual(1);
    expect(props.repeat).toEqual(0);
  });
  test('that it should convert animationPlayState:paused to paused: true, animationDirection: alternate to yoyo: true and  animationDirection: infinite to repeat: -1', () => {
    const element = {};
    const animationProps = {
      ...baseAnimationProps,
    };
    const animationParams = {
      ...baseAnimationParams,
      ...{
        animationPlayState: 'paused',
        animationDirection: 'alternate',
        animationIterationCount: 'infinite',
      },
    };
    const animationsTimeline = convertAnimationToTween(element, animationProps, animationParams);

    const props = animationsTimeline.getProps();
    expect(props.yoyo).toEqual(true);
    expect(props.paused).toEqual(true);
    expect(props.repeat).toEqual(-1);
  });

  test('that it should make animationDirection: reverse to call the tween method reverse', () => {
    const element = {};
    const animationProps = {
      ...baseAnimationProps,
    };
    const animationParams = {
      ...baseAnimationParams,
      ...{
        animationPlayState: 'running',
        animationDirection: 'reverse',
      },
    };
    const animationsTimeline = convertAnimationToTween(element, animationProps, animationParams);

    expect(animationsTimeline.reverse).toHaveBeenCalled();
  });

  test('that it should split all animation steps in call to the "to" method of the timeline object', () => {
    const element = {};
    const animationProps = {
      ...baseAnimationProps,
    };
    const animationParams = {
      ...baseAnimationParams,
    };
    const animationsTimeline = convertAnimationToTween(element, animationProps, animationParams);
    // const spy1 = jest.spyOn(animationsTimeline, 'to')
    expect(animationsTimeline.to).toHaveBeenCalledTimes(3);
    expect(animationsTimeline.to).toHaveBeenNthCalledWith(1, {}, 0, { ease: 'linear', pixi: { x: 0 } });
    expect(animationsTimeline.to).toHaveBeenNthCalledWith(2, {}, 0.5, { ease: 'linear', pixi: { x: 50 } });
    expect(animationsTimeline.to).toHaveBeenNthCalledWith(3, {}, 0.5, { ease: 'linear', pixi: { x: 100 } });
  });

  test('that it should split all animation steps in call to the "to" method of the timeline object redistributing correctly the animation time based on the percentages', () => {
    const element = {};
    const animationProps = {
      ...baseAnimationProps,
    };
    const animationParams = {
      ...baseAnimationParams,
      ...{
        animationDuration: 2000,
      },
    };
    const animationsTimeline = convertAnimationToTween(element, animationProps, animationParams);
    // const spy1 = jest.spyOn(animationsTimeline, 'to')
    expect(animationsTimeline.to).toHaveBeenCalledTimes(3);
    expect(animationsTimeline.to).toHaveBeenNthCalledWith(1, {}, 0, { ease: 'linear', pixi: { x: 0 } });
    expect(animationsTimeline.to).toHaveBeenNthCalledWith(2, {}, 1, { ease: 'linear', pixi: { x: 50 } });
    expect(animationsTimeline.to).toHaveBeenNthCalledWith(3, {}, 1, { ease: 'linear', pixi: { x: 100 } });
  });

  test('that it should split all animation steps in call to the "to" method of the timeline object redistributing correctly the animation time based on the percentages', () => {
    const element = {};
    const animationProps = {
      ...baseAnimationProps,
      ...{
        steps: {
          0: {
            x: 0,
          },
          25: {
            x: 25,
          },
          50: {
            x: 50,
          },
          100: {
            x: 100,
          },
        },
      },
    };
    const animationParams = {
      ...baseAnimationParams,
      ...{
        animationDuration: 1500,
      },
    };
    const animationsTimeline = convertAnimationToTween(element, animationProps, animationParams);
    // const spy1 = jest.spyOn(animationsTimeline, 'to')
    expect(animationsTimeline.to).toHaveBeenCalledTimes(4);
    expect(animationsTimeline.to).toHaveBeenNthCalledWith(1, {}, 0, { ease: 'linear', pixi: { x: 0 } });
    expect(animationsTimeline.to).toHaveBeenNthCalledWith(2, {}, 0.375, { ease: 'linear', pixi: { x: 25 } });
    expect(animationsTimeline.to).toHaveBeenNthCalledWith(3, {}, 0.375, { ease: 'linear', pixi: { x: 50 } });
    expect(animationsTimeline.to).toHaveBeenNthCalledWith(4, {}, 0.75, { ease: 'linear', pixi: { x: 100 } });
  });


  test('that it should call the animation kill and the animationEnd call back (if any has passed) once the tween is done ', () => {
    const element = {};
    const animationProps = {
      ...baseAnimationProps,
    };
    const animationParams = {
      ...baseAnimationParams,
    };
    element.animationEnd = jest.fn()
    const animationsTimeline = convertAnimationToTween(element, animationProps, animationParams);
    const props = animationsTimeline.getProps();
    const { onComplete } = props
    onComplete()
    expect(animationsTimeline.kill).toHaveBeenCalled();
    expect(element.animationEnd).toHaveBeenCalled();
  });

  test('that it should call the animation kill and the animationEnd call back (if any has passed) once the tween is done reversely', () => {
    const element = {};
    const animationProps = {
      ...baseAnimationProps,
    };
    const animationParams = {
      ...baseAnimationParams,
      ...{
        animationDirection: 'reverse',
      },
    };
    element.animationEnd = jest.fn()
    const animationsTimeline = convertAnimationToTween(element, animationProps, animationParams);
    const props = animationsTimeline.getProps();
    const { onReverseComplete } = props
    onReverseComplete()
    expect(animationsTimeline.kill).toHaveBeenCalled();
    expect(element.animationEnd).toHaveBeenCalled();
  });
});

describe('Tweens with css transitions', () => {
  beforeEach(() => {
    jest.resetAllMocks();
 

  });
  afterEach(() => {});

  test('that it should convert the cssProps to the proper tween parameters', () => {
    const element = {};
    const transitionProps = {
      ...baseTransitionProps,
    };
    const transitionParams = {
      ...baseTransitionParams,
    };
    const transitionTimeline = convertTransitionToTween(element, transitionProps, transitionParams);
    const props = transitionTimeline.getProps();
    expect(props.delay).toEqual(1);
    expect(props.ease).toEqual('linear');
  });

  test('that it should split all animation steps in call to the "to" method of the timeline object', () => {
    const element = {};
    const transitionProps = {
      ...baseTransitionProps,
    };
    const transitionParams = {
      ...baseTransitionParams,
    };
    const transitionTimeline = convertTransitionToTween(element, transitionProps, transitionParams);
    expect(transitionTimeline.to).toHaveBeenCalledTimes(1);
    expect(transitionTimeline.to).toHaveBeenCalledWith({}, 1, { ease: 'linear', pixi: { x: 0, y: 0 } });
  });

  test('that it should call the animation kill and the transitionEnd call back (if any has passed) once the tween is done', () => {
    const element = {};
    const transitionProps = {
      ...baseTransitionProps,
    };
    const transitionParams = {
      ...baseTransitionParams,
    };
    element.transitionEnd = jest.fn()
    const transitionTimeline = convertTransitionToTween(element, transitionProps, transitionParams);
    const props = transitionTimeline.getProps();
    const { onComplete } = props
    onComplete()
    expect(transitionTimeline.kill).toHaveBeenCalled();
    expect(element.transitionEnd).toHaveBeenCalled();
  });
});
