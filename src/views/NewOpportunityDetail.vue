<template>
  <ion-page>
    <ion-content>
      <HeaderComponent :title="title"/>
      <OpportunityDetail :opportunityDetail="opportunityDetail" @clkInvoice="clkInvoice"/>
      <Transition v-if="showPixCode" appear class="q-px-md" name="slide-fade">
        <div v-if="$route.query.pType === 'pix'">
          <div class="q-pa-sm q-ml-sm ion-text-center">
            <h5>Chave pix</h5>
          </div>
          <div class="ion-text-wrap ion-text-center" style="font-weight:400; font-size:smaller;">
            {{ item.invoiceData.invoiceData.pix.qrcode_text.split('/')[4] }}
          </div>
          <ion-row class="ion-justify-content-center">
            <ion-button @click="copyToClipboard(item)" size="medium" color="danger" fill="clear">
              Copiar
              <ion-icon  class="q-ml-sm" :icon="copy"/>
            </ion-button>
          </ion-row>
        </div>
      </Transition>
      <ion-button
        v-if="
          opportunityDetail
          && opportunityDetail.showProceduresToUser
          && opportunityDetail.opportunityPrice
          && opportunityDetail.status.status !== 'proceduresPaid'"
        color="danger"
        expand="block"
        @click="clkPayProcedures"
        class="q-ma-sm"
      >Adquirir procedimentos com desconto</ion-button>
      <ion-button 
        @click="clkTalkToCustomer" 
        expand="block" 
        color="primary"
        class="q-ma-sm"
      >
        Falar com a clínica
        <ion-icon slot="end" style="scale: 0.8;" :icon="calendar"/>
      </ion-button>

      <ion-button 
        @click="clkInvoice"
        v-if="opportunityDetail"
        expand="block" 
        color="primary"
        class="q-ma-sm"
        fill="outline"
      >
        Ver fatura
      </ion-button>
    </ion-content>
  </ion-page>
</template>


<script setup>
import {
  IonPage,
  IonButton,
  IonItem,
  IonCol,
  IonRow,
  IonList,
  IonIcon,
  IonLabel,
  IonContent,
  IonCard, IonCardContent, IonCardSubtitle, IonCardHeader,
  IonBadge
} from '@ionic/vue';
import { useFetch } from '../composables/fetch'
import utils from '../composables/utils'
import { newspaper, calendar, copy } from 'ionicons/icons';
import HeaderComponent from '../components/HeaderComponent.vue'
import OpportunityDetail from '../components/OpportunityDetail.vue'
</script>
<script>

export default {
  name: "NewOpportunityDetail",

  data() {
    return {
      opportunityDetail: null,
      title: 'Detalhe do orçamento',
      showPixCode: false,
    };
  },
  watch: {
    $route(to) {
      if (to.path === '/newOpportunityDetail') {
        this.getOpportunityDetailById()
      }
    }
  },
  mounted(){
    this.getOpportunityDetailById()
  },
  methods: {
    clkPayProcedures () {
      this.$router.push('/paymentProcedureCheckout?opportunityId=' + this.opportunityDetail._id)
    },
    clkInvoice(secureUrl){
      this.$router.push('/invoiceDetail?url=' + secureUrl)
    },
    async copyToClipboard(item) {
      const qrCode = item.invoiceData.invoiceData.pix.qrcode_text.split('/')[4]
      try {
        await navigator.clipboard.writeText(qrCode);
        utils.toast('Código copiado com sucesso!');
      } catch (error) {
        utils.toast('Erro ao copiar o código, tente novamente');
      }
    },
    clkTalkToCustomer (){
      this.$router.push('/messengerChat')
    },
    getOpportunityDetailById(){
      const opt = {
        route: '/mobile/afterSales/getOpportunityDetailById',
        body: {
          opportunityId: this.$route.query.opportunityId
        }
      }
      utils.loading.show()
      useFetch(opt).then(r => {
        utils.loading.hide()
        // this.userId = r.data.createdBy.userId
        this.opportunityDetail = r.data
        if(this.$route.query.pType === 'pix'){
          this.showPixCode = true
        }
      })
    },
  }
};
</script>
<style>

.cardCheckout {
  box-shadow: none;
  border-radius: 15px;
  margin: 10px;
}
.sc-ion-label-ios-h.in-item-color.sc-ion-label-ios-s>p {
  color: rgb(102, 102, 102);
}
</style>