import invariant from 'fbjs/lib/invariant'
import { Application } from 'pixi.js'
import React, { useEffect, useContext, useRef } from 'react'
import { Context } from '../stage/provider'

function useTick(callback, enabled = true) {
  const app = useContext(Context)
  invariant(
    app instanceof Application,
    'No Context found with `%s`. Make sure to wrap component with `%s`',
    'PIXI.Application',
    'AppProvider'
  )

  const savedRef = useRef(null)

  useEffect(() => {
    savedRef.current = callback
  }, [callback])

  useEffect(() => {
    if (enabled) {
      const tick = delta => savedRef.current(delta)
      app.ticker.add(tick)

      return () => {
        app.ticker.remove(tick)
      }
    }
  }, [enabled])
}

export { useTick }
