import { MODE_MASTER_SERVER } from './variables'

function masterServerRoute (type) {
  let ret, mode
  type ? mode = type : mode = MODE_MASTER_SERVER
  if (mode === 'local') ret = 'http://localhost:8000'
  else if (mode === 'dev_ext') ret = 'https://api6.b3dev.dev:8000'
  else if (mode === 'prod') ret = 'https://api2.b3dev.dev:8000'
  else if (mode === 'tiago') ret = 'http://192.168.1.4:8000'
  else if (mode === 'dev') ret = 'https://api6.b3dev.dev:8000'
  return ret
}
export { masterServerRoute }