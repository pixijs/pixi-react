import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SpineContext from './SpineContext'

const updateBone = (props, context, childRef) => {
  const { name, children, attachment, ...rest } = props
  const { spineElement } = context

  const { skeleton } = spineElement.getSpineObject()
  const bone = skeleton.findBone(name)

  Object.keys(rest).forEach(prop => {
    bone[props] = rest[prop]
  })

  if (childRef.current) {
    childRef.current.x = Math.abs(bone.x)
    childRef.current.y = Math.abs(bone.y)
    childRef.current.scale.x = bone.scaleX
    childRef.current.scale.y = bone.scaleY
    childRef.current.rotation = bone.rotation
  }
}

class Bone extends Component {
  static contextType = SpineContext

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
    updateBone(this.props, this.context, this.childRef)
  }

  componentDidUpdate() {
    updateBone(this.props, this.context, this.childRef)
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
              ChildComponentWithRef.displayName = 'BoneWrapper'
              return <ChildComponentWithRef ref={this.childRef} />
            }
          }
          return null
        }}
      </SpineContext.Consumer>
    )
  }
}
export default Bone
