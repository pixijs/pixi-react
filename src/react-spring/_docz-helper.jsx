import React, { useState, useCallback } from 'react'
import { Texture } from 'pixi.js'
import { Sprite, Container, useApp } from '../../docz-rp'

export const TransformOnClick = ({ children, update }) => {
  const [props, setProps] = useState(update())

  const app = useApp()

  const { width, height } = app.renderer.view
  const click = useCallback(() => setProps(update()), [])

  return (
    <Container interactive={true} pointerup={click}>
      <Sprite width={width} height={height} texture={Texture.EMPTY} />
      {children(props)}
    </Container>
  )
}
