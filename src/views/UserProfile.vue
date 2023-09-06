<template>
  <ion-page>
    <UserProfile/>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  
} from '@ionic/vue';
import HeaderComponent from '../components/HeaderComponent.vue'
import UserProfile from '../components/ProfileComponent.vue'
</script>

<script>
export default {
  name: "userProfile",
  data() {
    return {
      
    };
  },
};
</script>