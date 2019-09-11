import isNil from 'lodash/isNil'

const nativeEvents = ['complete', 'start', 'end', 'dispose', 'interrupted']

const spineManager = spineData => {
  if (!spineData || !PIXI.spine) return
  const obj = {}
  const animations = {}
  let spineSkeleton
  let animationState
  let spineObj
  let events
  let skin
  let mixes

  const setDefaultSkin = () => {
    const { defaultSkin, skins } = spineData
    spineSkeleton.setSkinByName(defaultSkin ? defaultSkin.name : skins[0].name)
  }

  const resetSkin = () => {
    spineSkeleton.setSkin(null)
    spineSkeleton.setSlotsToSetupPose()
  }

  const setSkinByName = name => {
    resetSkin()
    if (spineData.findSkin(name)) {
      spineSkeleton.setSkinByName(name)
      spineSkeleton.setSlotsToSetupPose()
    } else {
      console.warn(`Skin not found: ${name}`)
    }
  }

  const setUpSpine = () => {
    spineObj = new PIXI.spine.Spine(spineData)
    spineSkeleton = spineObj.skeleton
    if (skin) {
      setSkinByName(skin)
    } else {
      setDefaultSkin()
    }

    if (mixes) {
      mixes.forEach(({ from, to, time }) => {
        spineObj.stateData.setMix(from, to, time)
      })
    }
  }

  const addEvent = (event, callback, name) => {
    if (nativeEvents.includes(event)) {
      animationState.addListener({
        [event]: callback,
      })
    } else {
      animationState.addListener({
        event: (track, evt) => {
          const { animation } = track
          if (evt.data.name === event && (!name || animation.name === name)) {
            callback.apply(spineObj, [evt, track])
          }
        },
      })
    }
  }

  const setUpEvents = () => {
    if (events && Object.keys(events).length > 0) {
      Object.keys(events).forEach(event => {
        addEvent(event, events[event])
      })
    }
  }

  const setUpAnimations = () => {
    animationState = spineObj.state
    animationState.timeScale = 0
  }

  const getSlotPixiContainer = name => {
    const index = spineData.findSlotIndex(name)
    return spineObj.slotContainers[index]
  }

  const appendToSlot = (name, el) => {
    const slot = getSlotPixiContainer(name)
    const container = slot.children.length ? slot.children[slot.children.length - 1] : slot
    container.addChildAt(el, 0)
  }

  const getAttachmentsBySlotName = name => {
    const index = spineData.findSlotIndex(name)
    return spineSkeleton.skin.attachments[index]
  }

  const removeFromSlot = name => {
    const slot = getSlotPixiContainer(name)
    const container = slot.children.length ? slot.children[slot.children.length - 1] : slot
    if (container.children && container.children.length) {
      container.removeChildAt(0)
    }
  }

  const decorateSlot = options => {
    const { slots } = options
    const arrSlots = Object.keys(slots)
    arrSlots.forEach(slot => {
      removeFromSlot(slot)
      appendToSlot(slot, slots[slot].content)
    })
  }

  const findTrackByName = name => animationState.tracks.find(track => track && track.animation.name === name)

  obj.addAnimation = (name, track = 0, loop = false, queue = false, delay = 0, trackTime, timeScale, animationEnd) => {
    animations[name] = {
      track,
      loop,
      queue,
      delay,
      trackTime,
      timeScale,
      animationEnd,
    }
  }

  obj.playAnimation = name => {
    const { track, loop, queue, delay, trackTime, timeScale, animationEnd } = animations[name]
    const addedTrack = animationState[queue ? 'addAnimation' : 'setAnimation'](track, name, loop, delay)

    if (!isNil(trackTime)) {
      addedTrack.trackTime = trackTime
    }

    if (!isNil(timeScale)) {
      addedTrack.timeScale = timeScale
    }

    if (!isNil(animationEnd)) {
      addedTrack.animationEnd = animationEnd
    }
    return addedTrack
  }

  obj.addTrackEvent = (event, callback, name) => {
    addEvent(event, callback, name)
  }

  obj.play = () => {
    obj.setSpeed(1)
  }

  obj.goToTime = (name, time) => {
    animations[name].trackTime = time
    const track = findTrackByName(name)
    if (track) track.trackTime = time
  }

  obj.stopAnimation = name => {
    obj.setAnimationSpeed(name, 0)
  }

  obj.setAnimationSpeed = (name, timeScale) => {
    animations[name].timeScale = timeScale
    const track = findTrackByName(name)
    if (track) track.timeScale = timeScale
  }

  obj.setAnimationEndTime = (name, time) => {
    animations[name].animationEnd = time
    const track = findTrackByName(name)
    if (track) track.animationEnd = time
  }

  obj.setSpeed = timeScale => {
    animationState.timeScale = timeScale
  }

  obj.getSlotsByName = name => spineSkeleton.slots.find(slot => slot.data.name === name)

  obj.decorateSlotByName = (name, content) => {
    const slots = []
    slots[name] = { content }
    decorateSlot({ slots })
  }

  obj.setSlotAttachment = (slotName, attachmentName) => {
    const slotAttachments = getAttachmentsBySlotName(slotName)
    obj.getSlotsByName(slotName).setAttachment(slotAttachments[attachmentName])
  }

  obj.init = (options = {}) => {
    events = options.events || {}
    skin = options.skin
    mixes = options.mixes
    setUpSpine()
    setUpAnimations()
    setUpEvents()
  }

  obj.destroy = () => {
    spineObj.destroy()
  }

  obj.getSpineObject = () => spineObj

  obj.getAnimationByName = name => animations[name]

  obj.getSlotPixiContainer = getSlotPixiContainer

  obj.setSkinByName = setSkinByName

  obj.findTrackByName = findTrackByName

  obj.getAnimationState = () => animationState

  obj.getSkeleton = () => spineSkeleton

  return obj
}

export default spineManager
