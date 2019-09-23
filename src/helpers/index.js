const _DEG2RAD = Math.PI / 180

export const isFunction = (...args) => args.every(v => typeof v === 'function')

export const isEmpty = value => {
  return typeof value === 'undefined' || value === null
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

export const not = boolFn => (...args) => !boolFn(...args)

export const runningInBrowser = () => typeof window !== 'undefined'

export const unassign = (obj, keys) => {
  const target = Object.assign({}, obj)
  keys.forEach(key => {
    delete target[key]
  })
  return target
}

export const pick = (obj, keys) => {
  var res = {}
  if (typeof keys === 'string') {
    if (keys in obj) {
      res[keys] = obj[keys]
    }
    return res
  }

  var len = keys.length
  var idx = -1

  while (++idx < len) {
    var key = keys[idx]
    if (key in obj) {
      res[key] = obj[key]
    }
  }
  return res
}

export const degreesToRadians = value => {
  return typeof value === 'string' && value.charAt(1) === '='
    ? value.substr(0, 2) + parseFloat(value.substr(2)) * _DEG2RAD
    : value * _DEG2RAD
}

export const splitAndTrim = (string, separator) => {
  return string
    ? string.split(separator).map(item => {
        return item.trim()
      })
    : []
}

export const isBooleanString = value => {
  return value === 'true' || value === 'false'
}

export const convertToCamelCased = value => {
  return value.replace(/-([a-z])/g, g => {
    return g[1].toUpperCase()
  })
}

export const containsAny = (selectorText, ors) => {
  return selectorText ? ors.some(x => selectorText.indexOf(x) >= 0) : false
}

export const containsAll = (selectorText, ors) => {
  return selectorText ? ors.every(x => selectorText.indexOf(x) >= 0) : false
}

export const lcFirst = value => {
  return value.charAt(0).toLowerCase() + value.substring(1)
}

export const sortProps = (obj, fn) => {
  return Object.entries(obj)
    .sort(fn)
    .reduce(
      (_sortedObj, [k, v]) => ({
        ..._sortedObj,
        [k]: v,
      }),
      {}
    )
}

const mergeValues = (target, source) => {
  if (isObject(target) && isObject(source)) {
    return mergeObjects(target, source)
  }
  if (source === undefined) {
    return target
  }
  return source
}

const mergeObjects = (target, source) => {
  Object.keys(source).forEach(key => {
    const sourceValue = source[key]
    const targetValue = target[key]
    target[key] = mergeValues(targetValue, sourceValue)
  })
  return target
}

export const deepmerge = (target, sources) => {
  sources.forEach(source => {
    return mergeValues(target, source)
  })
  return target
}
