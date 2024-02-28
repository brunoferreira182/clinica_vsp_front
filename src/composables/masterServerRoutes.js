import { MODE_MASTER_SERVER, MODE_SERVER } from './variables'

const port = MODE_SERVER === 'master' ? 8000 : 8500
const portSocket = MODE_SERVER === 'master' ? 8000 : 8501

function masterServerRoute () {
  let ret
  if (MODE_MASTER_SERVER === 'local') ret = 'http://localhost:' + port
  else if (MODE_MASTER_SERVER === 'dev') ret = 'https://api6.b3dev.dev:' + port
  else if (MODE_MASTER_SERVER === 'tiago') ret = 'http://192.168.1.5:' + port
  else if (MODE_MASTER_SERVER === 'darta') ret = 'http://192.168.1.2:' + port
  else if (MODE_MASTER_SERVER === 'bruno') ret = 'http://192.168.1.99:' + port
  else if (MODE_MASTER_SERVER === 'prod') ret = 'https://api2.b3dev.dev:' + port
  return ret
}

function masterServerSocketRoute () {
  let ret
  if (MODE_MASTER_SERVER === 'local') ret = 'http://localhost:' + portSocket
  else if (MODE_MASTER_SERVER === 'dev') ret = 'https://api6.b3dev.dev:' + portSocket
  else if (MODE_MASTER_SERVER === 'tiago') ret = 'http://192.168.1.5:' + portSocket
  else if (MODE_MASTER_SERVER === 'bruno') ret = 'http://192.168.1.99:' + portSocket
  else if (MODE_MASTER_SERVER === 'darta') ret = 'http://192.168.1.2:' + portSocket
  else if (MODE_MASTER_SERVER === 'prod') ret = 'https://api2.b3dev.dev:' + portSocket
  return ret
}

function calculateMasterServerAttachmentsRoute() {
  // if (
  //   MODE_MASTER_SERVER === "dev" ||
  //   MODE_MASTER_SERVER === "dev_ext" ||
  //   MODE_MASTER_SERVER === "prod"
  // ) {
  //   return masterServerRoute() + "/static/";
  // } else return masterServerRoute("dev_ext") + "/static/";
  return masterServerRoute() + "/static/";
}

export { masterServerRoute, calculateMasterServerAttachmentsRoute, masterServerSocketRoute }