<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button
          mode="ios"
          class="ion-no-padding"
          color="tertiary"
          shape="round"
          style="margin-right: auto; height: 40px;width: 40px;"
          @click="$router.back()"
        >
          <ion-icon 
            style="color: var(--ion-color-secondary);margin-left: -3px;" slot="icon-only" 
            :icon="chevronBack"
          />
        </ion-button>
      </ion-buttons>
      <ion-title>{{ title }}</ion-title>
    </ion-toolbar>
  </ion-header>
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

<style scoped>
  ion-toolbar {
    --background: transparent;
    --border-width: 0;
  }
</style>