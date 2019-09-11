import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SpineContext from './SpineContext'

const updateSlotContent = (props, context, childRef) => {
  const { name, children, ...rest } = props
  const { spineElement } = context

  if (childRef.current) {
    spineElement.decorateSlotByName(name, childRef.current)
  }

  const container = spineElement.getSlotPixiContainer(name)
  Object.keys(rest).forEach(prop => {
    container[prop] = rest[prop]
  })
}

class SlotContent extends Component {
  static contextType = SpineContext

  static propTypes = {
    children: PropTypes.node,
  }

  static defaultProps = {
    children: null,
  }

  constructor(props) {
    super(props)
    this.childRef = React.createRef()
  }

  componentDidMount() {
    updateSlotContent(this.props, this.context, this.childRef)
  }

  componentDidUpdate() {
    updateSlotContent(this.props, this.context, this.childRef)
  }

  render() {
    const { children } = this.props
    return (
      <SpineContext.Consumer>
        {() => {
          if (children) {
            const ChildComponentWithRef = React.forwardRef((props, ref) =>
              React.cloneElement(children, {
                ...props,
                ref,
              })
            )
            ChildComponentWithRef.displayName = 'SlotWrapper'
            return <ChildComponentWithRef ref={this.childRef} />
          }

          return null
        }}
      </SpineContext.Consumer>
    )
  }
}

export default SlotContent
