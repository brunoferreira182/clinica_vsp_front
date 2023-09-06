<template>
  <ion-page>
    <ion-content>
      <HeaderComponent title="Notificações"/>

      <ion-list>
        <ion-item
          v-for="(item,i) in notifications"
          :key="i"
          @click="$router.push(item.route)"
        >
          <ion-label>
            <h3>{{ item.title }}</h3>
            <p>{{ item.message }}</p>
          </ion-label>
          <ion-label slot="end">
            <h3>{{ item.createdAt.split(' ')[0] }}</h3>
            <p>{{ item.createdAt.split(' ')[1] }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
      <ion-button
        expand="block"
        color="secondary"
        class="q-ma-sm"
        @click="clkMore"
      >
        Carregar mais
      </ion-button>
    </ion-content>
  </ion-page>
</template>


<script setup>
import {
  IonPage,
  IonButton,
  IonLabel,
  IonItem,
  IonBadge,
  IonCard,
  IonIcon,
  IonRow,
  IonCol,
  IonList,
  IonContent,
  IonText
} from '@ionic/vue';
import { useFetch } from '../composables/fetch'
import HeaderComponent from '../components/HeaderComponent.vue';
import utils from '../composables/utils'
</script>
<script>

export default {
  name: "Notifications",
  data() {
    return {
      notifications: [],
      page: 0
    };
  },
  mounted(){
    this.getNotifications()
  },
  methods: {
    clkMore () {
      this.getNotifications()
    },
    getNotifications(){
      const opt = {
        route: '/mobile/utils/getNotifications',
        body: {
          page: this.page
        }
      }
      useFetch(opt).then(r => {
        if (r.error) {
          utils.toast('Ocorreu um erro. Tente mais tarde.')
          return
        }
        if (this.page === 0) this.notifications = r.data
        else this.notifications.push(...r.data)
        this.page++
      })
    },
  }
};
</script>