<template>
  <ion-page>
    <HeaderComponent
      title="Comentários"
    />
    <ion-content>
      <div
        v-for="comment in comments"
        :key="comment._id"
        ref="chatDiv"
        id="chatDiv"
      >
        <ion-row v-if="comment.createdBy.userId === userInfo.userId" class="ion-justify-content-end">
          <div 
            @click="clkCommentMenu(comment)" 
            style="border-radius:0.5rem;background-color: lightgreen;max-width: 280px;
            min-width: 70px;" class="q-ma-xs q-pa-sm"
          >
            <span class="text-caption">Você</span>
            <div>
              {{ comment.comment }} 
              <span 
                class="ion-float-right q-mt-xs text-caption q-ml-sm"
              >
                {{ comment.timestamps.createdAtLocale.split(' ')[1].substring(0,5) }}
              </span>
            </div>
          </div>
        </ion-row>
        <ion-row v-else class="ion-justify-content-start">
          <div 
            @click="clkCommentMenu(comment)" 
            style="border-radius:0.5rem;background-color: lightskyblue;max-width: 250px" 
            class="q-ma-xs q-pa-sm"
          >
            <span class="text-caption">{{comment.createdBy.name}}</span>
            <div>
              {{ comment.comment }} 
              <span class="ion-float-right q-mt-xs text-caption q-ml-sm">{{ comment.timestamps.createdAtLocale.split(' ')[1].substring(0,5) }}</span>
            </div>
          </div>
        </ion-row>
      </div>
      <ion-infinite-scroll v-if="!pagination.noMore" @ionInfinite="getCommentsByPostId">
        <ion-infinite-scroll-content></ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
    <ion-footer>
      <form :style="footerColor">
        <ion-row class="q-mx-xs ion-align-items-end">
          <ion-col size="10">
            <ion-item
              fill="outline"
              lines="none" 
              style="border-radius: 15px"
            >
              <ion-textarea v-model="newCommentData.text" auto-grow rows="1" class="chat-input q-mb-xs">
              </ion-textarea>
            </ion-item>
          </ion-col>
          <ion-col size="2">
            <ion-button @click="clkSendComment" size="small" shape="circle">
              <ion-icon slot="icon-only" :icon="send"></ion-icon>
            </ion-button>
          </ion-col>
        </ion-row>
      </form>
    </ion-footer>
  </ion-page>
</template>

<script setup>

import {
  IonPage,
  IonRow, IonCol, IonIcon,
  IonContent, IonButton, IonFooter, IonTextarea, alertController,IonItem,
  IonInfiniteScroll, IonInfiniteScrollContent
} from '@ionic/vue';
import { send } from 'ionicons/icons';
import { useFetch } from '../composables/fetch'
import utils from '../composables/utils'
import HeaderComponent from '../components/HeaderComponent.vue'

</script>

<script>
export default {
  name: "PostComments",
  mounted () {
    utils.loading.hide()
    this.getCommentsByPostId()
    this.userInfo = utils.presentUserInfo()
  },
  data() {
    return {
      send,
      dialogDetailComment: {
        open: false,
        data: {}
      },
      dialogDeleteComment: {
        open: false,
        data: {}
      },
      userInfo: {},
      transition: {
        enter: 'slide-up',
        exit: 'slide-down'
      },
      newCommentData: {
        text: '',
        location: '',
        geolocationInfo: ''
      },
      comments: [],
      pagination: {
        page: 0,
        noMore: false
      },
      footerColor: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'background: #0d0d0d' : 'background: #f5f5f5'
    };
  },
  methods: {
    async clkDeleteCommentMenu (comment) {
      const alert = await alertController.create({
        header: 'Confirma?',
        subHeader: 'O comentário será excluído',
        message: 'Esta ação não poderá ser desfeita',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              // handlerMessage.value = 'Alert canceled';
            },
          },
          {
            text: 'Confirma',
            role: 'confirm',
            cssClass: 'alert-button-danger',
            handler: () => {
              this.clkDeleteComment(comment)
            },
          },
        ]
      });
      await alert.present();
    },
    async clkCommentMenu (comment) {
      if (comment.createdBy.userId === this.userInfo.userId) {
        const alert = await alertController.create({
          header: 'Opções do comentário',
          buttons: [
            {
              text: 'Dados',
              role: 'commentData',
              handler: () => {
                this.clkDetailComment(comment)
              },
            },
            {
              text: 'Apagar',
              role: 'delete',
              cssClass: 'alert-button-danger',
              handler: () => {
                this.clkDeleteCommentMenu(comment)
              },
            },
            {
              text: 'Sair',
              role: 'exit',
              handler: () => {
                // this.clkDeleteComment()
              },
            },
          ]
        });
        await alert.present();
      } else {
        const alertStranger = await alertController.create({
          header: 'Opções do comentário',
          buttons: [
            {
              text: 'Dados',
              role: 'commentData',
              handler: () => {
                this.clkDetailComment(comment)
              },
            },
            {
              text: 'Sair',
              role: 'exit',
              handler: () => {
                // this.clkDeleteComment()
              },
            },
          ]
        });
        await alertStranger.present();
      }
    },
    async clkDetailComment (comment) {
      const alert = await alertController.create({
        header: 'Dados do comentário',
        subHeader: 'Enviado por ' + comment.createdBy.name + ' na data ' + comment.timestamps.createdAtLocale,
        buttons: [
          {
            text: 'Sair',
            role: 'exit',
            handler: () => {
              // this.clkDeleteComment()
            },
          },
        ]
      });
      await alert.present();
    },
    clkDeleteComment (comment) {
      const commentId = comment._id
      const opt = {
        method: 'POST',
        route: '/social/updatePostCommentStatus',
        body: {
					commentId,
          userId: this.userInfo.userId,
          postId: this.$route.query._id
        }
      }
      console.log(opt)
			useFetch(opt).then(() => {
        this.pagination.noMore = false
        this.pagination.page = 1
        this.comments = []
        this.getCommentsByPostId()
        // this.$q.notify("Comentário apagado!")
      })
    },
    
    clkReactions () {
      this.$emit('userActionDone', 'clkReactionsButton')
    },
    // clkProfileUser(comment) {
    //   // const userId = comment.createdBy.userId
    //   // this.$router.push('/userProfile?userId=' + userId )
    // },
    clkSendComment () {
      if (this.newCommentData.text === '') return
      const opt = {
        route: '/mobile/social/newComment',
        body: {
          postId: this.$route.query._id,
          commentData: this.newCommentData,
          // postUserId: this.selectedPost.createdBy.userId
        }
      }
      useFetch(opt).then(r => {
        this.newCommentData.text = ''
        this.pagination.page = 0
        this.pagination.noMore = false
        this.comments = r.data
      })
    },
    getCommentsByPostId (event) {
      if (this.pagination.noMore) return
        const opt = {
          route: '/mobile/social/getCommentsByPostId',
          body: {
            postId: this.$route.query._id,
            page: this.pagination.page
          }
        }
        this.isLoading = true
        useFetch(opt).then(r => {
          if (r.data.length === 0) {
            this.pagination.noMore = true
            return
          }
          r.data.push(...this.comments)
          this.comments.push(...r.data)
          this.pagination.page++
          if (r.data.length === 0) this.pagination.noMore = true
          else this.pagination.noMore = false
          if (event) event.target.complete()
        })

    },
  },
};
</script>

<style scoped>
ion-input.custom {
  border-radius: 20px;
}
ion-item.border {
  border-radius: 20px;
}
ion-list.border {
  border-radius: 20px;
}
.chat-input {
  border-radius: 0.5rem;
  --padding-start: 10px;
  --padding-end: 10px;
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
</style>