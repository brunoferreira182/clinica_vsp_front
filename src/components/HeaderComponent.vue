<template>
  <div>
  <div style="height: 60px;"></div>
  <ion-content 
    :scroll-y="false"
    :style="
      `height: 60px;
      --background:transparent;
      translate: 0 -60px;
      position: fixed;
      z-index: 1000;
      box-shadow: ${shadow ? '0 -0px 15px -10px' : 'none'};`"
    >
    <div v-if="transparent" style="position: fixed;margin: 5px;"  @click="$router.back()">
      <ion-button
        mode="ios"
        class="ion-no-padding"
        color="tertiary"
        shape="round"
        style="margin-right: auto; height: 40px;width: 40px;"
      >
        <ion-icon 
          style="color: var(--ion-color-secondary);margin-left: -3px;" slot="icon-only" 
          :icon="chevronBack"
        />
      </ion-button>
    </div>
    <div 
        v-else 
        style="
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--ion-color-background);
        height:60px;"
    >
      <ion-button
        v-if="!closeButton"
        @click="$router.back()"
        mode="ios"
        class="ion-no-padding"
        color="secondary"
        fill="clear"
        style="position: absolute;left: 10px;"
      >
        <ion-icon slot="icon-only" :icon="chevronBack"/>
        <h4 v-if="back" 
          class="ion-no-margin"
          style="
            margin-right:auto;
            font-family: Montserrat;
            font-weight: 400;
            color:var(--ion-color-secondary)"
        >
          Voltar
        </h4>
      </ion-button>
      <ion-button
        v-else
        @click="clkRouterBack"
        mode="ios"
        class="ion-no-padding"
        color="secondary"
        fill="clear"
        style="position: absolute;left: 10px;"
      >
        <ion-icon slot="icon-only" :icon="close"/>
      </ion-button>
      <h4
        v-if="title" 
        class="ion-text-center ion-no-margin"
        style="
          font-family: Montserrat;
          font-weight: 500;
          color:var(--ion-color-secondary)"
      >
        {{title}}
      </h4>
      <div  v-if="logo" style="display:flex;align-items: baseline;margin-right: 20px;margin-left: auto;">
        <ion-img 
          style="margin-right: -10px;height: 40px;width: 75.2px;" 
          src="/assets/icons/logo-vivian-simoes.svg"></ion-img
        >
        <ion-text 
          color="secondary"
          style="translate: -5px -5px;font-family: Montserrat;font-size: 15px;"
        >
          Chat
        </ion-text>
      </div>
      <!-- <ion-avatar v-if="title" style="margin-right: 10px;"> -->
      <!-- </ion-avatar> -->
    </div>
  </ion-content>
  </div>
</template>

<script setup>
import {
  IonHeader, 
  IonToolbar, 
  IonBackButton, 
  IonTitle, 
  IonButtons,
  IonText,
  IonButton,
  IonCol,
  IonBadge,
  IonAvatar,
  IonImg,
  IonRow,
  IonContent,
  IonIcon,
} from '@ionic/vue';
import { search, exitOutline, notifications, menu, chevronBack,close } from 'ionicons/icons';
import utils from '../composables/utils'
import { useFetch } from '@/composables/fetch';
</script>

<script>
export default {
  name: "HeaderComponent",
  props: [
    'subtitle',
    'title',
    'shadow',
    'logo',
    'transparent',
    'back',
    'closeButton'
  ],
  data() {
    return {
      selectedProcedures: 0,
      companyName: 'Vivian Simões Pires',
      lastGender: window.localStorage.getItem('lastGender')
    };
  },
  methods: {
    clkRouterBack () {
      this.$emit('clkBack')
      this.$router.back()
    },
    clkHeader () {
      if (this.userId) {
        const userId =  this.userId
        this.$router.push('/userProfile?userId=' + userId )
      } else if (this.groupId) {
        const groupId =  this.groupId
        this.$router.push('/groupDetail?groupId=' + groupId )
      }
    },
  }
};
</script>

<style>
ion-badge {
    --border-radius: 5rem, 5rem, 5rem, 5rem;
    --color: white;
  }
.kids-logo {
  font-family: Kids;
  font-weight: auto;
  font-size: 20px;
  margin-left: 3px;
}

</style>