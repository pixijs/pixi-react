const React = require('react')
const { BitmapText, Text } = require('../../docz-rp')

export default props => {
  const [loaded, setLoaded] = React.useState(false)
  const x = props.x
  const y = props.y

  React.useEffect(() => {
    const PIXI = require('pixi.js')
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
