<template>
  <ion-page>
    <ion-content>
      <HeaderComponent title="Pagamento procedimentos" closeButton="true"/>
      <!-- <p class="q-mx-lg" style="font-weight: 400;font-size: 16px;line-height: 25px;">
        O próximo passo é escolher como deseja pagar a consulta. Após isso, o encontro será agendado para prosseguir com o orçamento.
      </p> -->
      <p class="q-ma-lg" style="font-weight: 500;font-size: 18px;color:var(--ion-color-secondary);">
        <span style="color: var(--ion-color-primary);">Valor dos procedimentos: </span>
        R$ {{ opoportunityData.opportunityPrice.price }}
      </p>
      <div>
        <ChoosePaymentMethod
          @selectedPaymentMethod="selectedPaymentMethod"
        />
      </div>
      <ion-button
        expand="block"
        class="q-mx-md q-mt-lg"
        fill="outline"
        @click="$router.back()"
      >
        Voltar
      </ion-button>
    </ion-content>
    <ion-alert
      :is-open="dialogConfirmPayment"
      header="Confirma o pagamento?"
      :sub-header="`Valor dos procedimentos: R$ ${opoportunityData.opportunityPrice.price}`"
      :buttons="[
          {
            text: 'Voltar',
            role: 'cancel',
            handler: () => { dialogConfirmPayment = false },
          },
          {
            text: 'Sim',
            role: 'confirm',
            handler: () => { payProcedures() },
          },
        ]
      "
      @didDismiss="dialogConfirmPayment = false"
    ></ion-alert>

    <ion-alert
      :is-open="welcomeDialog"
      header="Pagamento efetuado com sucesso!"
      sub-header="Entre em contato conosco para marcar seus procedimentos."
      :buttons="[
          {
            text: 'Ok',
            role: 'confirm',
            handler: () => { $router.replace('/messengerChat') },
          },
        ]
      "
      @didDismiss="dialogConfirmPayment = false"
    ></ion-alert>
  </ion-page>
</template>


<script setup>
import {
  IonPage,
  IonButton,
  IonGrid,
  IonRow,
  IonContent,
  IonAlert
} from '@ionic/vue';
import ChoosePaymentMethod from '../components/ChoosePaymentMethod.vue'
import utils from '../composables/utils'
import HeaderComponent from '../components/HeaderComponent.vue';
import AddCreditCard from '../components/AddCreditCard.vue'
import { useFetch } from '../composables/fetch'
</script>
<script>

export default {
  name: "PaymentProcedureCheckout",
  data() {
    return {
      value: '',
      paymentType : '',
      opoportunityData: {
        opportunityPrice: {
          price: ''
        }
      },
      hasDocument: '',
      paymentMethodId: '',
      paymentData: [],
      userAddressData: {},
      paymentDetail: null,
      dialogConfirmPayment: false,
      welcomeDialog: false
    };
  },
  // watch: {
  //   $route(to) {
  //     if (to.path === '/newOpportunityCheckout') {
  //       this.startView()
  //       this.checkUserDocumentExists()
  //     }
  //   },
  // },
  mounted(){
    this.getOpportunityDetailById()
    utils.loading.hide()
    this.startView()
    this.checkUserDocumentExists()
  },
  methods: {
    startView(){
      const opt = {
        route: '/getUserAddress',
      }
      useFetch(opt).then(r => {
        this.userAddressData = r.data
      })
    },
    checkUserDocumentExists(){
      const opt = {
        serverName: 'authentication',
        route: '/checkUserDocumentExists'
      }
      useFetch(opt).then(r => {
        this.hasDocument = r.data
      })
    },
    selectedPaymentMethod (type, data) {
      this.paymentDetail = {
        type,
        data
      }
      this.dialogConfirmPayment = true
    },
    payProcedures () {
      console.log('aqui??')
      const opportunityId = this.$route.query.opportunityId
      this.paymentMethodId = this.paymentDetail.data.id
      this.paymentType = this.paymentDetail.type
      const opt = {
        route: '/mobile/afterSales/payProcedures',
        body: {
          opportunityId,
          paymentMethod: this.paymentType,
          paymentMethodId: this.paymentMethodId
        }
      }
      utils.loading.show()
      useFetch(opt).then((r) => {
        utils.loading.hide()
        if (r.error) {
          if (r.errorMessage) utils.toast(r.errorMessage)
          else utils.toast('Ocorreu um erro ao processar o pagamento. Tente novamente mais tarde.')
          return
        }
        this.welcomeDialog = true
      })
    },
    getOpportunityDetailById(){
      const opt = {
        route: '/mobile/afterSales/getOpportunityDetailById',
        body: {
          opportunityId: this.$route.query.opportunityId,
        },
      }
      useFetch(opt).then(r => {
        this.opoportunityData = r.data
      })
    },
  }
};
</script>