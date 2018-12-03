import invariant from 'fbjs/lib/invariant'
import * as PIXI from 'pixi.js'
import React, { useEffect, useContext } from 'react'
import { Context } from '../stage/provider'

export function useTick(fn) {
  const app = useContext(Context)
  invariant(
    app instanceof PIXI.Application,
    'No Context found with `%s`. Make sure to wrap component with `%s`',
    'PIXI.Application',
    'AppProvider'
  )

  useEffect(() => {
    app.ticker.add(fn)
    return () => app.ticker.remove(fn)
  }, [])
}
