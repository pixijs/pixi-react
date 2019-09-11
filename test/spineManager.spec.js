import spineManager from '../src/utils/spineManager';
import spineResource from './__fixtures__/spine';

jest.mock('pixi.js', () => {
  const Container = {
    children: [],
    addChildAt: jest.fn()
  };

  class Spine {
    constructor(resource) {
      this.resource = resource;
      this.slotContainers = [];
      this.resource.findSlotIndex = name => this.resource.slots.findIndex(slot => slot.name === name);
    }

    get spineData() {
      return this.resource;
    }

    set spineData(data) {
      this.resource = data;
    }
    destroy() {}
    get skeleton() {
      return {
        skin: this.resource.skins[0],
        slots: this.resource.slots.map(slot => {
          this.slotContainers.push(Container);
          return {
            setAttachment: jest.fn(),
            data: slot
          };
        }),
        setSkin: jest.fn(),
        setSkinByName: jest.fn(),
        setToSetupPose: jest.fn(),
        setSlotsToSetupPose: jest.fn()
      };
    }
    get state() {
      const tracks = [];
      return {
        tracks,
        addAnimation: (track, name, loop, delay) => {
          tracks.push({ animation: { name } });
          return { track, name, loop, delay };
        },
        setAnimation: (track, name, loop, delay) => {
          tracks.push({ animation: { name } });
          return { track, name, loop, delay };
        },
        addListener: jest.fn().mockReturnValue({})
      };
    }
  }

  return {
    spine: {
      Spine
    }
  };
});

describe('render', () => {
  let spine;

  beforeEach(() => {
    jest.resetAllMocks();
    spine = spineManager(spineResource.spineData);
    spine.init();
  });

  test('init spineManager', () => {
    const spineObj = spine.setSkinByName('default');
    const skeleton = spine.getSkeleton();
    const spy1 = jest.spyOn(skeleton, 'setSkin');
    const spy2 = jest.spyOn(skeleton, 'setSlotsToSetupPose');
    const spy3 = jest.spyOn(skeleton, 'setSkinByName');
    const spy4 = jest.spyOn(skeleton, 'setSlotsToSetupPose');
    expect(spy1).toHaveBeenCalledWith(null);
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalledWith('default');
    expect(spy4).toHaveBeenCalled();
  });

  test('add animation to the queue', () => {
    spine.addAnimation('running', 0, false, false, 0, 12, 1, 12);
    const animation = spine.getAnimationByName('running');
    expect(animation).toEqual({
      animationEnd: 12,
      delay: 0,
      loop: false,
      queue: false,
      timeScale: 1,
      track: 0,
      trackTime: 12
    });
  });

  test('play animation adding it to the queue', () => {
    const state = spine.getAnimationState();
    const spy = jest.spyOn(state, 'addAnimation');
    spine.addAnimation('running', 0, false, true, 0, 12, 1, 12);
    const addedTrack = spine.playAnimation('running');
    expect(addedTrack.animationEnd).toEqual(12);
    expect(addedTrack.timeScale).toEqual(1);
    expect(addedTrack.trackTime).toEqual(12);
    expect(spy).toHaveBeenCalledWith(0, 'running', false, 0);
  });

  test('play animation replacing the current playing one', () => {
    const state = spine.getAnimationState();
    const spy = jest.spyOn(state, 'setAnimation');
    spine.addAnimation('running', 0, false, false, 0, 12, 1, 12);
    const addedTrack = spine.playAnimation('running');
    expect(addedTrack.animationEnd).toEqual(12);
    expect(addedTrack.timeScale).toEqual(1);
    expect(addedTrack.trackTime).toEqual(12);
    expect(spy).toHaveBeenCalledWith(0, 'running', false, 0);
  });

  test('add native spine listeners to the track', () => {
    const state = spine.getAnimationState();
    const spy = jest.spyOn(state, 'addListener');
    const callback = jest.fn();
    spine.addTrackEvent('start', callback, 'running');
    expect(spy).toHaveBeenCalledWith({ start: callback });
  });

  test('add custom spine listeners to the track', () => {
    const state = spine.getAnimationState();
    const spy = jest.spyOn(state, 'addListener');
    const callback = jest.fn();
    spine.addTrackEvent('onBeforeAnimation', callback, 'running');
    expect(spy).not.toHaveBeenCalledWith({ onBeforeAnimation: callback });
  });

  test('play set animation speed to 1', () => {
    const spy = jest.spyOn(spine, 'setSpeed');
    spine.play();
    expect(spy).toHaveBeenCalledWith(1);
  });

  test('move animation to specific time', () => {
    const spineObj = spine.getSpineObject();
    spine.addAnimation('running', 0, false, true, 0, 12, 1, 12);
    spine.goToTime('running', 2);
    const { trackTime } = spine.getAnimationByName('running');
    expect(trackTime).toEqual(2);
  });

  test('set animation speed (timeScale) to zero', () => {
    const spineObj = spine.getSpineObject();
    spine.addAnimation('running', 0, false, true, 0, 12, 1, 12);
    spine.stopAnimation('running');
    const { timeScale } = spine.getAnimationByName('running');
    expect(timeScale).toEqual(0);
  });

  test('set animation point where it ends (animationEnd)', () => {
    const spineObj = spine.getSpineObject();
    spine.addAnimation('running', 0, false, true, 0, 12, 1, 12);
    spine.setAnimationEndTime('running', 11);
    const { animationEnd } = spine.getAnimationByName('running');
    expect(animationEnd).toEqual(11);
  });

  test('set animation speed (timeScale)', () => {
    const setSpeed = spine.getSpineObject();

    spine.setSpeed(3);
    const state = spine.getAnimationState();
    expect(state.timeScale).toEqual(3);
  });

  test('get a slot from the skeleton by name', () => {
    const slot = spine.getSlotsByName('testSlot');
    expect(slot.data).toEqual(spineResource.spineData.slots[0]);
  });

  test('call the addChild method from the container part of the slot', () => {
    const spineObj = spine.getSpineObject();
    const slot = spine.getSlotPixiContainer('testSlot');
    const spy = jest.spyOn(slot, 'addChildAt');
    spine.decorateSlotByName('testSlot', { x: 1, y: 2 });
    expect(spy).toHaveBeenCalledWith({ x: 1, y: 2 }, 0);
  });

  test('call the setAttachment method of the spine slot found by name', () => {
    const spineObj = spine.getSpineObject();
    const slot = spine.getSlotsByName('testSlot');
    spine.setSlotAttachment('testSlot', 'xxx');
    const spy = jest.spyOn(slot, 'setAttachment');
    expect(spy).toHaveBeenCalled();
  });

  test('call the spine destroy method', () => {
    const spineObj = spine.getSpineObject();
    const spy = jest.spyOn(spineObj, 'destroy');
    spine.destroy();
    expect(spy).toHaveBeenCalled();
  });

  test('call the same methods called in the init', () => {
    const spineObj = spine.setSkinByName('secondskin');
    const skeleton = spine.getSkeleton();
    const spy1 = jest.spyOn(skeleton, 'setSkin');
    const spy2 = jest.spyOn(skeleton, 'setSlotsToSetupPose');
    const spy3 = jest.spyOn(skeleton, 'setSkinByName');
    const spy4 = jest.spyOn(skeleton, 'setSlotsToSetupPose');

    expect(spy1).toHaveBeenCalledWith(null);
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalledWith('secondskin');
    expect(spy4).toHaveBeenCalled();
  });

  test('get a track added to the animation state ', () => {
    spine.addAnimation('running', 0, false, true, 0, 12, 1, 12);
    const addedTrack = spine.playAnimation('running');
    const track = spine.findTrackByName('running');
    expect(track).toEqual({
      animation: {
        name: 'running'
      }
    });
  });
});
