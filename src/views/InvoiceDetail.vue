<template>
  <ion-page>
    
    <ion-content>
      <HeaderComponent title="Detalhes da fatura"/>
      <ion-spinner v-if="!invoiceUrl" name="circles"></ion-spinner>
      <iframe
        :src="invoiceUrl"
        style="position:fixed; top: 50px; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:99;"
        @load="iframeLoaded"
      ></iframe>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage, IonSpinner,
  IonContent
} from '@ionic/vue';
import utils from '../composables/utils'
import HeaderComponent from '../components/HeaderComponent.vue'
</script>

<script>

export default {
  name: "InvoiceDetail",
  data() {
    return {
      invoiceUrl: null
    };
  },
  beforeMount : async function () {
    utils.loading.show()
    this.invoiceUrl = this.$route.query.url
  },
  methods: {
    iframeLoaded () {
      utils.loading.hide()
    }
  },
};
</script>