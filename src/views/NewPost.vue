<template>
  <ion-page>
    <ion-content class="ion-padding">
      <HeaderComponent
        title="Novo Post"
      />
      <PhotoHandler
        v-show="startPhotoHandler"
        :start="startPhotoHandler"
        @captured="captured"
        @cancel="cancelPhotoHandler"
      />
      <div>
        <img
          :src="image"
          class="q-my-sm"
          />
          <ion-item fill="outline" class="q-mt-md">
            <ion-label position="floating">No que você está pensando?</ion-label>
            <ion-textarea v-model="newPostData.text" auto-grow rows="1"></ion-textarea>
          </ion-item>
          <ion-item fill="outline" class="q-mt-md">
            <ion-label position="floating">Localização</ion-label>
            <ion-input v-model="newPostData.location" rows="1"></ion-input>
          </ion-item>
          <ion-item fill="outline" class="q-mt-md" v-if="clkLink">
            <ion-label position="floating">Link</ion-label>
            <ion-input v-model="newPostData.link.text" rows="1"></ion-input>
            <ion-note slot="helper">Você pode colocar links de matérias ou vídeos do Youtube</ion-note>
          </ion-item>
          <ion-item v-if="permissionsToCheck.CAN_NOTIFY_ALL_USERS_FROM_CHURCH === 1" class="q-mb-md" lines="none">
            <ion-label><small>Notificar membros da igreja</small></ion-label>
            <ion-toggle v-model="newPostData.notifyChurchMembers" slot="end"></ion-toggle>
          </ion-item>
        <div class="q-my-md">
          <ion-button
            shape="round"
            fill="outline"
            style="text-transform:none"
            v-if="!image"
            @click="clkAddLink"
            mode="md"
            color="primary"
          >
            <ion-icon slot="start" :icon="!clkLink ? add : remove"></ion-icon>
            Link
          </ion-button>
          <ion-button
            shape="round"
            fill="outline"
            style="text-transform:none"
            @click="takePhoto"
            v-if="!image && !clkLink"
            mode="md"
            color="primary"
          >
            <ion-icon slot="start" :icon="camera"></ion-icon>
            Foto
          </ion-button>
          <ion-button
            shape="round"
            fill="outline"
            style="text-transform:none"
            @click="removePhoto"
            v-if="image"
            mode="md"
            color="primary"
          >
            <ion-icon slot="start" :icon="camera"></ion-icon>
            Remover Foto
          </ion-button>
        </div>
        <ion-button
          expand="block"
          @click="clkVisualizePost"
        >Visualizar post</ion-button>
        <!-- <div v-if="userInfo.onlyMembersPost === 0 || permissionsToCheck.CAN_CREATE_POSTS === 0">
          <ion-item lines="none" class="q-mt-md">
            <ion-icon :icon="alertCircle" slot="start" color="warning"></ion-icon>
            <ion-label class="ion-text-wrap">
              <h3>Postagem de perfil</h3>
              <p>Você não possui acesso para postagem pública.</p>
              <p>Para poder postar publicamente fale com o responsável por sua igreja.</p>
            </ion-label>
          </ion-item>
        </div> -->
      </div>

      <ion-modal ref="modal-visualize-post" :isOpen="modalOpen">
        <ion-content class="">
          <CardPost
            type="preVisualize"
            :objPost="newPostData"
            :userInfo="userInfo"
            v-if="modalOpen"
            class="q-mb-md"
            :attachmentsAddress="utils.attachmentsAddress()"
          />
          <ion-button
            expand="block"
            style="text-transform:none"
            class="q-mb-sm"
            @click="savePost"
          >Criar post</ion-button>
          <ion-button
            expand="block"
            fill="outline"
            style="text-transform:none"
            @click="modalOpen = false"
          >Voltar</ion-button>
          <!-- <div v-if="userInfo.onlyMembersPost === 0 || permissionsToCheck.CAN_CREATE_POSTS === 0">
            <ion-item lines="none" class="q-mt-md">
              <ion-icon :icon="alertCircle" slot="start" color="warning"></ion-icon>
              <ion-label class="ion-text-wrap">
                <h3>Postagem de perfil</h3>
                <p>Você não possui acesso para postagem pública.</p>
                <p>Para poder postar publicamente fale com o responsável por sua igreja.</p>
              </ion-label>
            </ion-item>
          </div> -->
        </ion-content>
      </ion-modal>

    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonContent,
  IonIcon,
  IonButton,
  IonItem,
  IonInput,
  IonLabel,
  IonTextarea,
  IonNote,
  IonModal,
  loadingController,
  IonToggle
} from '@ionic/vue';
import { camera, add, remove } from 'ionicons/icons';
import { useFetch } from '../composables/fetch'
import utils from '../composables/utils'
import PhotoHandler from '../components/PhotoHandler.vue'
import CardPost from '../components/CardPost.vue'
import HeaderComponent from '../components/HeaderComponent.vue'

</script>

<script>
export default {
  name: 'NewPostView',
  data () {
    return {
      startPhotoHandler: false,
      step: 'initial',
      image: null,
      clkLink: false,
      newPostData: {
        text: '',
        image: null,
        imageBlob: null,
        imageType: null, // link ou file ou null
        width: 0,
        height: 0,
        location: '',
        geolocationInfo: {},
        link: {
          text: '',
        },
        ogLink: {},
        profilePhoto: '',
        notifyChurchMembers: false
      },
      modalOpen: false,
      userInfo: {},
      permissionsToCheck: {
        CAN_NOTIFY_ALL_USERS_FROM_CHURCH: 0,
        CAN_CREATE_POSTS: 0
      },
    }
  },
  mounted () {
    // this.getGeoLocation()
    utils.getUserPermissionByRole(this.permissionsToCheck).then(r => {
      Object.keys(r.data).forEach(k => {
        this.permissionsToCheck[k] = r.data[k]
      })
    })
    this.getUserInfo()
    
  },
  methods: {
    async getUserInfo () {
      const userInfo = await utils.getUserInfoByToken()
      this.userInfo = userInfo.data
      console.log('entrou get user info new post', this.userInfo.onlyMembersPost)
    },
    savePost: async function () {
      console.log(this.newPostData.imageType, 'imageType 0')
      const type = this.$route.query.type
      let body = this.newPostData
      body.postDestination = type
      body.poster = {
        avatar: this.userInfo.profilePhoto,
        name: this.userInfo.name
      }
      if (type === 'community') body.communityId = this.$route.query.communityId
      if (this.newPostData.imageType === 'link' || !this.newPostData.imageType) {
        body = { body }
      }
      const opt = {
        body,
        route: '/mobile/social/newPost'
      }
      console.log(this.newPostData.imageType, 'imageType')
      if (this.newPostData.imageType === 'file') {
        console.log('entrou auqi?')
        const file = await fetch(this.newPostData.image)
        const fileBlob = await file.blob()
        opt.file = [ fileBlob ]
      }
      opt.body.image = null
      utils.loading.show()
      useFetch(opt).then(r => {
        utils.loading.hide()
        if (r.error) return
        this.modalOpen = false
        this.resetNewPostData()
        utils.toast('Publicação criada com sucesso. Em breve ela aparecerá na sua linha do tempo')
        if (type === 'social') this.$router.push('/tabs/home')
        if (type === 'kids') this.$router.push('/kids')
        if (type === 'community') this.$router.push('/communityDetail?communityId=' + this.$route.query.communityId)
      })
    },
    async getLinkImage () {
      const opt = {
        route: '/social/getOgFromUrl',
        body: {
          url: this.newPostData.link.text
        }
      }
      return useFetch(opt)
    },
    async clkVisualizePost () {
      
      if (this.newPostData.link.text !== '') {
        this.newPostData.imageType = 'link'
        utils.loading.show()
        const og = await this.getLinkImage()
        utils.loading.hide()
        if (!og.error) {
          this.newPostData.ogLink = og.data
          if (this.newPostData.text === '') this.newPostData.text = this.newPostData.ogLink.description
          this.newPostData.image = og.data.image
        } else {
          this.newPostData.ogLink = false
        }
      } else if (this.image) {
        this.newPostData.imageType = 'file'
        this.newPostData.image = this.image
      }
      this.modalOpen = true
    },
    captured(img) {
      this.image = img
      this.step = 'initial'
      this.newPostData.imageType = 'file'
      this.startPhotoHandler = false
    },
    takePhoto() {
      this.step = 'takePhoto'
      this.startPhotoHandler = true
    },
    cancelPhotoHandler () {
      this.startPhotoHandler = false
    },
    removePhoto () {
      this.image = null
      this.newPostData.imageType = null
    },
    clkAddLink () {
      this.clkLink = !this.clkLink
      if (!this.clkLink) {
        this.newPostData.link = {
          text: ''
        }
        this.newPostData.ogLink = {}
        this.newPostData.imageType = null
      }
    },
    async getGeoLocation () {
      const loading = await loadingController.create({
        message: 'Aguarde',
      });
      const coordinates = await utils.getGeoLocation()
      if (coordinates) this.saveCoords(coordinates.coords)
    },
    saveCoords(coords) {
      this.newPostData.geolocationInfo.lat = coords.latitude
      this.newPostData.geolocationInfo.lng = coords.longitude

    },
    resetNewPostData () {
      this.step = 'initial'
      this.image = null
      this.clkLink = false
      this.newPostData = {
        text: '',
        image: null,
        imageBlob: null,
        imageType: null, // link ou file ou null
        width: 0,
        height: 0,
        location: '',
        geolocationInfo: {},
        link: {
          text: '',
        },
        ogLink: {},
        profilePhoto: ''
      }
    }
  },
}
</script>

