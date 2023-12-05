<template>
  <ion-page>
    <ion-content >
      <div style="height: var(--ion-safe-area-top)"></div>
      <HomeComponent />
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonContent,
} from '@ionic/vue';
import { add, search } from 'ionicons/icons';
import { notifications } from 'ionicons/icons';
import HeaderComponent from '../components/HeaderComponent.vue'
import HomeComponent from '../components/HomeComponent.vue'
import utils from '../composables/utils'

</script>

<script>

export default {
  name: 'HomeView',

  data () {
    return {
      add,
      search,
      notifications,
      userInfo: utils.presentUserInfo()
    }
  },
  // watch: {
  //   $route(to, from) {
  //     console.log('watch do route dentro do home', to, from)
  //   }
  // },
  beforeMount () {
    utils.loading.clear()
  },
  
}
</script>

<style scoped>
.iframe-class {
  width: 100%;
  height: 100%;
  border: 0px
}

</style>