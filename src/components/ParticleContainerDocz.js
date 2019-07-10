import { Loader } from 'pixi.js'
import React from 'react'
import { ParticleContainer } from '../index'

export default class ParticleContainerDocz extends React.PureComponent {
  state = { loaded: false }
  loader = null

  componentDidMount() {
    this.loader = new Loader()

    this.loader.add('https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png').load(() => {
      this.setState({ loaded: true })
    })
  }

  componentWillUnmount() {
    this.loader && this.loader.destroy()
  }

  render() {
    const { loaded } = this.state
    return loaded ? <ParticleContainer {...this.props} /> : null
  }
}
