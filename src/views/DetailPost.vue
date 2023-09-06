<template>
  <ion-page>
    <HeaderComponent
      title="Detalhes da publicação"
    />
    <ion-content>
      <div class="q-pa-sm q-mb-xl">
        <CardPost
          class="q-ma-none"
          :objPost="detailPost"
          v-if="detailPost"
          @openCommentPost="openCommentPost()"
          @openDialogDeletePost="dialogDeletePost = true"
          @userActionDone="userActionDone"
          :userInfo="userInfo"
          :attachmentsAddress="attachmentsAddress"
          @clkImagePost="clkImagePost"
          @reportPost="reportPost"
          @openReactionPost ="openReactionPost"
          @clkLinkPost="clkAttachment"
        />
        <DialogNewComment
          :open="openDialogNewComment"
          @closeDialogNewComment="openDialogNewComment = false"
          :selectedPost="detailPost"
          :userInfo="userInfo"
          @userActionDone="userActionDone"
        ></DialogNewComment>
        <DialogDeletePostConfirm
          :openDeletePost="dialogDeletePost"
          @closeDialogDelete="dialogDeletePost = false"
          :selectedPost="detailPost"
          :userInfo="userInfo"
        ></DialogDeletePostConfirm>
      </div>
      <ion-modal :is-open="dialogImagePost.open">
        <ion-header class="ion-no-border">
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button @click="dialogImagePost.open = false">Fechar</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <img
            :src="dialogImagePost.type === 'preVisualize' ? dialogImagePost.image : attachmentsAddress + dialogImagePost.image"
            class="my-image"
          />
        </ion-content>
      </ion-modal>

    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonHeader, IonToolbar, IonButtons,
  IonContent,
  alertController,
  IonButton,
  IonModal,

  
} from '@ionic/vue';
import { useFetch } from '../composables/fetch'
import utils from '../composables/utils'
import DialogDeletePostConfirm from '../components/DialogDeletePost.vue'
import CardPost from '../components/CardPost.vue'
import DialogNewComment from '../components/DialogNewComment.vue'
import HeaderComponent from '../components/HeaderComponent.vue'
</script>

<script>
export default {
  name: "DetailPost",
  data() {
    return {
      detailPost: {
        _id: {},
        createdBy: {
          userId: ''
        },
        poster: {}
      },
      comments: [],
      openDialogReport: false,
      openDialogNewComment: false,
      dialogDeletePost: false,
      skip: 0,
      userInfo: {
        poster: {
          name:''
        }
      },
      selectedPost: {},
      attachmentsAddress: '',
      dialogImagePost: {
        open: false,
        image: null,
        type: null
      },
      dialogBrowser: {
        open: false,
        link: ''
      },
    };
  },
  beforeMount () {
    utils.loading.hide()
    this.userInfo = utils.presentUserInfo()
    // this.getCommentsByPostId ()
    this.getPostDetail()
    this.$emit('showHideToolbarButtons', false)
    this.attachmentsAddress = utils.attachmentsAddress()
    
  },
  methods: {
    getCommentsByPostId () {
      // console.log('aiushdusdi', this.skip)
      const opt = {
        method: 'POST',
        route: '/social/getCommentsByPostId',
        body: {
          postId: this.$route.query.postId,
          skip: this.skip,
        }
      }
      useFetch(opt).then(r => {
        this.comments = r.data
        this.skip += 3
      })
    },
    userActionDone (type, data) {
      if (type === 'newComment') this.getPostDataById(this.detailPost)
      else if (type === 'newReaction') this.updatePostData(data)
      else if (type === 'clkReactionsButton') this.openReactionsDialog()
      else if (type === 'clkReactionsQty') {
        // this.detailPost.data = data
        this.openReactionsDialog()
      }
    },
    openReactionsDialog () {
      this.dialogReactions = true
    },
    
    getPostDetail () {
      const opt = {
        method: 'POST',
        route: '/social/getPostById',
        body: {
          postId: this.$route.query.postId
        }
      }
      useFetch(opt).then(r => {
        this.detailPost = r.data
      })
    },
    clkImagePost (obj) {
      console.log(obj)
      this.dialogImagePost.image = obj.image
      this.dialogImagePost.type = obj.type
      this.dialogImagePost.open = true
    },
    clkAttachment (link) {
      this.dialogBrowser.link = link
      const url = this.attachmentsAddress() + link
      console.log(url)
      // openURL(link, this.errorOpenAttch)
    },
    openCommentPost () {
      const id = this.$route.query.postId
      this.$router.push('/postComments?_id=' + id)
    },
    openReactionPost () {
      const id = this.$route.query.postId
      this.$router.push('/postReactions?_id=' + id)
    },
    async reportPost (idPost) {
      const alert = await alertController.create({
        header: 'Confirma a denúncia?',
        subHeader: 'Explique o motivo de reportar esta postagem',
        message: 'Em breve ela será analisada',
        buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirma',
          role: 'confirm',
          cssClass: 'alert-button-danger',
          handler: () => {
            this.clkConfirmReportPost(idPost)
          },
        },
      ],
        inputs: [
          {
            label: 'É spam',
            type: 'radio',
            value: 'spam',
          },
          {
            label: 'Nudez',
            type: 'radio',
            value: 'nudity',
          },
          {
            label: 'discurso de ódio',
            type: 'radio',
            value: 'hateSpeech',
          },
          {
            label: 'Informação falsa',
            type: 'radio',
            value: 'falseInformation',
          },
          {
            label: 'Outra coisa',
            type: 'radio',
            value: 'other',
          },
        ],
      });

      await alert.present();
    // return { presentAlert };
    },
  },
};
</script>