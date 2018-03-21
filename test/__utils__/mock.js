import { resolve, relative } from 'path'

const isObject = obj => Object.prototype.toString.call(obj) === '[object Object]'

export const mockToSpy = path => {
  path = resolve(module.parent.filename, path)
  path = relative(module.filename, path)

  let original, mocked

  original = require.requireActual(path)
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
