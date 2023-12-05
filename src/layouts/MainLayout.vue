<template >
  <ion-page :style="styleIonPage">
    <ion-content
      class="content"
      color="primary"
      :style="isDesktop ? 'max-width: 600px;border-radius:1rem;overflow:hidden;' : ''"
    >
      <ion-router-outlet class="ion-router-outlet"/>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonContent,
  IonRouterOutlet,
  IonPage,
  IonIcon,
  IonLabel,
  IonButton
} from '@ionic/vue';
import { defineComponent } from 'vue';
import { StatusBar, Style } from '@capacitor/status-bar';
import { useBackButton, useIonRouter, isPlatform, getPlatforms } from '@ionic/vue';
import { App } from '@capacitor/app';
import utils from '../composables/utils'
import pushService from '../composables/notifications'

import iHouse from '/src/assets/icons/house.svg'
import iUser from '/src/assets/icons/user.svg'
import iChat from '/src/assets/icons/chat.svg'
import iSuitcase from '/src/assets/icons/suitcase.svg'


</script>

<script>
import { useFetch } from '@/composables/fetch';


export default defineComponent({
  name: "MainLayout",
  data() {
    return {
      appVersion: "",
      isDesktop: null,
      tabsGuest: [
        { name: "home", icon: iHouse, to: '/tabs/home', label: "INÍCIO" },
        { name: "profile", icon: iUser, to: '/myProfile', label: "PERFIL" },
        { name: "messenger", icon: iChat, to: '/tabs/messengerChat', label: "CONVERSAR" },
        // { name: "newDraft", icon: iSuitcase, to: '/guestInfo', label: "ORÇAMENTO" },
      ],
      tabsUser: [
        { name: "home", icon: iHouse, to: '/tabs/home', label: "INÍCIO" },
        { name: "profile", icon: iUser, to: '/myProfile', label: "PERFIL" },
        { name: "messenger", icon: iChat, to: '/tabs/messengerChat', label: "CONVERSAR" },
        // { name: "newDraft", icon: iSuitcase, to: '/NewDraftCompanyBody', label: "ORÇAMENTO" },
      ],
      tabs: [],
      selectedTab: 'home',
      styleIonPage: ''
    };
  },
  beforeMount () {
    const platforms = getPlatforms()
    console.log(platforms, 'platforms')
    if (platforms.includes('cordova')) this.isDesktop = false
    else if (platforms.includes('ios') || platforms.includes('android')) this.isDesktop = false
    else this.isDesktop = true
    if (this.isDesktop) {
      this.styleIonPage = `
        width: 100%;
        align-items: center;
        display: flex;
        justify-content: center;
        background-color: #d0ac85;
        padding: 2vh;
      `
    } 
    // else {
    //   if (platforms.includes('ios')) {
    //     this.styleIonPage = 'margin-top: var(--ion-safe-area-top)'
    //   } else this.styleIonPage = 'margin-top: var(--ion-safe-area-top)'
    // }
  },
  mounted () {
    this.startView()
    utils.fetchIuguId()
    pushService.initPush()
  },
  watch: {
    $route() {
      if (this.$route.query.updateTabs === 'true') {
        utils.getUserInfoByToken().then(r => {
          this.userInfo = r.data
          if (r.data.isGuestUser === 1) this.tabs = this.tabsGuest
          else this.tabs = this.tabsUser
          this.$router.replace(this.$route.path)
        })
      } else if (this.$route.path === '/login') this.tabs = []
      // else if (this.$route.query.postAction === 'createGuestUser') {
      //   this.checkUserAuthentication()
      // }

    }
  },
  methods: {
    async startView () {
      this.changeAppBar()
      if (this.$route.path === '/login') return
      else this.checkUserAuthentication()
    },
    async clkTab (ev,tab) {
      this.selectedTab = tab.name
      this.$router.push(tab.to)
    },
    changeAppBar () {
      if (isPlatform('android')) {
        const styles = getComputedStyle(document.body);
        StatusBar.setStyle({ style: Style.Light });
        StatusBar.setBackgroundColor({ color: '#fffcf6' })
      }
    },
    async checkUserAuthentication () {
      const ui = utils.presentUserInfo();
      if (!ui || !ui.token) this.$router.push('/login')
      else {
        if (ui.isGuestUser === 1) this.tabs = this.tabsGuest
        else this.tabs = this.tabsUser
        this.$router.push("/tabs/home?updateTabs=true")
      }
    },
  }

});
</script>