<template>
  <ion-card style="border-radius: 12px;box-shadow: none;">
    <ion-card-content class="q-pa-none q-ma-none">
      <ion-item lines="none" color="light">
        <ion-avatar slot="start" @click="clkProfileUser">
          <!-- colocar foto de perfil no userinfo previsualize -->
          <img v-if="type === 'preVisualize'" :src="'../../assets/blank-profile-picture-973460.svg'"/>
          <img
            v-else
            :src="userProfilePhotoUrl"
          />
        </ion-avatar>
        <ion-label class="q-ml-sm">
          <h6 @click="clkProfileUser">{{ type === 'preVisualize' ? userInfo.name : obj.poster.name }}</h6>
          <p>{{ obj.location }}</p>
        </ion-label>
        <ion-button :id="objPost._id" fill="clear" color="primary" slot="end">
          <ion-icon :icon="ellipsisHorizontal"></ion-icon>
        </ion-button>
        <ion-popover 
          :dismiss-on-select="true" 
          :backdrop-dismiss="true" 
          style="--backdrop-opacity:0.01"
          :trigger="objPost._id">
          <ion-content>
            <ion-item lines="none" @click="$emit('reportPost', objPost._id)">
              Denunciar
            </ion-item>
            <ion-item
              lines="none"
              v-if="objPost.createdBy.userId === userInfo.userId"
              @click="$emit('openDialogDeletePost', objPost._id)"
            >
              Apagar
            </ion-item>
          </ion-content>
        </ion-popover>
      </ion-item>
    </ion-card-content>

      <!-- @click="reportPost"
      @click="openDialogDeletePost" -->


    <ion-card-content>
      <ion-text>{{ obj.text }}</ion-text>
    </ion-card-content>
    <div style="width: 100%" @click="$emit('clkImagePost', obj)" v-if="obj.image">
      <img
        :src="obj.image"
        style="width: 100%;"
        v-if="obj.imageType === 'link' && obj.ogLink"
        @click="openBrowser(obj.link.text)"
      />
      <img
        :src="type === 'preVisualize' ? obj.image : attachmentsAddress + obj.image"
        v-if="obj.imageType === 'file'"
        @click="clkImagePost"
        style="width: 100%;"
      />
    </div>

    <ion-item @click="openBrowser(obj.link.text)" button v-if="obj.link && obj.link.text !== ''" lines="none" color="light">
      <ion-label>
        <p>{{ obj.ogLink.name }}</p>
        <h3>{{ obj.ogLink.title }}</h3>
      </ion-label>
    </ion-item>

    <ion-item style="height:40px;" lines="none" color="light" >
      <ion-icon :icon="happy" color="warning"></ion-icon>
      <ion-label color="warning" @click="clkReactionPost" class="ion-no-padding q-ml-xs">
        <p v-if="type !== 'preVisualize'"> {{ obj.reactionsQty }}</p>
      </ion-label>
      <ion-text slot="end" v-if="type === 'preVisualize'"></ion-text>
      <ion-label @click="clkCommentPost" color="medium" v-else-if="type !== 'preVisualize' && !obj.commentsQty" slot="end">
        <p>Nenhum comentário</p>
      </ion-label>
      <ion-label color="medium"  @click="clkCommentPost" v-else-if="type !== 'preVisualize' && obj.commentsQty > 0" slot="end" >
        <h6>
          {{ obj.commentsQty }} comentário<span v-if="obj.commentsQty > 1">s</span>
        </h6>
      </ion-label>
    </ion-item>


    <ion-item lines="none" color="light">
      <button
        class="btn-particulas"
        :id="objPost._id + '1'"
        fill="clear"
        color="primary"
        slot="start"
        @click="cuzinho"
      >
        Curtir
      </button>
      <ion-popover
        :trigger="objPost._id + '1'"
        style="--min-width: 80vw;--backdrop-opacity:0.05"
        :dismiss-on-select="true" 
        :backdrop-dismiss="true" 
      >
      <ion-content>
        <div style="display: flex; flex-direction: row;padding: 5px;gap: 5px;">
          <div
            v-for="reaction in reactionsOptions"
            :key="reaction.filename"
            @click="clkReaction(reaction)"  
            class="reaction-button"
            style="padding-inline: 2px;"
          >
            <img
              :src="'/assets/emojis/' + reaction.filename"
            >
          </div>
        </div>
        </ion-content>
      </ion-popover>
      <ion-button
        fill="clear"
        color="primary"
        @click="clkCommentPost"
        style="text-transform:none;margin-right: -5px;"
        slot="end"
      >
        Comentar
      </ion-button>
    </ion-item>
  </ion-card>

</template>

<script setup>
import {
  IonCard, IonCardContent,
  IonContent,
  // IonFab, IonFabList, IonFabButton,
  IonAvatar,
  IonText,
  IonButton,
  IonItem,
  IonPopover,
  IonIcon,
  IonLabel,
} from '@ionic/vue';
import { ellipsisHorizontal, happy } from 'ionicons/icons';
import { defineComponent } from 'vue';
import { useFetch } from '../composables/fetch'
import utils from '../composables/utils'
import { Browser } from '@capacitor/browser';
import { COMPANY_ID } from '../composables/variables'
console.log('aksdmadskmadsklmadsmklakdsmdas', COMPANY_ID)
</script>

<script>
export default defineComponent ({
  name: 'CardPost',
  props: [
    'type',
    'objPost',
    'userInfo',
    'attachmentsAddress'
  ],
  data() {
    return {
      ellipsisHorizontal,
      happy,
      obj: {
        poster: {}
      },
      report: {},
      reactionsOptions: {},
      isOpen: false,
      reactions: utils.getReactions(),
      reactionsOpen: false,
      userProfilePhotoUrl: null,
      companyId: COMPANY_ID
    };
  },
  beforeMount () {
    this.obj = this.objPost
    this.reactionsOptions = utils.getReactions()
  },
  mounted () {
    this.makeProfilePhotoUrl()
  },
  watch: {
    objPost: function (nV) {
      this.obj = nV
    }
  },
  methods: {
    cuzinho(){
      this.reactionsOpen = true
      const animateButton = function(e) {
        console.log(e, 'AQUI CIUDADO')
        // e.preventDefault;
        //reset animation
        // e.target.classList.remove('explodir');
        
        e.target.classList.add('explodir');
        setTimeout(function(){
          e.target.classList.remove('explodir');
        },1000);
      };
      const bolhasButton = document.getElementsByClassName("btn-particulas");
      for (let i = 0; i < bolhasButton.length; i++) {
        bolhasButton[i].addEventListener('click', animateButton, false);
      }
    },
    makeProfilePhotoUrl () {
      this.userProfilePhotoUrl = this.objPost.createdBy.profileImage ? `${utils.attachmentsAddress()}${this.objPost.createdBy.profileImage.filename}_thumbnail` : '../../assets/blank-profile-picture-973460.svg'
    },
    clkOpenDialogDeletePost () {
      console.log('teste')
      this.$emit('openDialogDeletePost', this.objPost)
    },
    clkCommentPost () {
      this.$emit('openCommentPost')
    },
    clkReactionPost () {
      this.$emit('openReactionPost')
    },
    clkReaction (reaction) {
      console.log(reaction, 'reação')
      console.log(this.obj._id, '_id')
      this.reactionsOpen = false
      const opt = {
        method: 'POST',
        route: '/mobile/social/addReaction',
        body: {
          reaction,
          postId: this.obj._id,
        }
      }
      useFetch(opt).then(r => {
        this.obj = r.data
        this.$emit('userActionDone', 'newReaction', r.data)
      })
      
    },
    async openBrowser (link) {
      await Browser.open({ url: link })
    },
    clkProfileUser() {
      const userId =  this.objPost.createdBy.userId
      this.$router.push('/userProfile?userId=' + userId )
    },
  }
});
</script>

<style scoped>


.btn-particulas {
  display: inline-block;
  appearance: none;
  background-color: #00bfea00;
  color: #3880ff;
  border: none;
  cursor: pointer;
  position: relative;
  transition: transform ease-in 0.1s, box-shadow ease-in 0.25s;
}
.btn-particulas:focus {
  outline: 0;
}
.btn-particulas:before, .btn-particulas:after {
  
  position: absolute;
  content: "";
  display: block;
  width: 160%;
  height: 100%;
  left: -20%;
  z-index: 1500;
  transition: all ease-in-out 2s;
  background-repeat: no-repeat;
}
.btn-particulas:before {
  display: none;
  top: -80%;
  background-image: 
  radial-gradient(
    circle, 
    #00beea 20%, 
    transparent 20%
  ), 
  radial-gradient(
    circle, 
    transparent 20%, 
    #00beea 20%, 
    transparent 30%
  ), 
  radial-gradient(
    circle, 
    #00beea 40%, 
    transparent 20%
  ), 
  radial-gradient(
    circle, 
    #00beea 20%, 
    transparent 20%
  ), 
  radial-gradient(
  circle, 
  transparent 10%, 
  #00beea 15%, 
  transparent 20%
  ), 
  radial-gradient(
    circle,
    #00beea 20%, 
    transparent 20%
  ), 
  radial-gradient(
    circle, 
    #00beea 20%, 
    transparent 20%
  ), 
  radial-gradient(
    circle, 
    #00beea 20%, 
    transparent 20%
    ), 
    radial-gradient(
      circle, 
      #00beea 20%, 
      transparent 20%
    );
  background-size: 
    40% 40%,
    40% 40%, 
    35% 35%,
    40% 40%,
    38% 38%,
    30% 30%, 
    45% 45%,
    30% 30%,
    38% 38%;
}
.btn-particulas:after {
  display: none;
  bottom: -80%;
  background-image: radial-gradient(circle, #00beea 20%, transparent 20%), radial-gradient(circle, #00beea 20%, transparent 20%), radial-gradient(circle, transparent 10%, #00beea 35%, transparent 20%), radial-gradient(circle, #00beea 20%, transparent 20%), radial-gradient(circle, #00beea 20%, transparent 20%), radial-gradient(circle, #00beea 20%, transparent 20%), radial-gradient(circle, #00beea 20%, transparent 20%);
  background-size: 
  35% 35%,
  50% 50%, 
  38% 38%, 
  40% 40%, 
  45% 45%, 
  40% 40%, 
  50% 50%;
}
.btn-particulas:active {
  
  transform: scale(1.1);
  background-color: #4c4c4c;
}
.btn-particulas.explodir:before {
  display: block;
  animation: topBolhas ease-in-out 1s forwards;
}
.btn-particulas.explodir:after {
  
  display: block;
  animation: bottomBolhas ease-in-out 1s forwards;
}
@keyframes topBolhas {
  0% {
    background-position: 5% 90%, 10% 90%, 10% 90%, 15% 90%, 25% 90%, 25% 90%, 40% 90%, 55% 90%, 70% 90%;
  }
  50% {
    background-position: 0% 80%, 0% 20%, 10% 40%, 20% 0%, 30% 30%, 22% 50%, 50% 50%, 65% 20%, 90% 30%;
  }
  100% {
    background-position: 0% 70%, 0% 10%, 10% 30%, 20% -10%, 30% 20%, 22% 40%, 50% 40%, 65% 10%, 90% 20%;
    background-size: 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%;
  }
}
@keyframes bottomBolhas {
  0% {
    background-position: 10% -10%, 30% 10%, 55% -10%, 70% -10%, 85% -10%, 70% -10%, 70% 0%;
  }
  50% {
    background-position: 0% 80%, 20% 80%, 45% 60%, 60% 100%, 75% 70%, 95% 60%, 105% 0%;
  }
  100% {
    background-position: 0% 90%, 20% 90%, 45% 70%, 60% 110%, 75% 80%, 95% 70%, 110% 10%;
    background-size: 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%;
  }
}
/* daqui pra cima animação botão particulas */
.reaction-button {
  border-radius: 4px;
}
.reaction-button:active {
  background-color: var(--ion-color-light);
}

ion-item {
  background: transparent !important
}
ion-avatar {
  border: 2px solid rgb(135, 135, 252);
}
ion-text {
  line-height: 1;
}
ion-fab-button {
  border-radius: 0px;
  box-shadow: 0px;
}
ion-content {
  --offset-bottom: auto!important;
  --overflow: hidden;
  overflow: auto;
  --webkit-scrollbar: {display: none}
}
</style>