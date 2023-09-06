<template>
  <ion-page>
    <ion-content>
      <HeaderComponent title="Dados de pagamento" closeButton="true"/>
      <div class="ion-text-center ">
        <ion-text color="secondary">
          <h1>Estamos chegando ao final</h1>
          <p>Basta apenas confirmar seus dados</p>
        </ion-text>
      </div>
      <ion-card color="tertiary" class="cardCheckout" style="box-shadow: 0">
        <ion-card-header>
          <ion-card-subtitle>Valor da consulta</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <ion-item color="tertiary" lines="none">
            <ion-label class="ion-text-wrap">
              <h2>R$ {{ value }}</h2>
            </ion-label>
          </ion-item>
        </ion-card-content>
      </ion-card>
      <ion-card color="tertiary" class="cardCheckout" style="box-shadow: 0">
        <ion-card-header>
          <ion-card-subtitle color="secondary">Forma de pagamento</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <div v-if="paymentType === 'creditCard'">
            <ion-item color="tertiary" lines="none">
              <ion-label class="ion-text-wrap">
                <h2>Cartão de crédito</h2>
                <p>Forma de pagamento</p>
              </ion-label>
            </ion-item>
            <ion-item color="tertiary" lines="none">
              <ion-label class="ion-text-wrap">
                <h2>{{ description }}</h2>
                <p>Apelido do cartão</p>
              </ion-label>
            </ion-item>
            <ion-item color="tertiary" lines="none">
              <ion-label class="ion-text-wrap">
                <h2>{{ lastDigits }}</h2>
                <p>Últimos dígitos</p>
              </ion-label>
            </ion-item>
          </div>

          <div v-if="paymentType === 'bank_slip'">
            <ion-item color="tertiary" lines="none">
              <ion-label class="ion-text-wrap">
                <h2>Boleto</h2>
                <p>Forma de pagamento</p>
              </ion-label>
            </ion-item>
          </div>

          <div v-if="paymentType === 'pix'">
            <ion-item color="tertiary" lines="none">
              <ion-label class="ion-text-wrap">
                <h2>Boleto</h2>
                <p>Forma de pagamento</p>
              </ion-label>
            </ion-item>
          </div>
        </ion-card-content>
      </ion-card>

      <ion-card color="tertiary" class="cardCheckout" style="box-shadow: 0" v-if="type === 'procedures'">
        <ion-card-header>
          <ion-card-subtitle color="secondary">Procedimentos</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <ion-list>
            <ion-item
              v-for="(item, i) in selectedProcedures"
              :key="i"
              color="tertiary"
              lines="none"
            >
              <ion-label>
                <h3>{{ i + 1 }}. {{ item.procedureData.label }}</h3>
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>

      <ion-card color="tertiary" class="cardCheckout" style="box-shadow: 0" v-if="type === 'complaints'">
        <ion-card-header>
          <ion-card-subtitle color="secondary">Detalhes</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <ion-list>
            <ion-item
              v-for="(item, i) in selectedComplaints"
              :key="i"
              color="tertiary"
              lines="none"
            >
              <ion-label>
                <h3>{{ i + 1 }}. {{ item.name }}</h3>
                <p>{{ item.bodyCompanyName }}</p>
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>

      <div class="q-px-md q-mb-sm">
        <ion-button 
          v-if="paymentType === 'bank_slip'"
          @click="confirmPaymentOpportunity()"
          color="danger"
          expand="block"
        >
          Gerar boleto
        </ion-button>
        <ion-button 
          v-if="paymentType === 'pix'"
          @click="confirmPaymentOpportunity"
          color="danger"
          expand="block"
        >
          Gerar código pix
        </ion-button>
        <ion-button 
          v-if="paymentType === 'creditCard'"
          @click="confirmPaymentOpportunity"
          color="danger"
          expand="block"
        >
          Pagar
        </ion-button>
      </div>

      <!-- <ion-list style="margin-inline: 16px;">
        <div class="cardStyle" color="tertiary">
          <h6 class="q-ml-md">
            Confirmar pagamento
          </h6>
          <div class="q-ml-md">
            Procedimentos escolhidos
          </div>
          <ion-item
            color="tertiary"
            lines="none"
            v-for="(item, i) in selectedProcedures"
            :key="i"
          >
  
            <ion-label >
              <h2>{{i + 1 + '.  ' + item.procedureData.label }}</h2>
            </ion-label>
          </ion-item>
          
        </div>
      </ion-list> -->
      <Transition  v-if="showPixCode" appear class="q-px-md" name="slide-fade">
        <div color="tertiary" >
          <div class="q-pa-sm q-ml-sm ion-text-center">
            <h4>
              Chave pix
            </h4>
          </div>
          <div class="ion-text-wrap ion-text-center" style="font-weight:400; font-size:smaller;">
            {{ qrCode }}
          </div>
          <ion-row class="ion-justify-content-center">
            <ion-button @click="copyToClipboard" color="danger" fill="clear">
              Copiar
              <ion-icon  class="q-ml-sm" :icon="copy"/>
            </ion-button>
          </ion-row>
        </div>
      </Transition>
      <ion-button
        expand="block"
        class="q-mx-md q-mb-xl"
        fill="outline"
        @click="$router.replace('/newOpportunityCheckout?opportunityId=' + $route.query.opportunityId)"
      >
        Voltar
      </ion-button>
    </ion-content>
  </ion-page>
</template>


<script setup>
import {
  IonPage,
  IonButton,
  IonGrid,
  IonLabel,
  IonIcon,
  IonItem,
  IonCard, IonCardContent, IonCardSubtitle, IonCardHeader,
  IonList,
  IonRow,
  IonContent,
  IonText
} from '@ionic/vue';
import {  copy } from 'ionicons/icons';
import { useFetch } from '../composables/fetch'
import HeaderComponent from '../components/HeaderComponent.vue';
import utils from '../composables/utils'
</script>
<script>

export default {
  name: "NewOpportunityConfirmPayment",
  data() {
    return {
      selectedProcedures: [],
      showPixCode: false,
      qrCode: null,
      arrayBodies: [],
      description: '',
      lastDigits: '',
      paymentType: '',
      paymentMethod: '',
      opportunityId: '',
      customerId: '',
      value: '',
      saleId: '',
      type: 'complaints',
      selectedComplaints: []
    };
  },
  watch: {
    $route(to) {
      if (to.path === '/newOpportunityConfirmPayment') {
        this.getOpportunityDetailById()
      }
    }
  },
  mounted(){
    utils.loading.hide()
    this.getOpportunityDetailById()
  },
  methods: {
    getOpportunityDetailById(){
      this.opportunityId = this.$route.query.opportunityId
      this.paymentType = this.$route.query.paymentType
      const opt = {
        route: '/mobile/sales/getOpportunityDetailById',
        body: {
          opportunityId: this.$route.query.opportunityId,
        },
      }
      useFetch(opt).then(r => {
        if (r.error) {
          utils.toast('Ocorreu um erro. Tente mais tarde')
          return
        }
        this.lastDigits = r.data.opportunityData.paymentData.display_number
        this.description = r.data.opportunityData.paymentData.description
        this.selectedProcedures = r.data.opportunityData.procedures
        this.selectedComplaints = r.data.opportunityData.complaints
        this.value = r.data.opportunityData.budget.budgetValue
      })
    },
    
    confirmPaymentOpportunity(){
      const opt = {
        route: '/mobile/sales/confirmPurchase',
        body: {
          opportunityId: this.$route.query.opportunityId,
          type: this.type
        }
      }
      utils.loading.show()
      useFetch(opt).then(r => {
        utils.loading.hide()
        window.localStorage.removeItem('proceduresArray')
        window.localStorage.removeItem('lastGender')
        if (r.error) {
          if (r.errorMessage) utils.toast(r.errorMessage)
          else utils.toast('Houve um erro ao enviar as informações. Tente novamente')
          return
        }
        localStorage.removeItem('complaints')
        if (this.paymentType === 'creditCard') {
          this.$router.replace('/newOpportunityPaymentSuccess?opportunityId=' + this.opportunityId)
        } else if (this.paymentType === 'pix') {
          this.$router.replace('/newOpportunityDetail?opportunityId=' + this.$route.query.opportunityId + '&pType=pix')
        } else if (this.paymentType === 'boleto'){
          console.log(r.data)
        }
      })
    },
  }
};
</script>

<style scoped>
.sc-ion-label-ios-h.in-item-color.sc-ion-label-ios-s>p {
  color: rgb(102, 102, 102);
}
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.cardStyle {
  border-radius: 1rem;
  overflow: hidden;
  background: var(--ion-color-tertiary);
}

.cardCheckout {
  box-shadow: none;
  border-radius: 15px;
  margin: 10px;
}
</style>