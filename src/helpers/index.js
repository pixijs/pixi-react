export const isFunction = (...args) => {
  return args.reduce((a, b) => a && typeof b === 'function', true)
}

export const isObject = obj => Object.prototype.toString.call(obj) === '[object Object]'

export const hasKey = collection => {
  let coll = collection

  if (!Array.isArray(coll)) {
    if (isObject(collection)) {
      coll = Object.keys(collection)
    } else {
      throw new Error('collection needs to be an Array or Object')
    }
  }

  const index = {}
  coll.forEach(key => {
    index[key] = true
  })

  return key => typeof index[key] !== 'undefined'
}

// See https://github.com/michalochman/react-pixi-fiber/blob/a4dbddbef0ffbf0f563c64d30766ea28222a51ea/src/utils.js#L7
export const not = boolFn => (...args) => !boolFn(...args)

export const runningInBrowser = () => Boolean(window)
