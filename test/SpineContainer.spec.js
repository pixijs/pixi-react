import * as PIXI from 'pixi.js';
import React from 'react';
import renderer from 'react-test-renderer';
import { Container } from '../src';
import { createElement, TYPES, TYPES_INJECTED, PixiComponent } from '../src/utils/element';
import SpineContext from '../src/components/spineComponent/SpineContext';
import SpineContainer from '../src/components/SpineContainer';
import { Animation, Bone, Slot, SlotContent } from '../src/components/spineComponent';
import spineData from './__fixtures__/spine';

jest.mock('pixi.js', () => {
    class Spine {
        constructor(spineData) {
            this.spineData = spineData;
        }
    }

    return {
        spine: {
            Spine
        }
    };
});

const spineManagerInterfaceMock = {
    addAnimation: jest.fn(),
    init: jest.fn(),
    setSpeed: jest.fn(),
    playAnimation: jest.fn(),
    getAnimationByName: jest.fn(),
    setSkinByName: jest.fn(),
    setSkeletonData: jest.fn(),
    addTrackEvent: jest.fn(),
    goToTime: jest.fn(),
    setAnimationSpeed: jest.fn(),
    setAnimationEndTime: jest.fn(),
    getSlotPixiContainer: jest.fn(),
    decorateSlotByName: jest.fn(),
    setSlotAttachment: jest.fn(),
    getSpineObject: jest.fn()
};

describe('SpineContainer', () => {
    let spineManagerMock;
    const makeSpineManagerMock = mock => {
        return () => {
            return mock;
        };
    };

    const spineProps = {
        spineData,
        autoPlay: true,
        width: 200,
        height: 100,
        events: [],
        skin: '',
        speed: 1,
        mixes: [],
        animations: []
    };

    beforeEach(() => {
        jest.resetAllMocks();
        spineManagerMock = {
            ...spineManagerInterfaceMock
        };
    });

    test('check init is called if proper resource is passed', () => {
        const spy = jest.spyOn(spineManagerMock, 'init');
        const element = renderer.create(
            <SpineContext.Provider value={{ spineManager: makeSpineManagerMock(spineManagerMock) }}>
                <SpineContainer {...spineProps} />
            </SpineContext.Provider>
        );
        expect(spy).toHaveBeenCalledWith({ autoPlay: true, events: [], height: 100, mixes: [], skin: '', width: 200 });
    });

    test('check init is not called if proper resource is not passedd', () => {
        const spy = jest.spyOn(spineManagerMock, 'init');

        const element = renderer.create(
            <SpineContext.Provider value={{ spineManager: makeSpineManagerMock(false) }}>
                <SpineContainer {...spineProps} />
            </SpineContext.Provider>
        );
        expect(spy).not.toHaveBeenCalled();
    });

    test('check that all animations are looped through and get their names', () => {
        const spy = jest.spyOn(spineManagerMock, 'getAnimationByName');
        const props = Object.assign({}, spineProps, {
            animations: ['active', 'pressed']
        });

        const element = renderer.create(
            <SpineContext.Provider value={{ spineManager: makeSpineManagerMock(spineManagerMock) }}>
                <SpineContainer {...props} />
            </SpineContext.Provider>
        );
        expect(spy).toHaveBeenNthCalledWith(1, 'active');
        expect(spy).toHaveBeenNthCalledWith(2, 'pressed');
    });

    test('check that all animations are added and the playAnimation method is called', () => {
        const spy1 = jest.spyOn(spineManagerMock, 'addAnimation');
        const spy2 = jest.spyOn(spineManagerMock, 'playAnimation');

        const props = Object.assign({}, spineProps, {
            animations: ['active', 'pressed', 'pressed']
        });

        const element = renderer.create(
            <SpineContext.Provider value={{ spineManager: makeSpineManagerMock(spineManagerMock) }}>
                <SpineContainer {...props} />
            </SpineContext.Provider>
        );
        expect(spy1).toHaveBeenNthCalledWith(1, 'active');
        expect(spy1).toHaveBeenNthCalledWith(2, 'pressed');
        expect(spy2).toHaveBeenNthCalledWith(1, 'active');
        expect(spy2).toHaveBeenNthCalledWith(2, 'pressed');
    });

    test('check that setSkinByName is called with the skin props passed', () => {
        const spy1 = jest.spyOn(spineManagerMock, 'setSkinByName');
        const props = Object.assign({}, spineProps, {
            skin: 'glowingSkin'
        });
        const element = renderer.create(
            <SpineContext.Provider value={{ spineManager: makeSpineManagerMock(spineManagerMock) }}>
                <SpineContainer {...spineProps} />
            </SpineContext.Provider>
        );
        element.update(
            <SpineContext.Provider value={{ spineManager: makeSpineManagerMock(spineManagerMock) }}>
                <SpineContainer {...props} />
            </SpineContext.Provider>
        );
        expect(spy1).toHaveBeenCalledWith('glowingSkin');
    });

    test('check that if only new data is passed we are not adding going again through the animations', () => {
        const spy1 = jest.spyOn(spineManagerMock, 'addAnimation');
        const spy2 = jest.spyOn(spineManagerMock, 'playAnimation');

        const props = Object.assign({}, spineProps, {
            skeletonData: {}
        });
        const element = renderer.create(
            <SpineContext.Provider value={{ spineManager: makeSpineManagerMock(spineManagerMock) }}>
                <SpineContainer {...spineProps} />
            </SpineContext.Provider>
        );
        element.update(
            <SpineContext.Provider value={{ spineManager: makeSpineManagerMock(spineManagerMock) }}>
                <SpineContainer {...props} />
            </SpineContext.Provider>
        );

        expect(spy1).not.toHaveBeenCalled();
        expect(spy2).not.toHaveBeenCalled();
    });
});

describe('Animation', () => {
    const animationProps = {
        name: 'active',
        play: false,
        trackTime: 2,
        timeScale: 1,
        animationEnd: 2,
        events: {},
        track: 1,
        loop: false,
        queue: false,
        delay: 0
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('check that the compound component call the spineManager animation queing methods', () => {
        const spy1 = jest.spyOn(spineManagerInterfaceMock, 'addAnimation');
        const spy2 = jest.spyOn(spineManagerInterfaceMock, 'playAnimation');

        const props = Object.assign({}, animationProps, {
            play: true
        });
        const element = renderer.create(
            <SpineContext.Provider value={{ spineElement: spineManagerInterfaceMock }}>
                <Animation {...props} />
            </SpineContext.Provider>
        );
        expect(spy1).toHaveBeenCalledWith('active', 1, false, false, 0, 2, 1, 2);
        expect(spy2).toHaveBeenCalledWith('active');
        expect(spy1).toHaveBeenCalledTimes(1);
        expect(spy2).toHaveBeenCalledTimes(1);
    });

    test('check that addTrackEvent adds calls the correct event listeners to the animation timelines', () => {
        const spy1 = jest.spyOn(spineManagerInterfaceMock, 'addTrackEvent');
        const onBeforeStart = () => {};
        const props = Object.assign({}, animationProps, {
            events: {
                onBeforeStart
            }
        });
        const element = renderer.create(
            <SpineContext.Provider value={{ spineElement: spineManagerInterfaceMock }}>
                <Animation {...props} />
            </SpineContext.Provider>
        );
        expect(spy1).toHaveBeenCalledWith('onBeforeStart', onBeforeStart, 'active');
        expect(spy1).toHaveBeenCalledTimes(1);
    });

    test('check changing the animation name prop', () => {
        const spy1 = jest.spyOn(spineManagerInterfaceMock, 'addAnimation');
        const props = Object.assign({}, animationProps, {
            name: 'pressed'
        });
        const element = renderer.create(
            <SpineContext.Provider value={{ spineElement: spineManagerInterfaceMock }}>
                <Animation {...animationProps} />
            </SpineContext.Provider>
        );
        element.update(
            <SpineContext.Provider value={{ spineElement: spineManagerInterfaceMock }}>
                <Animation {...props} />
            </SpineContext.Provider>
        );
        expect(spy1).toHaveBeenLastCalledWith('pressed', 1, false, false, 0, 2, 1, 2);
        expect(spy1).toHaveBeenCalledTimes(2);
    });

    test('check changing the animation play prop', () => {
        const spy1 = jest.spyOn(spineManagerInterfaceMock, 'playAnimation');
        const props = Object.assign({}, animationProps, {
            play: true
        });
        const element = renderer.create(
            <SpineContext.Provider value={{ spineElement: spineManagerInterfaceMock }}>
                <Animation {...animationProps} />
            </SpineContext.Provider>
        );
        element.update(
            <SpineContext.Provider value={{ spineElement: spineManagerInterfaceMock }}>
                <Animation {...props} />
            </SpineContext.Provider>
        );
        expect(spy1).toHaveBeenLastCalledWith('active');
        expect(spy1).toHaveBeenCalledTimes(1);
    });

    test('check changing the animation trackTime prop', () => {
        const spy1 = jest.spyOn(spineManagerInterfaceMock, 'goToTime');
        const props = Object.assign({}, animationProps, {
            trackTime: 1.3
        });
        const element = renderer.create(
            <SpineContext.Provider value={{ spineElement: spineManagerInterfaceMock }}>
                <Animation {...animationProps} />
            </SpineContext.Provider>
        );
        element.update(
            <SpineContext.Provider value={{ spineElement: spineManagerInterfaceMock }}>
                <Animation {...props} />
            </SpineContext.Provider>
        );
        expect(spy1).toHaveBeenLastCalledWith('active', 1.3);
        expect(spy1).toHaveBeenCalledTimes(1);
    });

    test('check changing the animation timeScale prop', () => {
        const spy1 = jest.spyOn(spineManagerInterfaceMock, 'setAnimationSpeed');
        const props = Object.assign({}, animationProps, {
            timeScale: 0.5
        });
        const element = renderer.create(
            <SpineContext.Provider value={{ spineElement: spineManagerInterfaceMock }}>
                <Animation {...animationProps} />
            </SpineContext.Provider>
        );
        element.update(
            <SpineContext.Provider value={{ spineElement: spineManagerInterfaceMock }}>
                <Animation {...props} />
            </SpineContext.Provider>
        );
        expect(spy1).toHaveBeenLastCalledWith('active', 0.5);
        expect(spy1).toHaveBeenCalledTimes(1);
    });

    test('check changing the animation animationEnd prop', () => {
        const spy1 = jest.spyOn(spineManagerInterfaceMock, 'setAnimationEndTime');
        const props = Object.assign({}, animationProps, {
            animationEnd: 0.5
        });
        const element = renderer.create(
            <SpineContext.Provider value={{ spineElement: spineManagerInterfaceMock }}>
                <Animation {...animationProps} />
            </SpineContext.Provider>
        );
        element.update(
            <SpineContext.Provider value={{ spineElement: spineManagerInterfaceMock }}>
                <Animation {...props} />
            </SpineContext.Provider>
        );
        expect(spy1).toHaveBeenLastCalledWith('active', 0.5);
        expect(spy1).toHaveBeenCalledTimes(1);
    });
});

describe('SlotContent', () => {
    const slotContentProps = {
        name: 'txt_tap_anywhere'
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('check that the SlotContent children are added to the slot root container', () => {
        const spy1 = jest.spyOn(spineManagerInterfaceMock, 'getSlotPixiContainer');
        const spy2 = jest.spyOn(spineManagerInterfaceMock, 'decorateSlotByName');

        const element = renderer.create(
            <SpineContext.Provider value={{ spineElement: spineManagerInterfaceMock }}>
                <SlotContent {...slotContentProps}>
                    <Container />
                </SlotContent>
            </SpineContext.Provider>,
            {
                createNodeMock: () => {
                    return <Container />;
                }
            }
        );

        expect(spy1).toHaveBeenLastCalledWith('txt_tap_anywhere');
        expect(spy2).toHaveBeenCalledWith('txt_tap_anywhere', <Container />);
    });

});

describe('Slot', () => {
    const slotProps = {
        name: 'txt_tap_anywhere',
        x: 2
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('check that the Slot compound component is initialized correctly', () => {
        const obj = {};
        const spineObject = {
            skeleton: {
                findSlot: jest.fn().mockReturnValue(obj)
            }
        };
        jest.spyOn(spineManagerInterfaceMock, 'getSpineObject').mockImplementation(() => {
            return spineObject;
        });
        const spy = jest.spyOn(spineObject.skeleton, 'findSlot');
        const element = renderer.create(
            <SpineContext.Provider value={{ spineElement: spineManagerInterfaceMock }}>
                <Slot {...slotProps} />
            </SpineContext.Provider>
        );

        expect(spy).toHaveBeenLastCalledWith('txt_tap_anywhere');
        expect(obj.x).toBe(2);
    });

    test('check changing the attachment prop', () => {
        const obj = {
            setAttachment: jest.fn()
        };
        const spineObject = {
            skeleton: {
                findSlot: jest.fn().mockReturnValue(obj)
            }
        };
        jest.spyOn(spineManagerInterfaceMock, 'getSpineObject').mockImplementation(() => {
            return spineObject;
        });

        const spy1 = jest.spyOn(obj, 'setAttachment');
        const props = Object.assign({}, slotProps, {
            attachment: 'text_attachment'
        });

        const element = renderer.create(
            <SpineContext.Provider value={{ spineElement: spineManagerInterfaceMock }}>
                <Slot {...props} />
            </SpineContext.Provider>
        );

        expect(spy1).toHaveBeenLastCalledWith('text_attachment');
    });
});

describe('Bone', () => {
    const boneProps = {
        name: 'txt_tap_anywhere',
        x: 2
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('check that the Bone compound component is initialized correctly', () => {
        const obj = {
            scale: {}
        };
        const spineObject = {
            skeleton: {
                findBone: jest.fn().mockReturnValue({
                    x: -10,
                    y: -10,
                    scaleX: 1,
                    scaleY: 1,
                    rotation: 10
                })
            }
        };
        jest.spyOn(spineManagerInterfaceMock, 'getSpineObject').mockImplementation(() => {
            return spineObject;
        });
        const spy = jest.spyOn(spineObject.skeleton, 'findBone');
        const element = renderer.create(
            <SpineContext.Provider value={{ spineElement: spineManagerInterfaceMock }}>
                <Bone {...boneProps}>
                    <Container />
                </Bone>
            </SpineContext.Provider>,
            {
                createNodeMock: el => {
                    return obj;
                }
            }
        );
        expect(spy).toHaveBeenCalled();
        expect(obj.y).toBe(10);
        expect(obj.x).toBe(10);
        expect(obj.scale.y).toBe(1);
        expect(obj.scale.x).toBe(1);
        expect(obj.rotation).toBe(10);
    });
});
