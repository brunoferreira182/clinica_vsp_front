<template>
  <ion-button
    color="primary"
    fill="outline"
    @click="clkLoginGoogle"
    expand="block"
  >Fazer login com Google</ion-button>

  <ion-button @click="getLoginData">forçar</ion-button>
</template>

<script>
/* eslint-disable */
export default {
  name: 'LoginWithGoogle',
}
</script>

<script setup>
import { IonButton } from '@ionic/vue';
import { ref, onMounted, watch } from 'vue'
import utils from '../../src/composables/utils.js';
import { Browser } from '@capacitor/browser';
import axios from 'axios'
import { COMPANY_ID, PROJECT_NAME } from '../composables/variables'
const emits = defineEmits([
  'loginDone',
  'cancel'
])

Browser.addListener('browserFinished', getLoginData)
async function getLoginData () {
  const data = {
    project: 'firebase_login',
    serverName: 'application',
    mode: 'local',
    route: '/client/getLoginDataByToken',
    method: 'post',
    body: {
      pn: PROJECT_NAME,
      tk: b3devToken
    }
  }
  const config = {
    headers: {
      cid: COMPANY_ID,
    }
  }
  let ret
  try { ret = await axios.post(urlApi.value, data, config) }
  catch (e) { console.log('AQUI ERRO CATCH firebase login', e) }
  if (!ret.data || ret.data.error) {
    utils.toast('Erro fazer o login. Tente novamente ou escolha outro método de login.')
    return null
  }
  emits('loginDone', ret.data.data)
}

const url = ref('https://homolr.b3dev.net/firebase_google_auth/')
// const url = ref('http://localhost:8101/firebase_google_auth/')
// const urlApi = ref('https://homolr.b3dev.net/api/')
const urlApi = ref('http://192.168.1.7:8443/')

let b3devToken

const clkLoginGoogle = async () => {
  b3devToken = await getB3devToken()
  openBrowser(b3devToken)
}

const getB3devToken = async () => {
  const data = {
    project: 'firebase_login',
    serverName: 'application',
    mode: 'local',
    route: '/client/newToken',
    method: 'post'
  }
  const config = {
    headers: {
      cid: COMPANY_ID,
      pn: PROJECT_NAME
    }
  }
  let ret
  try { ret = await axios.post(urlApi.value, data, config) }
  catch (e) { console.log('AQUI ERRO CATCH firebase login', e) }
  if (!ret.data || ret.data.error) {
    utils.toast('Erro ao criar token. Saia do aplicativo e tente novamente.')
    return null
  }
  return ret.data.data
}

const openBrowser = async () => {
  await Browser.open({ url: url.value + '?tk=' + b3devToken + '&pn=' + PROJECT_NAME + '&cid=' + COMPANY_ID });
};

</script>