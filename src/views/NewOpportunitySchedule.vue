<template>
  <ion-page>
    <ion-content>
 
    </ion-content>
  </ion-page>
</template>


<script setup>
import {
  IonPage,
  IonButton,
  IonGrid,
  IonRow,
  IonContent
} from '@ionic/vue';
import { useFetch } from '../composables/fetch'
import utils from '../composables/utils'
</script>
<script>

export default {
  name: "NewOpportunitySchedule",
  data() {
    return {
      opportunitiesList: [],
    };
  },
  watch: {
    $route(to) {
      if (to.path === '/newOpportunitySchedule') {
        this.getOpportunitiesListById()
      }
    }
  },
  mounted(){
    this.getOpportunitiesListById()
  },
  methods: {
    getOpportunitiesListById(){
      const opt = {
        route: '/mobile/afterSales/getOpportunitiesById',
      }
      utils.loading.show()
      useFetch(opt).then(r => {
        utils.loading.hide()
        this.opportunitiesList = r.data
      })
    },
  }
};
</script>