<template>
  <ion-page>
    <ion-content>
      <HeaderComponent title="Editar perfil"/>
      <div>
        <div  class="ion-text-center q-mt-md">
          <ion-row class="ion-justify-content-center ion-text-center">
            <ion-col size="4" class="ion-justify-content-center ion-text-center">
              <div style="display:flex;justify-content:center;">
                <ion-avatar class="profilephoto">
                  <ion-img class="profilephoto" :src="userProfilePhotoUrl"/>
                </ion-avatar>
              </div>
              <ion-button
                class="q-mt-md"
                shape="round"
                fill="outline"
                style="text-transform:none; width: 120px;"
                @click="clkAddPhoto"
                mode="md"
                color="primary"
              >
                <ion-icon slot="start" :icon="camera"></ion-icon>
                Editar
              </ion-button>
            </ion-col>
          </ion-row>
          <div class="q-mx-md">
            <div>
              <ion-item fill="outline" mode="md" class="q-mt-md">
                <ion-label position="floating">Nome</ion-label>
                <ion-input v-model="userProfileData.name"/>
              </ion-item>
            </div>
            <ion-item class=" q-mt-md" fill="outline" mode="md">
              <ion-label position="floating">Descrição</ion-label>
              <ion-input v-model="userProfileData.description"/>
            </ion-item>
            <ion-button
              class="q-mt-md"
              style="text-transform:none;"
              @click="saveEdit"
              expand="block"
              >
              Salvar alterações
            </ion-button>
          </div>
        </div>

      </div>

      <PhotoHandler
        v-show="startPhotoHandler"
        :start="startPhotoHandler"
        @captured="sendImage"
        @cancel="cancelPhotoHandler"
      />

    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonContent,
  IonInput,
  IonLabel,
  IonItem,
  IonImg,
  IonText,
  IonRow,IonCol,IonIcon,IonAvatar, IonButton
  
} from '@ionic/vue';
import { useFetch } from '../composables/fetch'
import utils from '../composables/utils'
import { camera } from 'ionicons/icons';
import PhotoHandler from '../components/PhotoHandler.vue'
import HeaderComponent from '../components/HeaderComponent.vue'
import default_avatar from '/src/assets/default_avatar.svg'
</script>

<script>
export default {
  name: "EditProfile",
  
  data() {
    return {
      imgBlob: null,
      startPhotoHandler: false,
      action: null,
      userInfo: {},
      userProfilePhotoUrl:'',
      userProfileData:{
        name: '',
        description: ''
      },
      openPhotoHandler: false,
      step: 'initial',
    };
  },
  mounted () {
    this.getUserProfileInfo()
    this.action = this.$route.query.action
  },
  methods: {
    makeProfilePhotoUrl () {
      const now = new Date()
      const time = now.getTime()
      const img =
        this.userProfileData.profileImage 
        ? `${utils.attachmentsAddress()}${this.userProfileData.profileImage.filename}?${time}`
        : default_avatar
      this.userProfilePhotoUrl = img
    },
    getUserProfileInfo: async function () {
      this.userInfo = utils.presentUserInfo()
      const opt = {
        method: 'POST',
        route: '/mobile/profile/getUserProfileInfo',
        body: {
          userId:  this.userInfo.userId,
        }
      }
      // utils.loading.show()
      useFetch(opt).then(r => {
        // utils.loading.hide()
        this.userProfileData = r.data
        this.makeProfilePhotoUrl()
        if (this.$route.query.action === "completeUserData") this.userInfo.name = ''
      })
    },
    updateUserData () {
      if (this.userProfileData.name === '') {
        return
      }
      const body = {
        name: this.userProfileData.name.replace(/[!@#$%¨&'"]/g, ''),
        description: this.userProfileData.description
      }
      const opt = {
        serverName: 'authentication',
        route: '/mobile/profile/updateUserInfo',
        body
      }
      // utils.loading.show()
      useFetch(opt).then(() => {
        // utils.loading.hide()
        utils.toast('Perfil atualizado')
        if (this.action === 'completeUserData') this.$router.replace('/tabs/home')
        // else this.$router.back()
      })
    },
    async sendImage (img, imgBlob) {
      this.startPhotoHandler = false

      const opt = {
        route: '/mobile/profile/saveUserImage',
        file: [ imgBlob ],
        fileTypes: ['camera'],
      }
      useFetch(opt).then(() => {
        this.step = 'initial'
        this.getUserProfileInfo()
      })
    },
  
    saveEdit () {
      this.updateUserData()
    },
    // captured(img, imgBlob, fileName, colors, type) {
      
    //   this.editedProfileInfo.userProfilePhoto = img
    //   this.imgBlob = imgBlob
    //   this.imageType = 'file'
    //   this.step = 'initial'
    //   this.sendImage()
    // },
    cancelPhotoHandler () {
      this.startPhotoHandler = false
      this.step = 'initial'
    },
    clkAddPhoto () {
      this.startPhotoHandler = !this.startPhotoHandler
      this.step = 'takePhoto'
    },
  }
};
</script>
<style>
  .profilephoto {
  width:104px;
  height:104px;
}

</style>