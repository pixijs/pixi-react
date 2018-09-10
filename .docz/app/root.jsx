import React from 'react'
import { hot } from 'react-hot-loader'
import Theme from 'docz-theme-default'
import db from './db.json'

const Root = ({ imports }) => (
  <Theme
    db={db}
    imports={imports}
    hashRouter={true}
    websocketUrl="ws://127.0.0.1:60505"
  />
)

export default hot(module)(Root)
