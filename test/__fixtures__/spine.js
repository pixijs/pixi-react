export default {
    automationAnimationDisable: false,
    data: {
        skeleton: {
            hash: 'l1N3GV/4V/S9LQeEtl+Kdoa5dKQ', spine: '3.6.53', width: 1, height: 1
        },
        bones: [{ name: 'root' }, { name: 'txt_tap_anywhere', parent: 'root' }],
        slots: [{ name: 'txt_tap_anywhere', bone: 'txt_tap_anywhere', attachment: 'shapes/spacer' }],
        skins: { default: { txt_tap_anywhere: { 'shapes/spacer': { width: 1, height: 1 } } } },
        animations: {
            active: {
                slots: {
                    txt_tap_anywhere: {
                        color: [
                            {
                                time: 0,
                                color: 'ffffff00',
                                curve: [0.25, 0, 0.75, 1]
                            },
                            {
                                time: 0.6667,
                                color: 'ffffffff'
                            }
                        ]
                    }
                }
            },
            pressed: {
                slots: {
                    txt_tap_anywhere: {
                        color: [
                            {
                                time: 0,
                                color: 'ffffffff'
                            },
                            {
                                time: 0.1333,
                                color: 'ffffff00'
                            }
                        ]
                    }
                }
            }
        }
    },
    spineData: {
        animations: {
            animation: {}
        },
        bones: [
            {
                index: 0,
                length: 0,
                name: 'root',
                parent: null,
                rotation: 0,
                scaleX: 1,
                scaleY: 1,
                shearX: 0,
                shearY: 0,
                transformMode: 0,
                x: 0,
                y: 0
            },
            {
                index: 1,
                length: 0,
                name: 'txt_tap_anywhere',
                parent: {
                    index: 0,
                    length: 0,
                    name: 'root',
                    parent: null,
                    rotation: 0,
                    scaleX: 1,
                    scaleY: 1,
                    shearX: 0,
                    shearY: 0,
                    transformMode: 0,
                    x: 0,
                    y: 0
                },
                rotation: 0,
                scaleX: 1,
                scaleY: 1,
                shearX: 0,
                shearY: 0,
                transformMode: 0,
                x: 0,
                y: 0
            }
        ],
        defaultSkin: {
            attachments: [],
            name: 'default'
        },
        events: [],
        findAnimation: jest.fn(() => true),
        findSkin: (name) => {
            return {
                attachments: [],
                name
            }
        },
        ikConstraints: [],
        pathConstraints: [],
        skins: [
            {
                name: 'default',
                attachments: [{name: 'testAttachment'}]
            },
            {
                name: 'secondskin',
                attachments: [{name: 'testAttachment'}]
            }
        ],
        slots: [
            {
                attachment: 'testAttachment',
                boneData: {
                    index: 1,
                    length: 0,
                    name: 'txt_tap_anywhere',
                    parent: {
                        index: 0,
                        length: 0,
                        name: 'root',
                        parent: null,
                        rotation: 0,
                        scaleX: 1,
                        scaleY: 1,
                        shearX: 0,
                        shearY: 0,
                        transformMode: 0,
                        x: 0,
                        y: 0
                    },
                    rotation: 0,
                    scaleX: 1,
                    scaleY: 1,
                    shearX: 0,
                    shearY: 0,
                    transformMode: 0,
                    x: 0,
                    y: 0
                },
                color: {
                    r: 1,
                    g: 1,
                    b: 1,
                    a: 1
                },
                name: 'testSlot'
            }
        ],
        transformConstraints: []
    }
};
