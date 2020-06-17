import { useContext } from 'react'
import { Context } from '../stage/provider'

export function useApp() {
  return useContext(Context)
}
