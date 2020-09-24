import React, { useState, useCallback } from 'react'
import { Container, Sprite } from '../../docz-rp'
import { Texture } from 'pixi.js';

export const TransformOnClick = ({ children, update }) => {
  const [props, setProps] = useState(update())
  const click = useCallback(() => setProps(update()), [])
  const [canvas] = useState(() => document.querySelector(`[data-testid="live-preview"] canvas`))
  const { width, height } = canvas

  return (
    <Container interactive={true} pointerup={click}>
      <Sprite width={width} height={height} texture={Texture.EMPTY} />
      {children(props)}
    </Container>
  )
}
