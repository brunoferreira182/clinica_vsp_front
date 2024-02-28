<template>
  <ion-page>
    <ion-tabs  style="position: relative;display: flex;justify-content: center;">
      <ion-router-outlet style="height: 100%;"></ion-router-outlet>
      <ion-tab-bar
        v-if="!$route.query.greetingMessage"
        :style="isDesktop ? 'display:none;' :'z-index: 0;'"
        mode="ios"
        ref="tabbar"
        slot="bottom"
        class="main-tab-style transition"
      >
        <ion-tab-button
          class="transition"
          v-for="tab in tabs"
          :key="tab.name"
          :tab="tab.name"
          @click="clkTab($event,tab)"
          :selected="$route.path === tab.to ? true : false"
          :disabled="$route.path === '/tabs/messengerChat'"
          style="--color: var(--ion-color-secondary);--color-selected: var(--ion-color-tertiary)"
        >
          <!-- <ion-icon class="" :src="'.//src/assets/icons/' + tab.icon" /> -->
          <ion-icon :icon="tab.icon"/>
          <ion-label >{{ tab.label }}</ion-label>
            <template v-if="tab.name === 'messenger'">
              <div class="unread">
                <ion-badge color= "danger" v-if="unreadMessages >= 1" >{{ unreadMessages }}</ion-badge>
              </div>
              <!-- <div v-if="unreadMessages >= 1" class="unread">{{ unreadMessages }}</div> -->
            </template>

        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
    <ion-modal 
      ref="modal" 
      :isOpen="modalShow" 
      @didDismiss="hideModal" 
      :initial-breakpoint="0.7" 
      :breakpoints="[0,0.7]"
    >
      <ion-content class="q-px-sm ion-padding-top">
        <div style="height:100px"></div>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>
<script setup>

import {
  IonTabBar, IonTabButton, IonTabs, IonLabel,
  IonIcon, IonBadge,
  IonPage, IonRouterOutlet,
  IonFab, IonFabButton,
  IonModal, IonContent,
  IonImg, IonAvatar,
} from '@ionic/vue';
import { add } from 'ionicons/icons';
import iHouse from '/src/assets/icons/house.svg'
import iUser from '/src/assets/icons/user.svg'
import iChat from '/src/assets/icons/chat.svg'
import iSuitcase from '/src/assets/icons/suitcase.svg'
import utils from '../composables/utils'
import { useBackButton } from '@ionic/vue';
import { isPlatform } from '@ionic/vue';
import { useFetch } from '../composables/fetch.js'
</script>
<script>

export default {
  name: "TabsLayout",
  data() {
    return {
      isDesktop: null,
      PaidOptions: null,
      FreeOptions: null,
      add,
      tabs: [],
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
      fabPos: [ 0, -24 ],
      draggingFab: false,
      appVersion: "",
      tab: "home",
      mainMenu: {
        open: false,
      },
      sections: [],
      itemsPerRow: 3,
      logged: false,
      showTopBottomBars: false,
      showToolbarButtons: true,
      canCreatePosts: false,
      canCreateStories: false,
      routerMaximizedDialogProps: {
        open: false,
      },
      reloadUserProfile: false,
      myChurchInfo: null,
      notifications: {
        notRead: 0,
        page: 0,
        notifications: []
      },
      userInfo: {},
      selectedTab: 'home',
      modalShow: false,
      unreadMessages: 0
    };
  },
  beforeMount () {
    const platforms = getPlatforms()
    if (platforms.includes('android') || platforms.includes('ios')) this.isDesktop = false
  },
  watch: {
    $route(to, from) {
      if (to.path === '/myProfile' || to.path === '/tabs/home'){
        // this.getUnreadMessages()
      }else if (to.path === '/tabs/messengerChat'){
        this.setMessageRead()
        console.log('dslkmsalkmdas');
      }
      if (to.path !== '/tabs/messengerChat') {
          this.showTab()
          if (to.path === '/tabs/home' && to.query.menu) {
            this.slideTab()
          }
          if (to.path === '/tabs/home' && !to.query.menu) {
            this.slideBackTab()
          }
        } else {
          this.hideTab()
        }
        if (this.$route.query.updateTabs === 'true') {
          utils.getUserInfoByToken().then(r => {
            this.userInfo = r.data
            if (r.data.isGuestUser === 1) this.tabs = this.tabsGuest
            else this.tabs = this.tabsUser
            this.$router.replace(this.$route.path)
          })
        }
      }
  },
  beforeMount () {
    if (this.$route.query.postAction !== 'createGuestUser') {
      utils.getUserInfoByToken().then(r => {
        this.userInfo = r.data
        if (r.data.isGuestUser === 1) this.tabs = this.tabsGuest
        else this.tabs = this.tabsUser
      })
    }
  },
  mounted() {
    if (this.$route.path !== '/tabs/messengerChat') {
      this.showTab()
    } else {
      this.hideTab()
    }
    
  },
  methods: {
    setMessageRead(){
      const opt = {
        route: '/mobile/messenger/updateMessageRead',
        body: {
          userId: this.userInfo.userId,
        }
      }
      const r =  useFetch(opt)
    },
    async getUnreadMessages () {
      const opt = {
        route: '/mobile/messenger/getUnreadMessages',
        body: {
          userId: this.userInfo.userId,
          name: this.userInfo.name
        }
      }
      const r = await useFetch(opt)      
      this.unreadMessages = r.data
      console.log (this.userInfo);
      console.log (this.unreadMessages, 'respoonse');
      console.log (r.data, 'respoonse');
    },
    backButtonManager () {
      useBackButton(9, () => {
        if (this.modalShow) this.modalShow = false
      })
    },
    async clkTab (ev,tab) {
      this.selectedTab = tab.name
      this.$router.push(tab.to)
    },
    async hideTab() {
      // tabbar
      if (!this.$refs.tabbar) return
      const tabBar = this.$refs.tabbar.$el
      tabBar.classList.add('tab-to-input')
      tabBar.classList.remove('main-tab-style')
      const elements = [...tabBar.children]
      elements.forEach(child => {
        child.classList.add('disapear')
      })
      await utils.sleep(400)
      tabBar.classList.add('disapear')
      await utils.sleep(300)
      tabBar.classList.add('hidden')
    },
    async showTab() {
      if (!this.$refs.tabbar) return
      const tabBar = this.$refs.tabbar.$el
      tabBar.classList.remove('hidden')
      await utils.sleep(100)
      tabBar.classList.remove('tab-to-input')
      tabBar.classList.remove('disapear')
      tabBar.classList.add('main-tab-style')
      const elements = [...tabBar.children]
      elements.forEach(child => {
        child.classList.remove('disapear')
      })
    },
    async slideTab() {
      if (!this.$refs.tabbar) return
      const tabBar = this.$refs.tabbar.$el
      tabBar.classList.remove('main-tab-style')
      tabBar.classList.remove('transition')
      tabBar.classList.add('slide-transition')
      tabBar.classList.add('slide-left')
      console.log(tabBar.classList, 'slide tab')
    },
    async slideBackTab() {
      if (!this.$refs.tabbar) return
      const tabBar = this.$refs.tabbar.$el
      tabBar.classList.remove('slide-left')
      tabBar.classList.add('slide-transition')
      tabBar.classList.add('main-tab-style')
      tabBar.classList.add('transition')
      console.log(tabBar.classList, 'slideBackTab')
    },

    tabsDidChange (e) {
      console.log(e.tab, 'tabsDidChange')
    },
    showModal () {
      this.modalShow = true
    },
    hideModal() {
      this.modalShow = false
    },
    clkCard (item) {
      console.log(item)
      this.hideModal()
      this.$router.push(item.route)
    },
    openSwipeableBottomSheet() {
      console.log('opa')
      this.$refs.myBottomSheet.open();
    },
    closeSwipeableBottomSheet() {
      this.$refs.myBottomSheet.close();
    },
    clkOptionBottomSheet(btn) {

      setTimeout(() => {
        this.closeSwipeableBottomSheet();
        this.$router.push(btn.route);
      }, 150);
    },
  }
};
</script>

<style>

.animation {
  animation: alerta 1.5s infinite;
}
.botao {
  color: white;
  border-radius: 70px;
  box-shadow: 0 0 0 0 rgba(255, 205, 66, 0.5);
  font-size: 30px;
  display: inline-block;
  text-align: center;
  line-height: 55px;
  text-decoration: none;
  transition: background, padding 500ms ease-in-out;  
}
@keyframes alerta {
  0% {
    transform: scale();
  }
  70% {
    transform: scale();
    box-shadow: 0 0 0 50px rgba(69, 152, 27, 0);
  }
    100% {
    transform: scale();
    box-shadow: 0 0 0 0 rgba(69, 152, 27, 0);
  }
}
/* daqui pra cima botão pulse */
@keyframes bounce-in {
    0% {
      transform: translate(3px, 0);
    }
    50% {
      transform: translate(-3px, 0);
    }
    100% {
      transform: translate(0, 0);
    }
  }

  @-moz-keyframes bounce-in {
    0% {
      -moz-transform: translate(3px, 0);
    }
    50% {
      -moz-transform: translate(-3px, 0);
    }
    100% {
      -moz-transform: translate(0, 0);
    }
  }

  @-webkit-keyframes bounce-in {
    0% {
      -webkit-transform: translate(3px, 0);
    }
    50% {
      -webkit-transform: translate(-3px, 0);
    }
    100% {
      -webkit-transform: translate(0, 0);
    }
  }

  @-ms-keyframes bounce-in {
    0% {
      -ms-transform: translate(3px, 0);
    }
    50% {
      -ms-transform: translate(-3px, 0);
    }
    100% {
      -ms-transform: translate(0, 0);
    }
  }

  @-o-keyframes bounce-in {
    0% {
      -o-transform: translate(3px, 0);
    }
    50% {
      -o-transform: translate(-3px, 0);
    }
    100% {
      -o-transform: translate(0, 0);
    }
  }
/* @keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
} */

.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
.hover:active {
  background-color: var(--ion-color-light);
}
.hover {
  background-color: transparent;
}

.card-style {
  box-shadow: none;
}


.vertical-center {
  margin: 0;
  position:relative;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}

.transition {
  transition: all 0.5s ease-in-out;
}


.main-tab-style {
  overflow: visible;
  position: absolute;
  bottom: calc(var(--ion-safe-area-bottom));
  left: 0;
  right: 0;
  padding-right: 15px;
  padding-block: 10px;
  border-radius: 0.4rem;
  --background: var(--ion-color-primary);
  width: calc(100vw - 29px);
  max-width: 500px;
  margin: auto;
}

.tab-to-input {
  position:absolute;
  margin-inline: auto;
  left: 0;
  right: 0;
  bottom: calc(var(--ion-safe-area-bottom));
  width: calc(100vw - 29px);
  overflow: visible;
  padding-block: 10px;
  padding-right: 15px;
  border-radius: 50px;
  height: 45px;
  --background: var(--ion-color-primary);
}
.disapear {
  opacity: 0;
}
.hidden {
  display: none;
}

.unread{
  position: absolute;
  right: 32px;
  bottom: 28px;
}

.slide-left {
  margin: auto;
  translate: 0 300px;
  position:absolute;
  bottom: calc(var(--ion-safe-area-bottom));
  width: calc(100vw - 30px);
  /* padding-right: 15px; */
  padding-block: 10px;
  border-radius: 0.4rem;
  --background: var(--ion-color-primary);
}
.slide-transition {
  transition: all 0.3s ease-in-out;
}

.tabbar-blur {
  position: absolute;
  /* background: var(--ion-color-background); */
  width: calc(100vw - 20px);
  left: 0;
  right: 0;
  margin: auto;
  height: 100px;
  bottom: -50px;

  background: rgb(255, 252, 246, 0.8);
  backdrop-filter: blur( 16px );
  -webkit-backdrop-filter: blur( 10px)

}
.unread-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: red; /* or any other color you prefer */
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 10px;
}
</style>