import React from 'react'
import PropTypes from 'prop-types'
import { Loader } from 'pixi.js'
import { BitmapText, Text } from '../index'

export default class BitmapTextWithLoader extends React.PureComponent {
  displayName = 'BitmapText'

  loader = null

  state = { loaded: false }

  componentDidMount() {
    this.loader = new Loader()

    this.loader.add('desyrel', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/bitmapfont.xml').load(() => {
      this.setState({ loaded: true })
    })
  }

  componentWillUnmount() {
    this.loader && this.loader.destroy()
  }

  componentDidCatch(err, info) {
    console.log({ err, info })
  }

  render() {
    const { loaded } = this.state
    const { x = 0, y = 0 } = this.props

    return loaded ? (
      <BitmapText {...this.props} />
    ) : (
      <Text anchor={0.5} x={x} y={y} text="⌛ Loading font..." style={{ fontFamily: 'Arial', fontSize: 15 }} />
    )
  }
}

BitmapTextWithLoader.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  text: PropTypes.string,
}
