<template>
  <ion-page>
    <HeaderComponent title="Chat"/>

    <ion-content ref="elIonContent" style="--padding-bottom:calc(75px + var(--ion-safe-area-bottom));">
      
      <PhotoHandler
        v-show="startPhotoHandler"
        :start="startPhotoHandler"
        :allFiles="true"
        :noCrop="false"
        @captured="captured"
        @cancel="cancelPhotoHandler"
      />
      <div style="position: relative;">
        <transition name="fade">
          <ion-list v-if="showMessages" ref="listAnswerMsg" >
            <ion-infinite-scroll
              position="top"
              style="position: fixed;top:60px"
              @ionInfinite="moreData"
              :disabled="disableInfiniteScroll"
            >
              <ion-infinite-scroll-content></ion-infinite-scroll-content>
            </ion-infinite-scroll>
            <div v-for="message in messages" class="q-mt-sm" :key="message._id" :id="message._id">
              <ion-item-sliding>
                <ion-item lines="none" >
                  <ion-row :slot="message.createdBy.userId === userInfo.userId ? 'end' : 'start'" >
                    <div
                      :class="`chat-message ${message.tempId ? 'sent-temp-message' : message.createdBy.userId === userInfo.userId ? 'sent-message': 'received-message'} q-ma-xs q-pa-sm ${blinkMessageId === message._id ? 'blink-bg' : ''}`"
                    >
                      <ion-card v-if="message.answerMessage" class="ion-no-shadow" style="margin: 0;margin-bottom: 5px; padding: 10px;box-shadow: none; background-color: #fffcf6;color: #999693;" @click="clkAnswer(message)">
                        <div>{{ message.answerMessage.createdBy.name }}:</div>
                        <div v-if="message.answerMessage.text">{{ message.answerMessage.text }}</div>
                        <div v-else>Arquivo</div>
                      </ion-card>
                      <div v-if="message.messageData.file">
                        <img
                          v-if="message.messageData.file.mimetype.includes('image')" style="border-radius:0.5rem;"
                          :src="utils.attachmentsAddress() + message.messageData.file.filename"
                        >
                        <span v-else style="display:flex;align-items: center;">
                          <ion-icon size="small" :icon="attach"></ion-icon>
                          <span>Arquivo anexado</span>
                        </span>
                      </div>
                      <div v-else>
                        {{ message.messageData.text }}
                      </div>
                      <span
                        class="ion-float-right q-mt-xs text-caption q-ml-sm"
                        v-if="message.createdAt"
                      >{{ message.createdAt.createdAtLocale.split(' ')[1].substring(0,5) }}</span>
                    </div>
                  </ion-row>
                </ion-item>
                <ion-item-options :side="message.createdBy.userId === userInfo.userId ? 'end' : 'start'">
                  <ion-item-option style="text-transform: none;border-radius: 0.4rem;margin:3px;" color="primary" @click="clkMessage(message)">Detalhes</ion-item-option>
                  <ion-item-option style="text-transform: none;border-radius: 0.4rem;margin:3px;" color="secondary" @click="answerMessage(message)">Responder</ion-item-option>
                </ion-item-options>
              </ion-item-sliding>
            </div>
          </ion-list>
        </transition>
      </div>
      <div style="max-height: 900px;" ref="chatfooter" class="chat-footer transition ion-no-border">
        <!-- <transition name="fade"> -->

          <form v-if="showInput || $route.query.greetingMessage" style="position: relative;" ref="inputField" class="chat-input-form">
            <ion-item 
              v-if="isAnsweringMessage.isAnswering" lines="none" 
              style="position: absolute; top:-50px;--background: var(--ion-color-secondary);left: 0;border-radius: 0.5rem;" 
            >
              <ion-label class="ion-text-wrap">
                <p style="color: var(--ion-color-tertiary);">Respondendo: {{ isAnsweringMessage.message.messageData.text }}</p>
              </ion-label>
              <ion-icon :icon="close" color="tertiary" slot="end" @click="undoAnswerMessage"></ion-icon>
            </ion-item>
            <div style="display: flex;align-items: center;align-self: center;padding: 5px;gap: 5px;margin-bottom: 2px;" class="q-mx-xs ion-align-items-end">
              <ion-item v-if="showInput || $route.query.greetingMessage" mode="ios" lines="none" style="--border-radius: 3rem;width: 100%;--padding-start: 0;overflow: visible;">
                <ion-textarea 
                  mode="ios" 
                  @ionFocus="scrollToBottom"  
                  v-model="chatMessage"

                  auto-grow 
                  rows="1"  
                  class="chat-input q-mb-xs">
                </ion-textarea>
              </ion-item>
              <ion-button
                color="secondary"
                @mousedown="$event.preventDefault()"
                @click="insertMessage"
                v-if="chatMessage !== ''"
                size="small"
                shape="circle"
              >
                <ion-icon color="tertiary" slot="icon-only" :icon="send"></ion-icon>
              </ion-button>
              <ion-button color="secondary" size="small" v-else shape="circle" @click="clkAddAttachment">
                <ion-icon style="scale: 1.9;" color="tertiary" slot="icon-only" :icon="attach"></ion-icon>
              </ion-button>
            </div>
          </form>
        <!-- </transition> -->
      </div>
    </ion-content>
    
  </ion-page>
</template>
<script setup>
import HeaderComponent from '../components/HeaderComponent.vue'
import { defineComponent, ref, onMounted, onUnmounted  } from 'vue'
import LogoVivian from '/src/assets/icons/logo-vivian-simoes.svg'

import {
  IonPage,
  IonHeader, IonToolbar, IonTitle, IonImg, IonText,
  IonIcon, 
  IonTextarea, 
  IonContent, 
  IonButton, IonButtons,
  IonRow, IonCol,
  IonFooter,
  IonItem,
  IonInfiniteScroll,IonInfiniteScrollContent,
  IonItemSliding, IonItemOptions, IonItemOption, IonList, IonAvatar, IonLabel,
  IonCard,
  alertController
} from '@ionic/vue';
import { useFetch } from '../../src/composables/fetch.js';
import { send, attach, close, chevronBack } from 'ionicons/icons';
import utils from '../../src/composables/utils.js';
import PhotoHandler from '../components/PhotoHandler.vue'
import { io } from "socket.io-client";
import { masterServerRoute } from '../composables/masterServerRoutes'


</script>
<script>

export default defineComponent({
  name:'MessengerChat',
  data() {
    return {
      isAnsweringMessage: {
        isAnswering: false,
        message: {}
      },
      blinkMessageId: null,
      startPhotoHandler: false,
      step: 'initial',
      firstTime: true,
      send,
      attach,
      
      utils,
      isLoading: true,
      dialogDetailMessage: {
        open: false,
        data: {}
      },
      dialogDeleteMessage: {
        open: false,
        data: {}
      },
      chatMessage: '',
      userInfo: '',
      statusConnection: 'connected',
      messages: [],
      message: '',
      page: 0,
      pendingMessage: 'Você já tem uma solicitação de conexão para esta pessoa. Aguarde ela aprovar.',
      userNameAndPhoto: [],
      isLoadingMessages: false,
      disableInfiniteScroll: false,
      noMoreMessages: false,
      dialogAttachFile: {
        open: false
      },
      socket: null,
      relationId: null,
      stillTouching: false,
      interval: null,
      showInput: false,
      showMessages: false
    }

  },
  watch: {
    $route(to, from) {
      if (to.path !== '/tabs/messengerChat' && to.path !== '/messengerChat') {
        if (!this.$route.query.greetingMessage) this.chatMessage = ''
        setTimeout(() => {
          this.showInput = false
          this.showMessages = false
        },400)
      } else {
        setTimeout(() => {
          this.showInput = true
          this.showMessages = true
        },400)
      }
    }
  },
  mounted () {
    utils.loading.hide()
    this.getMessages()
    this.userInfo = utils.presentUserInfo()
    if(this.$route.query.greetingMessage){
      this.chatMessage = 'Olá, gostaria de agendar minha consulta!'
    } else {
      this.chatMessage = ''
    }
    this.startSocket()
    if (this.$route.path !== '/tabs/messengerChat' && this.$route.path !== '/messengerChat') {
        setTimeout(() => {
          this.showInput = false
          this.showMessages = false
        },500)
      } else {
        setTimeout(() => {
          this.showInput = true
          this.showMessages = true
        },500)
      }
  },
  beforeUnmount () {
    this.socket.disconnect()
  },
  methods: {
    clkBack () {
      console.log('clkBack?')
    },
    clkAnswer (answer) {
      let foundMsg = false
      this.messages.forEach(msg => {
        if (msg._id === answer.answerMessage.messageId) foundMsg = true
      })
      this.answerClickedId = answer.answerMessage.messageId
      if (!foundMsg) {
        utils.loading.show()
        this.getMessages(null, answer.answerMessage.createdAt.createdAtPosix, true)
      } else {
        this.scrollToMessage()
      }
    },
    async scrollToMessage () {
      await utils.sleep(100)
      const el = document.getElementById(this.answerClickedId);
      this.$refs.elIonContent.$el.scrollToPoint(0, el.offsetTop, 1000);
      this.blinkMessageId = this.answerClickedId
      await utils.sleep(2000)
      this.answerClickedId = null
      this.blinkMessageId = null
    },
    undoAnswerMessage () {
      this.isAnsweringMessage.isAnswering = false
      this.isAnsweringMessage.message = {}
    },
    answerMessage (msg) {
      this.$refs.listAnswerMsg.$el.closeSlidingItems()
      this.isAnsweringMessage.isAnswering = true
      this.isAnsweringMessage.message = msg
    },
    async clkMessage (message) {
      const d = `Data: ${message.createdAt.createdAtInFullLong} de  ${message.createdAt.createdAtYear}`
      const buttons = [{ text: 'Voltar', role: 'cancel' }]
      if (message.createdBy.userId === this.userInfo.userId) {
        buttons.push({
          text: 'Apagar mensagem',
          role: 'confirm',
          handler: () => {
            this.clkDeleteMessage(message._id)
          },
        })
      }
      const alert = await alertController.create({
        header: 'Detalhe',
        message: d,
        buttons
      });
      await alert.present();
    },
    clkDeleteMessage (messageId) {
      const opt = {
        method: 'POST',
        route: '/mobile/messenger/updateMessageStatus',
        body: {
					messageId,
          userId: this.userInfo.userId
        }
      }
			useFetch(opt).then(r => {
        this.findAndRemoveMessageFromArray(messageId)
        utils.toast("Mensagem apagada!")
      })
    },
    findAndRemoveMessageFromArray (id) {
      let ind
      this.messages.forEach((m, i) => {
        if (m._id === id) ind = i
      })
      if (ind) this.messages.splice(ind, 1)
    },
    clkAddAttachment () {
      this.step = 'addAttachment'
      this.startPhotoHandler = true
    },
    captured(img, imgBlob, fileName) {
      this.step = 'initial'
      this.startPhotoHandler = false
      this.insertMessage({
        file: imgBlob,
        fileName
      })
    },
    cancelPhotoHandler () {
      this.startPhotoHandler = false
      this.step = 'initial'
    },
    startSocket: async function () {
      const opt = {
        query: {
          type: 'messengerChat',
          connectionId: 'VSP-userId' + this.userInfo.userId
        }
      }
      this.socket = io(masterServerRoute(), opt)
      this.socket.on('newMessage', msg => { console.log('o carai do socket'); this.pushMessage(msg) })
    },
    pushMessage (msg) {
      console.log('do socket', msg)
      // if (msg.length === 0 || msg[0].createdBy.userId === this.userInfo.userId) return
      if (msg.createdBy.userId === this.userInfo.userId) return
      this.messages.push(msg)
      this.scrollToBottom()
    },
    clkAttachFile () {
      ''
    },
    async scrollToBottom() {
      await utils.sleep(100)
      this.$refs.elIonContent.$el.scrollToBottom(300)
      // await utils.sleep(300)
      this.disableInfiniteScroll = false
      // this.$refs.elIonContent.$el.scrollToBottom(100)
    },
    moreData (ev) {
      this.getMessages(ev)
    },
    getMessages (ev) {
      if (this.noMoreMessages) return
      const opt = {
        method: 'POST',
        route: '/mobile/messenger/getMessages',
        body: {
          // userId: this.$route.query.userId,
          firstPosix: this.messages[0] ? this.messages[0].createdAt.createdAtPosix : null,
          page: this.page
        }
      }
			useFetch(opt).then(r => {
        if (r.data.length === 0) {
          this.noMoreMessages = true
          this.disableInfiniteScroll = true
          return
        }
        this.noMoreMessages = false
        r.data.push(...this.messages)
        this.messages = r.data
        this.page++
        if (ev) ev.target.complete()
        else { console.log('veio daqui'); this.scrollToBottom() }
        this.showMessages = true
      })
    },
    insertMessage (file) {
      if (this.chatMessage.length < 1 && !file) return
      let optTemMsg
      if (file.file) optTemMsg = { file: file.file }
      else optTemMsg = { message: this.chatMessage }
      const tempId = this.insertTemporaryMessage(optTemMsg)
      
      const opt = {
        method: 'POST',
        route: '/mobile/messenger/insertMessage',
        body: {
          // userId: this.userNameAndPhoto.userId,
					text: this.chatMessage,
        }
      }
      if (file.file) {
        opt.file = [ file.file ]
        opt.filename = file.filename
      }
      if (this.isAnsweringMessage.isAnswering) {
        opt.body.answerMessage = {
          messageId: this.isAnsweringMessage.message._id,
          createdBy: {
            userId: this.isAnsweringMessage.message.createdBy.userId,
            name: this.isAnsweringMessage.message.createdBy.name,
          },
          createdAt: this.isAnsweringMessage.message.createdAt
        }
        if (this.isAnsweringMessage.message.messageData.file) {
          opt.body.answerMessage.filename = this.isAnsweringMessage.message.messageData.file.filename
          opt.body.answerMessage.mimetype = this.isAnsweringMessage.message.messageData.file.mimetype
        }
        else opt.body.answerMessage.text = this.isAnsweringMessage.message.messageData.text
      }
      this.chatMessage = ''
			useFetch(opt).then(r => {
        this.chatMessage = ''
        // this.messages.push(r.data[0])
        this.substituteTempMessage(tempId, r.data)
        this.noMoreMessages = false
        this.dialogAttachFile.open = false
        utils.loading.hide()
        this.scrollToBottom()
        this.undoAnswerMessage()
      })
    },
    insertTemporaryMessage (opt) {
      const now = new Date()
      const tempId = now.getTime()
      const objMsg = {
        createdBy: this.userInfo,
        messageData: {},
        tempId,
        createdAt: {
          createdAtLocale: `${now.getDate()} ${now.getHours()}:${now.getMinutes()}`
        }
      }
      if (opt.message) objMsg.messageData.text = opt.message
      else objMsg.messageData.text = 'Carregando...'
      this.messages.push(objMsg)
      this.scrollToBottom()
      return tempId
    },
    substituteTempMessage (id, msgData) {
      this.messages.forEach((msg,i) => {
        if (msg.tempId === id )this.messages[i] = msgData
      })
    },
  }
})
</script>
<style scoped>
ion-toolbar {
  /* --background: #FFFCF5; */
  --background: var(--ion-background-color)
}
.chat-message {
  border-radius:0.5rem;
  max-width: 250px; 
  color: var(--ion-color-primary);
  min-width: 70px;
}
.chat-message:active {
  background-color: var(--ion-color-light);
}
.sent-message {
  margin-right: 15px;
  background-color: var(--ion-color-tertiary);
}
.sent-temp-message {
  border-width: 2px;
  border-style: solid;
  border-color: var(--ion-color-tertiary)
}

.received-message {
  background-color: #e9dbce;
}
.blink-bg {
  animation: blinkingBackground 2s infinite;
}
@keyframes blinkingBackground{
  0%		{ background-color: #10c018;}
  25%		{ background-color: #1056c0;}
  50%		{ background-color: #ef0a1a;}
  75%		{ background-color: #254878;}
  100%	{ background-color: #04a1d5;}
}

ion-button[shape=circle] {
    --border-radius: 50%;
    width: 40px;
    height: 40px;
}
.text-caption {
  font-size: 12px;
  color: rgb(141, 141, 141);
}
.vertical-center {
  margin: 0;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}
ion-item {
  --inner-padding-end: 0;
  --inner-padding-start: 0;
}
.chat-input {
  /* background-color: rgb(216, 216, 216) ; */
  --padding-start: 0px;
  margin-inline:10px;
  overflow: visible;
  min-width: 100%;
}

.chat-input-form {
  position:relative;
  overflow: visible;
  min-height: 60px;
  margin-inline: 7px;
  padding-block: 3px;
  border-radius: 50px;
  background: var(--ion-color-primary);
  margin-bottom: var(--ion-safe-area-bottom);

}

.transition {
  transition: all 0.1000s ease-in-out;
}


.chat-footer {
  background: linear-gradient(rgba(0,0,0,0) 50%,var(--ion-color-background) 50%);
  padding-bottom: 0;
  margin-bottom: 0;
  width: 100%;
  position:fixed;
  bottom: 0;
}
.disapear {
  opacity: 0 
}


.fade-delay-enter-active,
.fade-delay-leave-active {
  transition-delay: 2s;
  transition: all 0.5s ease-in-out;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-delay-enter-from,
.fade-delay-leave-to {
  opacity: 0;
}

</style>
