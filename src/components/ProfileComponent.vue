<template>
  <ion-page>
    <ion-content>
      <div class="ion-text-center q-mt-xl" v-if="userProfileData">
        <img
          class="profilephoto"
          :src="userProfilePhotoUrl"
          style="height: 150px;width: 150px;object-fit: cover;border-radius: 5rem;"/>        
        <h2 style="margin: 5px;">
          {{ userProfileData.name }}
        </h2>
        <p style="color:var(--ion-color-secondary-tint);margin: 0;">
          @{{ userProfileData.user }}
        </p>
      </div>
      <div>
        <ion-button
          color="tertiary"
          expand="block"
          class="ion-margin"
          @click="$router.push('/editProfile')"
        >
          Editar perfil
        </ion-button>
        <!-- <ion-button
          expand="block"
          class="ion-margin"
          color="tertiary"
          @click="$router.push('/newOpportunitiesApprovedList')"
        >
          Contato
        </ion-button> -->
        <ion-button
          expand="block"
          class="ion-margin"
          color="tertiary"
          @click="clkApprovedBudgets"
        >
          Consultas realizadas
        </ion-button>
        <ion-button
          expand="block"
          class="ion-margin"
          color="tertiary"
          @click="clkPaidProcedures"
        >
          Procedimentos pagos
        </ion-button>
        <ion-button
          expand="block"
          class="ion-margin"
          color="tertiary"
          @click="clkMoreOptions"
        >
          Outras opções
        </ion-button>
      </div>
      <div v-if="activeBudget" style="margin-inline: 1rem;margin-top: 8px;">
        <!-- <h4 class="text-primary" style="margin-inline: 0px;margin-block: 20px;font-weight: 600;">Você possui um orçamento ativo</h4> -->
        <div style="background: var(--ion-color-tertiary);border-radius: 15px;padding: 10px;margin: 0px;">
          <div class="q-mb-md" style="font-size: 20px;font-weight: 500;">Você tem um orçamento ativo</div>
          <div style="margin-inline: 10px;font-size: 14px;;font-family:;">
            <div style="display: flex; align-items: center;">
              <p style="font-weight: 500;">Status:</p>
              <p style="margin:0;margin-left: auto;" class="text-secondary">{{ activeBudget.status.label }}</p>
            </div>
            <p style="font-weight: 500;">Procedimentos:</p>
            <p style="" v-for="(item,i) in activeBudget.opportunityData.procedures" :key="i">
              {{i + 1}}. {{ item.procedureData.label }}.
            </p>
          </div>
          <ion-button @click="goToActiveBudget" color="primary"  class="q-mt-lg" expand="block" >
              Prosseguir
              <ion-icon slot="end" style="scale: 0.8;" :icon="arrowForward"></ion-icon>
          </ion-button>
        </div>
      </div>
      

      <ion-modal 
        ref="modal" 
        :is-open="openUserOptions" 
        :initial-breakpoint="0.5" 
        :breakpoints="[0,0.5]" 
        @didDismiss="openUserOptions = false"
      >
        <ion-content >
          <ion-list class="q-mt-lg" lines="none">
            <ion-item
              detail="false"
              button
              v-for="item in profileMenu"
              :key="item.icon"
              @click="clkMenuItem(item)"
            >
              <ion-icon slot="start" :icon="item.icon"/>
              <ion-label>
                {{ item.label }}
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-modal>

    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonHeader, IonToolbar, IonTitle, IonButtons,
  IonContent,
  IonItem,IonLabel,
  IonRow,
  IonImg,IonAvatar,
  IonIcon,
  IonButton,
  IonList,
  IonModal,
  IonCard, IonCardContent, IonCardHeader,
  IonInfiniteScroll, IonInfiniteScrollContent,
  IonBadge,
  IonPopover,
  alertController,
} from '@ionic/vue';
import { 
  locationOutline, 
  add, 
  arrowForward,
} from 'ionicons/icons';
import { useFetch } from '../composables/fetch';
import HeaderComponent from '../components/HeaderComponent.vue';
import CryptoJS from 'crypto-js';
import utils from '../composables/utils'
import { trashOutline, logOutOutline } from 'ionicons/icons';
import DefaultAvatar from '/src/assets/default_avatar.svg'
</script>

<script>

export default {
  name: "ProfileComponent",
  data() {
    return {
      activeBudget: null,
      openUserOptions: false,
      profileInfoLoaded: false,
      userInfo: {},
      userProfileData: null,
      originalUserInfo: {},
      userProfilePhotoUrl: null,
      profileMenu: [
        { icon: logOutOutline, label: 'Sair do aplicativo', callback: 'clkExitApp' },
        { icon: trashOutline, label: 'Excluir conta', callback: 'clkDeleteAccount' }
      ],
    }
  },
  mounted () {
    this.startView()
  },
  watch: {
    $route(to) {
      if (to.path === '/myProfile') {
        this.startView()
      }
    }
  },
  methods: {
    clkPaidProcedures () {
      this.$router.push('/paidProceduresOpportunities')
    },
    clkApprovedBudgets () {
      this.$router.push('/newOpportunitiesApprovedList')
    },
    clkExitApp () {
      const opt = {
        serverName: 'authentication',
        route: '/disconnectFromAccount',
      }
      useFetch(opt).then(() => {
        this.$router.push('/login')
      })
    },
    async clkMoreOptions () {
      this.openUserOptions = true
    },
    makeProfilePhotoUrl () {
      const now = new Date()
      const time = now.getTime()
      const img =
        this.userProfileData.profileImage 
        ? `${utils.attachmentsAddress()}${this.userProfileData.profileImage.filename}?${time}`
        : DefaultAvatar
      this.userProfilePhotoUrl = img
    },
    startView () {
      this.loadData()
      this.originalUserInfo = utils.presentOriginalUserInfo()
      this.getActiveOpportunitiesFromUser()
      utils.loading.clear()
    },
    getActiveOpportunitiesFromUser () {
      const opt = {
        route: '/mobile/sales/getActiveOpportunitiesFromUser',
      }
      useFetch(opt).then( r => {
        this.activeBudget = r.data
      })
    },
    clkPersonalData () { this.$router.push('/profileAddressAndDocument') },
    getUserProfileInfo: async function (userId) {
      const opt = {
        method: 'POST',
        route: '/mobile/profile/getUserProfileInfo',
        body: {
          userId: this.$route.query.userId ? this.$route.query.userId : userId,
        }
      }
      // utils.loading.show()
      useFetch(opt).then(r => {
        utils.loading.hide()
        if (r.error && r.errorType === 'tokenNonExistent') this.$router.push('/login')
        this.userProfileData = r.data
        this.makeProfilePhotoUrl()
      })
    },
    goToActiveBudget () {
      let route = ''
      if (this.activeBudget.status.status === 'inImages') {
        route = '/newOpportunityInsertPhoto?opportunityId='
      }
      else if (this.activeBudget.status.status === 'inBudget') {
        route = '/newOrEditOpportunityBudget?opportunityId='
      }
      else if (this.activeBudget.status.status === 'waitingPayment') {
        route = '/newOpportunityCheckout?opportunityId='
      }
      console.log(this.activeBudget.status.status)
      this.$router.push(route + this.activeBudget.opportunityId)
    },
  
    loadData () {
      utils.getUserInfoByToken().then(r => {
        this.userInfo = r.data
        this.step = 'profile'
        this.getUserProfileInfo(this.userInfo.userId)
        // this.makeProfilePhotoUrl()
      })
    },
    clkMenuItem (item) {
      this.openUserOptions = false
      this[item.callback]()
    },
    async clkDeleteAccount () {
      const alert = await alertController.create({
          header: 'Quer mesmo deletar sua conta?',
          message: 'Depois que confirmar, sua conta será deletada e você não poderá recuperá-la.',
          buttons: [
            {
              text: 'Cancelar',
              handler: () => {
                ''
              },
            },
            {
              text: 'Confirmar',
              role: 'confirm',
              handler: () => {
                const opt = {
                  serverName: "authentication",
                  route: '/deleteAccount',
                }
                useFetch(opt).then(() => {
                  window.localStorage.clear()
                  this.$router.push('/login')
                })
              },
            },
          ],
        });

        await alert.present();
    },
    async clkDisconnectAccount () {
      if (this.userInfo.userId === this.originalUserInfo.userId) {
        utils.toast('Você não pode desconectar da sua conta principal, caso queira sair, selecione sair do aplicativo.')
        return
      }
      const alert = await alertController.create({
          header: 'Quer mesmo desconectar?',
          subHeader: 'Para usar essa conta de novo será necessário fazer login novamente',
          buttons: [
            {
              text: 'Cancelar',
              handler: () => {
                ''
              },
            },
            {
              text: 'Confirmar',
              role: 'confirm',
              handler: () => {
                this.clkConfirmDisconnectAccount()
              },
            },
          ],
        });

        await alert.present();

    },
    clkConfirmDisconnectAccount () {
      const opt = {
        serverName: 'authentication',
        route: '/disconnectFromAccount',
        body: {
          userId: this.userInfo.userId
        }
      }
      useFetch(opt).then(r => {
        this.newLoginDone(r.data)
      })
    },
    clkEditProfile () {
      this.$router.push('/editProfile')
    },

    
  
    clkAddAccountExistent () {
      if (this.multipleUsers.length >= 5) {
        utils.toast('Você só pode logar em até 5 contas simultaneamente')
        return
      }
      this.dialogAddAccount = false
      this.dialogAddAccountExistent = true
    },
    newLoginDone (data, key) {
      key = window.localStorage.getItem('$k')
      const d = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString()
      window.localStorage.setItem('u' + data.userId, d)
      // utils.setActiveUser(data.userId)
      this.registerLogin(data)
      this.dialogAddAccountExistent = false
      this.dialogAddAccount = false
      // this.$router.replace('/userProfile?userId=' + data.userId)
      this.loadData()
      utils.updateNextRoute.set(true)
      this.$router.replace('/myprofile?' + new Date().getTime())
      utils.loading.clear()
    },
    registerLogin (data) {
      const key = window.localStorage.getItem("$k");
      const d = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
      window.localStorage.setItem("u" + data.userId, d);
      // window.localStorage.removeItem('au')
      window.localStorage.setItem("au", data.userId);
      this.userInfo = utils.presentUserInfo();
      // this.userProfilePhotoUrl = utils.attachmentsAddress() + this.userInfo.profilePhoto + '?' + new Date().getTime()
      this.makeProfilePhotoUrl()
      this.getMyChurchInfo();
    },
  }
};
</script>
<style scoped>

.btnTempleClub {
  --background: linear-gradient(
  -45deg,
    #462523 0,
    #8c6325 18%, 
    #fad360 50%,
    #8c6325 68%,
    #462523 100%
  );
  animation: AnimateBG 8s ease infinite;
}

.profilephoto {
  width:104px;
  height:104px;
}
.vertical-center{
  margin: 0;
  position:relative;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}

.no-posts {
  top: 20%;
}

.story {
  box-shadow: 0px 0px 5px -2px;
  border-radius: 13px
}

pre {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

</style>