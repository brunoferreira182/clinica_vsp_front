<template>
  <div>
    <p class="q-mx-lg" style="font-weight: 500;">Escolha um dos meios de pagamento abaixo:</p>
    <div  style="margin: 10px;background: var(--ion-color-tertiary);border-radius: 1rem;overflow: hidden;">
    
      <ion-list>
        <ion-item
          lines="none"
          class="item-tertiary"
          v-for="item in listOfPaymentMethods.data"
          :key="item.id"
          @click="clkSelectedPaymentMethod('creditCard', item)"
          button detail="true"
          :detailIcon="caretForwardOutline"
        >
          <font-awesome-icon 
            icon="fa-solid fa-credit-card fa-2x" 
            slot="start" 
            style="color: blue; 
            font-size: 1.5em;"
          />
          <ion-label>
            <h3>{{item.description}}</h3>
            <p>Final {{ item.data.last_digits }}</p>
          </ion-label>
        </ion-item>
  
        <ion-item
          class="item-tertiary "
          lines="none"
          v-for="item in defaultPaymentMethods"
          :key="item.id"
          @click="clkDefaultPaymentMethod(item)"
          button detail="true"
          :detailIcon="caretForwardOutline"
        >
          <font-awesome-icon 
            :icon="item.icon" 
            slot="start" 
            style="color: orange; 
            font-size: 1.5em;"
          />
          <ion-label>
            <h3>{{ item.label }}</h3>
            <!-- <p>Final {{ item.data.last_digits }}</p> -->
          </ion-label>
        </ion-item>
      </ion-list>
      <ion-modal :is-open="dialogAddCreditCard.open" >
        <ion-content class="ion-padding" style="padding-top: var(--ion-safe-area-top)">
          <div style="padding-top: var(--ion-safe-area-top)">
            <ion-button
              mode="ios"
              class="ion-no-padding"
              color="secondary"
              fill="clear"
              @click="dialogAddCreditCard.open = false"
            >
              <ion-icon 
                slot="icon-only" 
                :icon="chevronBack"
              />
              Dados do cartão
            </ion-button>
            <!-- <h4 
              class="ion-no-margin q-pl-lg" 
              style="margin-right: auto;
              font-family: Montserrat;
              font-weight: 400;
              color:var(--ion-color-secondary)"
            > Adicionar cartão</h4> -->
            <AddCreditCardComponent
              @done="addCreditCardDone"
            />
          </div>
        </ion-content>
      </ion-modal>
  
      <ion-modal :is-open="dialogRemoveCard.open">
        <div>
          <ion-button
            mode="ios"
            class="ion-no-padding"
            color="secondary"
            fill="clear"
            @click="dialogRemoveCard.open = false"
          >
            <ion-icon 
              slot="icon-only" 
              :icon="chevronBack"
            />
          </ion-button>
        </div>
  
        <ion-content class="ion-padding">
          <RemoveCreditCardComponent
            :listOfPaymentMethods="listOfPaymentMethods"
            @done="addCreditCardDone"
          />
        </ion-content>
      </ion-modal>
    </div>
    <ion-item
      lines="none"
      fill="clear"
      style="margin-inline: 10px;"
      @click="dialogRemoveCard.open = true"
      v-if="listOfPaymentMethods.data && listOfPaymentMethods.data.length > 0"
    >
      <ion-icon style="color:red" slot="start" :icon="trash"></ion-icon>
      <ion-label>
        <h3>
          Remover um cartão
        </h3>
      </ion-label>
    </ion-item>
  
  </div>
</template>

<script setup>
import {
  IonTitle, 
  IonList, 
  IonItem, 
  IonLabel,
  IonButton, 
  IonButtons, 
  IonToolbar, 
  IonHeader, 
  IonContent, 
  IonModal,
  IonIcon,
} from '@ionic/vue';
import { caretForwardOutline, chevronBack, trash } from 'ionicons/icons';
import AddCreditCardComponent from './AddCreditCard.vue'
import HeaderComponent from './HeaderComponent.vue'
import RemoveCreditCardComponent from './RemoveCreditCardComponent.vue'
import { useFetch } from '../composables/fetch'
import utils from '../composables/utils'
// import CreditCardComponent from '../components/CreditCardComponent.vue'
</script>

<script>

export default {
  name: "ChoosePaymentMethod",
  props: {
    shippingCosts: Object,
    productInfo: Object
  },
  data() {
    return {
      dialogRemoveCard: {
        open: false
      },
      chevronBack,
      transition: {
        enter: 'slide-up',
        exit: 'slide-down'
      },
      listOfPaymentMethods: [],
      defaultPaymentMethods: [
        { _id: 1, name: 'addCreditCard', label: 'Adicionar cartão de crédito', icon: 'fa-solid fa-credit-card' },
        // { _id: 2, name: 'pix', label: 'Pix', icon: 'fa-brands fa-pix' },
        // { _id: 3, name: 'bank_slip', label: 'Boleto', icon: 'fa-solid fa-barcode' }
      ],
      dialogAddCreditCard: {
        open: false,
        data: {
          description: '',
          number: '',
          verification_value: '',
          first_name: '',
          last_name: '',
          month: '',
          year: '',
          brand: '',
          numberValidated: false,
          cvvValidated: false
        }
      },
      paymentToken: {},
      options: {
        years: [],
        months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
      }
    };
  },
  watch: {
    $route(to) {
      if (to.path === '/newOpportunityCheckout') {
        this.getListOfPaymentMethods()
      }
    },
  },
  beforeMount () {
    const today = new Date()
    const todayYear = +today.getFullYear()
    for (let i = 0; i <= 12; i++) {
      this.options.years.push(todayYear + i)
    }
    utils.loading.hide()
    this.getListOfPaymentMethods()
  },
  methods: {
    
    getListOfPaymentMethods(){
      const opt = {
        route: '/mobile/sales/getListOfPaymentMethods',
      }
      utils.loading.show()
      useFetch(opt).then(r => {
        utils.loading.hide()
        this.listOfPaymentMethods = r.data
      })
    },
    addCreditCardDone () {
      this.dialogAddCreditCard.open = false
      this.dialogRemoveCard.open = false
      // utils.loading.show()
      this.getListOfPaymentMethods()
    },
    clkSelectedPaymentMethod (type, item) {
      this.$emit('selectedPaymentMethod', type, item)
    },
    clkDefaultPaymentMethod (item) {
      if (item.name === 'addCreditCard') this.dialogAddCreditCard.open = true
      else this.clkSelectedPaymentMethod(item.name, '')
    },
  },
};
</script>
<style>
.item-tertiary{
  --background: var(--ion-color-tertiary);
}
</style>