import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SlotContent from './SlotContent'
import SpineContext from './SpineContext'

const updateSlot = (props, context) => {
  const { name, children, attachment, ...rest } = props
  if (!name) return
  const { spineElement } = context
  const { skeleton } = spineElement.getSpineObject()
  const slot = skeleton.findSlot(name)

  Object.keys(rest).forEach(prop => {
    slot[prop] = rest[prop]
  })

  if (attachment) {
    slot.setAttachment(attachment)
  }
}

class Slot extends Component {
  static contextType = SpineContext

  static Content = SlotContent

  static propTypes = {
    name: PropTypes.string.isRequired,
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
    updateSlot(this.props, this.context)
  }

  componentDidUpdate() {
    updateSlot(this.props, this.context)
  }

  render() {
    const { name, children } = this.props
    return (
      <SpineContext.Consumer>
        {() => {
          if (name) {
            if (children) {
              const ChildComponentWithRef = React.forwardRef((props, ref) =>
                React.cloneElement(children, {
                  ...props,
                  ref,
                })
              )
              ChildComponentWithRef.displayName = 'SlotWrapper'
              return <ChildComponentWithRef ref={this.childRef} name={name} />
            }
          }
          return null
        }}
      </SpineContext.Consumer>
    )
  }
}
export default Slot
