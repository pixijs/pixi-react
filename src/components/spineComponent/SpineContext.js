import { createContext } from 'react'
import spineManager from '../../utils/spineManager'
const SpineContext = createContext({ spineManager })

export const SpineProvider = SpineContext.Provider
export const SpineConsumer = SpineContext.Consumer
export default SpineContext
