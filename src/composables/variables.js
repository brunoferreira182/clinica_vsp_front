//////////// VARIAVEIS DA APLICACAO //////
const MODE_MASTER_SERVER = 'local'
const COMPANY_ID = 2
const VERSION = 1.6
const BUILD = 10
//////////// NAO MUDAR //////
const MODE_AUTH_SERVER = 'local'
const MODE_APP_SERVER = 'local'
const PROJECT_NAME = 'vsp_app'
const DEFAULT_SERVER_NAME = 'application'
const CRYPTOYESORNO = 0
const APP_NAME = 'VSP APP'
let IUGU_ID
const IUGU_TEST_MODE = COMPANY_ID > 9 ? false : true
const MODE_SERVER = 'app'
///////////////////////////////////////////

const setIuguId = function (id) {
  IUGU_ID = id
}
const getIuguId = function () {
  return IUGU_ID
}

export {
  MODE_MASTER_SERVER,
  MODE_AUTH_SERVER,
  MODE_APP_SERVER,
  COMPANY_ID,
  PROJECT_NAME,
  DEFAULT_SERVER_NAME,
  CRYPTOYESORNO,
  APP_NAME,
  IUGU_ID,
  IUGU_TEST_MODE,
  setIuguId,
  getIuguId,
  VERSION,
  BUILD,
  MODE_SERVER
}