import { COMPANY_ID, setIuguId, MODE_MASTER_SERVER } from './variables'
import CryptoJS from 'crypto-js'
import { toastController, loadingController } from '@ionic/vue';
import { useFetch } from './fetch'
import { masterServerRoute } from './masterServerRoutes'
// import { Geolocation } from '@capacitor/geolocation';
// let coordinates = null

let loadingVar = []
let updateUserInfoOnNextRoute = false

const useUtils = {
  async createGuestUser () {
    const opt = {
      route: '/auth/createGuestUser'
    }
    const guestUser = await useFetch(opt)
    this.registerLogin(guestUser.data)
    return
  },
  async fetchIuguId () {
    const ret = await useFetch({ route: '/mobile/utils/getIuguTokenByCid' })
    setIuguId(ret.data)
  },
  async loadIuguLib () {
    let Iugu
    const t = document.createElement("script");
    t.type = "text/javascript"
    t.src = "https://js.iugu.com/v2"
    document.body.appendChild(t);
    t.addEventListener('load', () => {
      window.Iugu = Iugu
    })
  },
  updateNextRoute: {
    get () { return updateUserInfoOnNextRoute },
    set (val) {
      updateUserInfoOnNextRoute = val
      // const userInfo = this.getUserInfoByToken()
      return
    }
  },
  registerLogin (data) {
    const key = data.token
    window.localStorage.setItem("ul", data.userId);
    window.localStorage.setItem("$k", key);
    // const key = window.localStorage.getItem("$k");
    const d = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    window.localStorage.setItem("u" + data.userId, d);
    window.localStorage.setItem("au", data.userId);
  },
  localStorage: {
    set (key, value) {
      window.localStorage.setItem(key, JSON.stringify(value))
      return
    },
    get (key) {
      return JSON.parse(window.localStorage.getItem(key))
    }
  },
  loading: {
    async loadingMk (message) {
      loadingVar = await loadingController.create({
        message: message ? message : 'Aguarde',
      });
    },
    async loadingMkArr (message) {
      loadingVar.push(await loadingController.create({
        message: message ? message : 'Aguarde',
      }));
      return loadingVar.length - 1
    },
    async show (message) {
      await this.loadingMk(message)
      loadingVar.present()
    },
    async hide () {
      try { await loadingVar.dismiss() }
      catch (e) { return }
    },
    async clear () {
      try { await loadingVar.dismiss() }
      catch (e) { return }
    }
  },
  async toast (message, position) {
    const t = await toastController.create({
      message,
      duration: 2500,
      cssClass: 'custom-toast',
      position: position ? position : 'bottom',
      buttons: [
        {
          text: 'Fechar',
          role: 'cancel',
          handler: () => { this.handlerMessage = 'Dismiss clicked'; }
        }
      ]
    })
    await t.present()
  },
  async sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  },
  presentUserInfo () {
    const key = window.localStorage.getItem('$k')
    const activeUser = window.localStorage.getItem('au')
    const udCr = window.localStorage.getItem('u' + activeUser)
    if (!udCr || udCr === 'undefined' || !key || key === 'undefined') return false
    let ud
    let error = false
    try {
      ud = JSON.parse(CryptoJS.AES.decrypt(udCr, key).toString(CryptoJS.enc.Utf8))
    } catch (e) {
      error = true
    }
    if (!error) return ud
    // window.location.href = '/login'
  },
  presentOriginalUserInfo () {
    const key = window.localStorage.getItem('$k')
    const activeUser = window.localStorage.getItem('ul')
    const udCr = window.localStorage.getItem('u' + activeUser)
    if (!udCr || !key) return false
    let ud
    let error = false
    try {
      ud = JSON.parse(CryptoJS.AES.decrypt(udCr, key).toString(CryptoJS.enc.Utf8))
    } catch (e) {
      error = true
    }
    if (!error) return ud
    // window.location.href = '/login'
    return ud
  },
  setActiveUser (id) {
    window.localStorage.setItem('au', id)
  },
  attachmentsAddress () {
    if (MODE_MASTER_SERVER === 'dev' || MODE_MASTER_SERVER === 'dev_ext' || MODE_MASTER_SERVER === 'prod')
      return masterServerRoute() + '/static/vsp_app/'
    else return masterServerRoute('dev_ext') + '/static/vsp_app/'
  },
  getUserInfoByToken () {
    const opt = {
      route: '/getUserInfoByToken'
    }
    return useFetch(opt)
  },
  getUSerProfilePhotoUrl () {
    const userInfo = this.presentUserInfo();
    return this.userInfo.profileImage ? `${this.attachmentsAddress()}${this.userInfo.profileImage.filename}` : '../../assets/blank-profile-picture-973460.svg'
    // return `${this.attachmentsAddress()}profileImage_${COMPANY_ID}_${userInfo.userId}?${new Date().getTime()}`
  },
  generateProfileImage (userId) {
    return `${this.attachmentsAddress()}profileImage_${COMPANY_ID}_${userId}_thumbnail`
  },
  getUserPermissionByRole (role) {
    const opt = {
      route: '/getUserPermissionByRole',
      body: {}
    }
    if (typeof role === 'object') {
      const arrayRoles = []
      Object.keys(role).forEach(k => {
        arrayRoles.push(k)
      })
      opt.body.arrayRoles = arrayRoles
    }
    else opt.body.role = role
    return useFetch(opt)
  },
  convertToArrayIntoArray ({ data, itemsPerRow }) {
    const tempRows = []
    let tempCols = []
    if (data.length === 1) return [data]
    data.forEach((s, i) => {
      if ((i % itemsPerRow) === (itemsPerRow - 1)) {
        tempCols.push(s)
        tempRows.push(tempCols)
        tempCols = []
      } else {
        tempCols.push(s)
        if (i === data.length - 1) tempRows.push(tempCols)
      }
    })
    return tempRows
  },
  verifyIfClientHasPaymentMethod () {
    const opt = {
      route: '/templeClub/verifyIfClientHasPaymentMethod'
    }
    return useFetch(opt)
  },
  getUserAddress: async function () {
    const opt = {
      route: '/getUserAddress',
    }
    return useFetch(opt)
      
  },
}

export default useUtils