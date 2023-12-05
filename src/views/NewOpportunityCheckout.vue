<template>
  <ion-page>
    <ion-content>
      <HeaderComponent title="Pagamento" closeButton="true"/>
      <p class="q-mx-lg"
        style="font-weight: 400;font-size: 16px;line-height: 25px;"
      >
        O próximo passo é escolher como deseja pagar a consulta. Após isso, o encontro será agendado para prosseguir com o orçamento.
      </p>
      <p class="q-mx-lg q-mb-lg" style="font-weight: 500;font-size: 18px;margin-top: -5px;color:var(--ion-color-secondary);"><span style="color: var(--ion-color-primary);">Valor da consulta: </span> R${{value}}</p>
      <div v-if="step === 'choosePaymentMethod'">
        <ChoosePaymentMethod
          :productInfo="newSaleData.productDetail.productInfo"
          @selectedPaymentMethod="selectedPaymentMethod"
        />
      </div>
      <ion-button
        expand="block"
        class="q-mx-md q-mt-lg"
        fill="outline"
        @click="$router.replace('/newOrEditOpportunityBudget?opportunityId=' + $route.query.opportunityId)"
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
  IonRow,
  IonContent
} from '@ionic/vue';
import ChoosePaymentMethod from '../components/ChoosePaymentMethod.vue'
import utils from '../composables/utils'
import HeaderComponent from '../components/HeaderComponent.vue';
import AddCreditCard from '../components/AddCreditCard.vue'
import { useFetch } from '../composables/fetch'
</script>
<script>

export default {
  name: "newOpportunityCheckout",
  data() {
    return {
      step: '',
      value: '',
      paymentType : '',
      newSaleData: {
        opportunityId: '',
        paymentDetail: {},
        shippingDetail: {},
        productDetail: {},
        totalCosts: {
          totalIntl: '',
          totalCents: '',
          total: ''
        },
        userAddress: {},
        userInfo: {}
      },
      hasDocument: '',
      paymentMethodId: '',
      paymentData: [],
      userAddressData: {},
    };
  },
  watch: {
    $route(to) {
      if (to.path === '/newOpportunityCheckout') {
        this.startView()
        this.checkUserDocumentExists()
      }
    },
  },
  mounted(){
    this.getOpportunityDetailById()
    utils.loading.hide()
    this.startView()
    this.checkUserDocumentExists()
    this.step = 'choosePaymentMethod'
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
      this.newSaleData.paymentDetail = {
        type,
        data
      }
      const opportunityId = this.$route.query.opportunityId
      this.paymentMethodId = this.newSaleData.paymentDetail.data.id
      this.paymentType = this.newSaleData.paymentDetail.type
      const opt = {
        route: '/mobile/sales/selectPaymentMethod',
        body: {
          opportunityId: this.$route.query.opportunityId,
          paymentMethod: this.paymentType,
          paymentMethodId: this.paymentMethodId
        }
      }
      utils.loading.show()
      useFetch(opt).then(() => {
        utils.loading.hide()
        if(this.paymentType === 'creditCard'){
          this.$router.replace('/newOpportunityConfirmPayment?opportunityId=' + opportunityId + '&paymentType=' + this.paymentType)
          return
        }
        if(this.paymentType === 'pix'){
          if(this.hasDocument) {
            this.$router.replace('/newOpportunityConfirmPayment?opportunityId=' + opportunityId + '&paymentType=' + this.paymentType)
          } else {
            this.$router.replace('/newOpportunityBeforeCheckout?paymentType=' + this.paymentType + '&opportunityId=' + opportunityId)
          }
        } else if(this.paymentType === 'bank_slip'){
          if(this.userAddressData.hasAddress){
            this.$router.replace('/newOpportunityConfirmPayment?opportunityId=' + opportunityId + '&paymentType=' + this.paymentType)
          } else {
            this.$router.replace('/newOpportunityBeforeCheckout?paymentType=' + this.paymentType + '&opportunityId=' + opportunityId)
          }
        }
      })
    },
    getOpportunityDetailById(){
      const opt = {
        route: '/mobile/sales/getOpportunityDetailById',
        body: {
          opportunityId: this.$route.query.opportunityId,
        },
      }
      useFetch(opt).then(r => {
        this.value = r.data.opportunityData.budget.budgetValue
      })
    },
  }
};
</script>