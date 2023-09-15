<template >
  <ion-page 
    :style="isDesktop ?
    `width: 100%;
    align-items: center;
    display: flex;
    justify-content: center;
    background-color: #d0ac85;
    padding: 2vh;` : 
    'margin-top: var(--ion-safe-area-top)'
  ">
    <!-- <div class="tabs-desktop">
      <ion-button
        v-for="(tab,i) in tabs"
        :key="i"
        @click="clkTab($event,tab)"
        expand="block"
        fill="clear"
        size="large"
        :color="selectedTab === tab.name ? 'tertiary' : 'secondary'"
      >
        <ion-icon slot="start" :src="tab.icon" />
        <ion-label style="font-family: Montserrat;font-size: 14px;">{{ tab.label }}</ion-label>
      </ion-button>
    </div> -->
    <ion-content
      class="content"
      :scroll-y="false"
      color="primary"
      :style="isDesktop ? 'max-width: 600px;border-radius:1rem;overflow:hidden;' : ''
    ">
      <ion-router-outlet class="ion-router-outlet">
      </ion-router-outlet>
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
// import { defineCustomElements } from '@ionic/pwa-elements/loader'

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
      selectedTab: 'home'
    };
  },
  beforeMount () {
    const platforms = getPlatforms()
    console.log(platforms, 'platforms')
    if (platforms.includes('android') || platforms.includes('ios')) this.isDesktop = false
    else this.isDesktop = true
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
        console.log(styles.getPropertyValue('--ion-color-background'), 'caraia')
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

<style scoped>

.tabs-desktop {
  display: flex;
  flex-direction: column;
  align-items: start;
  position: absolute;
  top: 2vh;
  left: calc(50vw - 500px);
  background: var(--ion-color-primary);
  padding: 5px;
  border-radius: 1rem;
}

</style>