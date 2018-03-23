import React from 'react'
import PropTypes from 'prop-types'

const Provider = ({ children }, { app }) => children(app)
Provider.contextTypes = { app: PropTypes.object }
Provider.propTypes = { children: PropTypes.func }

export default Provider
