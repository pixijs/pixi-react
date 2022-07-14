import React from 'react'
import { BitmapText, Text } from '../../docz-rp'
import * as PIXI from 'pixi.js'

export default props => {
  const [loaded, setLoaded] = React.useState(false)
  const x = props.x
  const y = props.y

  React.useEffect(() => {
    const loader = new PIXI.Loader()

    loader.add('desyrel', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/bitmapfont.xml').load(() => {
      setLoaded(true)
    })

    return () => {
      loader.destroy()
    }
  }, [])

  return loaded ? (
    <BitmapText {...props} />
  ) : (
    <Text anchor={0.5} x={x} y={y} text="⌛ Loading font..." style={{ fontFamily: 'Arial', fontSize: 15 }} />
  )
}
