<template>
  <ion-page>
    <!-- <HeaderComponent
      :templeClub="true"
    /> -->
    <ion-header no-border>
      <ion-toolbar>
        <ion-segment value="chat" @ionChange="changeSlideTo" mode="md">
          <ion-segment-button style="text-transform:none" value="chat">
            <ion-icon :icon="chatboxEllipsesOutline" class="outlined"></ion-icon>
            Conversas
          </ion-segment-button>
          <ion-segment-button style="text-transform:none" value="conections">
            <ion-icon :icon="peopleOutline"></ion-icon>
            Conexões
          </ion-segment-button>
          <ion-segment-button style="text-transform:none" value="solicitations">
            <ion-icon :icon="personAddOutline"></ion-icon>
            Solicitações
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-progress-bar type="indeterminate" v-if="progressBar"></ion-progress-bar>
      <div class="slide" v-if="slide === 'chat'">
        <ion-list lines="full" class="q-pt-sm">
          <ion-item 
            v-for="item in resumeMessages"
            :key="item._id.userId"
            button 
            detail="false"
            @click="clkConectedUser(item)"
          >
            <ion-avatar>
              <img :src="utils.attachmentsAddress() + item._id.profilePhoto  + '_thumbnail'" />
            </ion-avatar>
            <ion-label class="q-pl-md">
              <h4>{{ item._id.name }}</h4>
              <p>	
                <span v-if="item.messages.userId === userInfo.userId">Você: </span>
                {{ item.messages.message }} 
              </p>
            </ion-label>
            <ion-label slot="end" class="ion-text-end">
              <p>{{ item.messages.timestamps.createdAtInFullShort }}</p>
              <p>{{ item.messages.timestamps.createdAtLocale.split(' ')[1] }}</p>
            </ion-label>
          </ion-item>
        
        </ion-list>
      </div>

      <div class="slide" v-if="slide === 'conections'">
        <ion-searchbar 
          :debounce="1000" 
          placeholder="Buscar conexões" 
          @ionChange="getUsersConnectedByString($event)" 
          @keyup.enter="getUsersConnectedByString($event)"
        />
        <div v-if="showConnectedResult">
            <h6 class="q-ml-md " v-if="resultSearch > [0]">Resultado da busca</h6>
            <h6 class="q-ml-md" v-else>Nenhum resultado encontrado</h6>
            <ion-list lines="none">
              <ion-item
                v-for="item in resultSearch"
                :key="item._id"
                button
                @click="clkConnectionSearchResult(item)"
              >
              <ion-avatar>
                <img :src="utils.attachmentsAddress() + item.arrayUsers.profilePhoto + '_thumbnail'" />
              </ion-avatar>
              <ion-label class="q-pl-md">
                <h4>{{ item.arrayUsers.name }}</h4>
              </ion-label>
              </ion-item>
            </ion-list>
        </div>
        <div v-if="!showConnectedResult">
          <ion-list lines="none" class="q-pt-sm">
            <ion-item
              v-for="item in myConnectionsSolicitations.connected"
              :key="item.arrayUsers.userId"
              button 
              detail="false"
              @click="clkConectedUser(item)"
            >
              <ion-avatar>
                <img :src="utils.attachmentsAddress() + item.arrayUsers.profilePhoto + '_thumbnail'" />
              </ion-avatar>
              <ion-label class="q-pl-md">
                <h4>{{ item.arrayUsers.name }}</h4>
              </ion-label>
            </ion-item>
          </ion-list>
        </div>
      </div>

      <div class="slide" v-if="slide === 'solicitations'">
        <ion-searchbar 
          :debounce="1000" 
          placeholder="Buscar pessoas" 
          @ionChange="getUsersByStringTotal($event)" 
          @keyup.enter="getUsersByStringTotal($event)"
        />
        <div v-if="showSolicitationsResult">
          <h6 class="q-ml-md" v-if="resultSearchSolicitation.allUsers > [0]">Resultados da busca</h6>
          <h6 class="q-ml-md" v-else>Nenhum resultado encontrado</h6>
          <ion-list lines="none" class="q-mt-sm">
            <ion-item
              v-for="item in resultSearchSolicitation.allUsers"
              :key="item.userId"
              @click="$router.push('/messengerChat?userId=' + item.userId), showSolicitationsResult = false"
            >
              <ion-avatar>
                <img :src="utils.attachmentsAddress() + item.profilePhoto + '_thumbnail'" />
              </ion-avatar>
              <ion-label class="q-ml-md">
                <h4 class="ion-no-margin ion-no-padding">{{ item.name }}</h4>
                <p class="ion-no-margin ion-no-padding">@{{ item.user }}</p>
              </ion-label>
            </ion-item>
          </ion-list>
        </div>
        <p v-if="myConnectionsSolicitations.toMe.length > 0" class="q-ml-sm">Querem se conectar com você</p>
        <ion-list lines="none">
          <ion-item
            v-for="item in myConnectionsSolicitations.toMe"
            :key="item._id"
            button 
            detail="false"
            @click="clkApproveReproveConnection(item)"
          >
            <ion-avatar>
              <img :src="utils.attachmentsAddress() + item.messenger.connectionSolicitation.from.profilePhoto + '_thumbnail'" />
            </ion-avatar>
            <ion-label class="q-pl-md">
              <h4>{{ item.messenger.connectionSolicitation.from.name }}</h4>
              <p>Solicitado em {{ item.messenger.connectionSolicitation.timestamps.createdAtInFullShort }}</p>
            </ion-label>
            <ion-label slot="end" class="ion-text-end">
            </ion-label>
          </ion-item>
        </ion-list>
        <div v-if="!showSolicitationsResult">
          <p  v-if="myConnectionsSolicitations.fromMe.length > 0" class="q-pl-sm">Seus pedidos de conexão aguardando</p>
          <ion-list lines="none">
            <ion-item 
              v-for="item in myConnectionsSolicitations.fromMe"
              :key="item._id"
              button 
              detail="false"
              @click="clkConnectionSolicitation()"
            >
              <ion-avatar>
                <img :src="utils.attachmentsAddress() + item.messenger.connectionSolicitation.to.profilePhoto + '_thumbnail'" />
              </ion-avatar>
              <ion-label class="q-pl-md">
                <h4>{{ item.messenger.connectionSolicitation.to.name }}</h4>
                <p>Solicitado em {{ item.messenger.connectionSolicitation.timestamps.createdAtInFullShort }}</p>
              </ion-label>
              <ion-label slot="end" class="ion-text-end">
              </ion-label>
            </ion-item>
          </ion-list>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
<script setup>
import {
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonPage, IonContent,
  IonItem, IonLabel, IonList, IonAvatar,
  IonSearchbar,
  alertController,
  IonHeader,
  IonToolbar,
  IonProgressBar
} from '@ionic/vue';
import { chatboxEllipsesOutline, peopleOutline, personAddOutline } from 'ionicons/icons'
import { defineComponent } from 'vue'
import { io } from "socket.io-client"
import { useFetch } from '../../src/composables/fetch.js'
import utils from '../../src/composables/utils.js'
import HeaderComponent from '../components/HeaderComponent.vue'
import { masterServerRoute } from '../composables/masterServerRoutes'
</script>
<script>

export default defineComponent({
  name: 'MessengerView',
  props: ['routeName'],
  data () {
    return {
      utils,
      slide: 'chat',
      btnLoading: false,
      dialogDetailWaitingCnt: false,
      tab: 'conversations',
      pendingMessage: 'Você já tem uma solicitação de conexão para esta pessoa. Aguarde ela aprovar.',
      userInfo: '',
      filterValue: '',
      filterValueSolicitation: '',
      messagesLoaded: false,
      text:'',
      users: [],
      messages: [],
      message: '',
      resultSearch: [],
      usersConnected: [],
      showSolicitationsResult: false,
      showConnectedResult: false,
      newConnection: [],
      resultSearchSolicitation: {
        allUsers: [],
      },
      myConnectionsSolicitations: {
        toMe: [],
        fromMe: [],
        connected: []
      },
      resumeMessages: [],
      socket: null,
      progressBar: false
    }
  },
  mounted () {
    utils.loading.clear()
    this.userInfo = utils.presentUserInfo()
    this.getConnectionsSolicitations()
    this.getResumeMessages()
    this.startSocket()
    // if (this.$route.query.tab) this.tab = this.$route.query.tab
  },
  beforeUnmount () {
    console.log('no before unouubnt')
    this.socket.disconnect()
  },
  ionViewDidEnter () {
    console.log('entrou')
  },
  watch: {
    $route(to) {
      if (to.path === '/tabs/messenger') {
        console.log('poc')
        this.startView()
      }
    }
  },
  methods: {
    startView () {
      this.userInfo = utils.presentUserInfo()
      this.getConnectionsSolicitations()
      this.getResumeMessages()
      this.showSolicitationsResult = false
      console.log('caraiaiaiaiai')
      if (this.$route.query.to) {
        
        console.log(this.$route.query.to)
      }
    },
    startSocket: async function () {
      console.log('no tart socket')
      const opt = {
        query: {
          type: 'messengerResume',
          userId: this.userInfo.userId
        }
      }
      this.socket = io(masterServerRoute(), opt)
      this.socket.on('newMessage', msg => { this.getResumeMessages() })
    },
    clkConnectionSearchResult (item) {
      console.log(item)
      this.$router.push('/messengerChat?userId=' + item.arrayUsers.userId)
    },
    getResumeMessages () {
      const opt = {
        route: '/messenger/getResumeMessages'
      }
      useFetch(opt).then(r => {
        this.resumeMessages = r.data
      })
    },
    confirmApproveReproveConnectionSolicitation (type,id) {
      const opt = {
        route: '/messenger/changeStatusConnectionSolicitation',
        body: {
          newStatus: type,
          solicitationId: id
        }
      }
      utils.loading.show()
      useFetch(opt).then(() => {
        utils.loading.hide()
        this.getConnectionsSolicitations()
      })
    },
    clkApproveReproveConnection: async function (item) {
      console.log('aceito', item)
      const alert = await alertController.create({
          header: 'Permite que ' + item.messenger.connectionSolicitation.from.name + ' se conecte a você?',
          subHeader: 'Vocês poderão conversar após a aprovação',
          buttons: [
            {
              text: 'Negar',
              handler: () => {
                this.confirmApproveReproveConnectionSolicitation('declined',item._id)
              },
            },
            {
              text: 'Permitir',
              role: 'confirm',
              handler: () => {
                this.confirmApproveReproveConnectionSolicitation('accepted',item._id)
              },
            },
          ],
        });
        await alert.present();

    },
    // getStatusUserConnection() {
    // 	const opt = {
    //     method: 'POST',
    //     route: '/messenger/getStatusUserConnection',
    //     body: {
    // 			userId: this.messengerDetailDialog.details.arrayUsers.userId,
    //     }
    //   }
    // 	useFetch(opt).then(r => {
    //     this.newConnection = r.data
    //   })
    // },
    getConnectionsSolicitations() {
      const opt = {
        method: 'POST',
        route: '/messenger/getConnectionsSolicitations',
      }
      useFetch(opt).then(r => {
        // utils.loading.hide()
        this.myConnectionsSolicitations = r.data
      })
    },
    getUsersConnectedByString(event) {
      if (event.target.value.toLowerCase().length > 2) {
        const opt = {
          method: 'POST',
          route: '/messenger/findConnectionsByString',
          body: {
            filterValue: event.target.value.toLowerCase(),
          }
        }
        this.progressBar = true
        useFetch(opt).then(r => {
          this.progressBar = false
          this.resultSearch = r.data
          this.showConnectedResult = true
        })
      } else if (event.target.value.toLowerCase().length <= 2) {
        this.showConnectedResult = false
      }
    },
    getUsersByStringTotal(event) {
      if (event.target.value.toLowerCase().length > 2) {
        const opt = {
          method: 'POST',
          route: '/messenger/findUsersByString',
          body: {
            searchString: event.target.value.toLowerCase(),
            searchProfiles: true
          }
        }
        this.progressBar = true
        useFetch(opt).then(r => {
          this.progressBar = false
          this.resultSearchSolicitation = r.data
          this.showSolicitationsResult = true
        })

      } else if (event.target.value.toLowerCase().length <= 2) {
        this.showSolicitationsResult = false
      }

    },
    // getUsersByStringSolicitation() {
    // 	const opt = {
    //     method: 'POST',
    //     route: '/messenger/findUsersByString',
    //     body: {
    // 			searchString: this.filterValueSolicitation,
    //     }
    //   }
    // 	this.btnLoading = true
    // 	useFetch(opt).then(r => {
    // 		this.btnLoading = false
    //     this.resultSearchSolicitation = r.data
    // 		this.showResult = true
    //   })
    // },
    // getUsersConnectedById () {
    // 	const opt = {
    //     method: 'POST',
    //     route: '/messenger/getUsersConnectedById',
    //     body: {
    //       userId: this.$route.query.userId
    //     }
    //   }
    // 	useFetch(opt).then(r => {
    //     this.usersConnected = r.data
    //   })
    // },
    clkConnectionSolicitation: async function () {
      const alert = await alertController.create({
          header: 'Atenção',
          message: 'Você deve aguardar essa pessoa aceitar o seu pedido de conexão.',
          buttons: ['OK'],
        })
        await alert.present();
      
    },
    clkConectedUser (item) {
      console.log(item)
      const userId = item.arrayUsers ? item.arrayUsers.userId : item._id.userId
      this.$router.push('/messengerChat?userId=' + userId)
    },
    clkSearchResult (item) {
      const userId = item.userId
      this.$router.push('/messengerChat?userId=' + userId)
    },
    getUsersFromCompany () {
      const opt = {
        route: '/profile/getUsersFromCompany',
        // body: {
        //   searchString: this.addUserToGroup.searchString
        // }
      }
      useFetch(opt).then(r => {
        this.users = r.data
      })
    },
    changeSlideTo() {
      console.log(this.$el.querySelector("ion-segment").value)
      this.slide = this.$el.querySelector("ion-segment").value
    }
  }
});
</script>
