<template>
  <ion-page>
    <ion-content :scroll-y="false" class="ion-text-center">
      <div style="margin-top: 20vh;margin-bottom: 0vh;font-size: 26px;color: var(--ion-color-primary);">
        Pagamento efetuado com sucesso!
      </div>
      <ion-button class="q-mx-lg " color="secondary" fill="clear" @click="clkDetails">
        Ver detalhes
      </ion-button>
      <p
        class="q-mx-lg q-mb-xl"
        style="color: var(--ion-color-medium);"
      >
        Envie uma mensagem pelo nosso chat para agendar sua consulta 
        ou volte para a tela inicial se preferir deixar isso para depois.
      </p>
      <ion-button
        @click="goToMessages"
        expand="block"
        class="q-mx-lg q-mt-lg"
        color="primary"
      >
        Enviar mensagem
      </ion-button>
      <ion-button
        @click="$router.replace('/tabs/home')"
        expand="block"
        class="q-mx-lg q-mt-sm"
        color="primary"
        fill="outline"
      >
        Voltar para o início
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonButton,
  IonGrid,
  IonRow,
  IonContent,
  IonModal,
  IonText,
  IonBadge,
  IonList,
  IonItem,IonLabel,IonIcon
} from '@ionic/vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useFetch } from '../composables/fetch'
import utils from '../composables/utils'
</script>

<script>
export default {
  name: "PaymentSuccess",
  data() {
    return {
      
    };
  },
  methods: {
    clkDetails () {
      this.$router.replace('/newOpportunityDetail?opportunityId=' + this.$route.query.opportunityId)
    },
    goToMessages () {
      this.$router.replace('/messengerChat')
    }
  }
};
</script>





