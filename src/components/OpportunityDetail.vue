<template>
  <div v-if="opportunityDetail">

    <ion-card color="tertiary" class="cardCheckout" style="box-shadow: 0">
      <ion-card-header>
        <ion-card-subtitle color="secondary">Dados consulta</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>
        <ion-item color="tertiary" lines="none" v-if="opportunityDetail.paidCents > 0">
          <ion-label class="ion-text-wrap">
            <h2>R$ {{ opportunityDetail.paidCents / 100 }}</h2>
            <p>Valor</p>
          </ion-label>
        </ion-item>
        <ion-item color="tertiary" lines="none" v-else>
          <ion-label class="ion-text-wrap">
            <h2>R$ {{ opportunityDetail.budget.budgetValue }}</h2>
            <p>Valor da fatura</p>
          </ion-label>
        </ion-item>
        <div v-if="opportunityDetail.paymentType === 'credit_card'">
          <ion-item color="tertiary" lines="none">
            <ion-label class="ion-text-wrap">
              <h2>Cartão de crédito</h2>
              <p>Forma de pagamento</p>
            </ion-label>
          </ion-item>
          <ion-item color="tertiary" lines="none">
            <ion-label class="ion-text-wrap">
              <h2>{{ opportunityDetail.creditCardBrand.toUpperCase() }}</h2>
              <p>Bandeira do cartão</p>
            </ion-label>
          </ion-item>
        </div>

        <div v-if="opportunityDetail.paymentType === 'bank_slip'">
          <ion-item color="tertiary" lines="none">
            <ion-label class="ion-text-wrap">
              <h2>Boleto</h2>
              <p>Forma de pagamento</p>
            </ion-label>
          </ion-item>
        </div>

        <div v-if="opportunityDetail.paymentType === 'pix'">
          <ion-item color="tertiary" lines="none">
            <ion-label class="ion-text-wrap">
              <h2>Boleto</h2>
              <p>Forma de pagamento</p>
            </ion-label>
          </ion-item>
        </div>

        <div v-if="opportunityDetail.invoiceStatus === 'paid'">
          <ion-item color="tertiary" lines="none">
            <ion-label class="ion-text-wrap">
              <h2>{{ opportunityDetail.paidAt.split('T')[0] }}</h2>
              <p>Data do pagamento</p>
              <ion-badge @click="clkInvoice('consultation')" color="success">Fatura paga - aperte para visualizar</ion-badge>
            </ion-label>
          </ion-item>
        </div>
        <div v-else>
          <ion-item color="tertiary" lines="none">
            <ion-label class="ion-text-wrap">
              <ion-badge color="warning">Fatura não paga</ion-badge>
              <p>Clique aqui para pagar</p>
            </ion-label>
          </ion-item>
        </div>
      </ion-card-content>
    </ion-card>

    <ion-card color="tertiary" class="cardCheckout" v-if="opportunityDetail && opportunityDetail.procedures">
      <ion-card-header>
        <ion-card-subtitle color="secondary">Procedimentos</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>
        <ion-list>
          <ion-item
            v-for="(item, i) in opportunityDetail.procedures"
            :key="i"
            color="tertiary"
            lines="none"
          >
            <ion-label>
              <h3>{{ item.procedureData.label }}</h3>
              <p v-if="item.status">Status: {{ item.status.label }}</p>
            </ion-label>
          </ion-item>
        </ion-list>
      </ion-card-content>
    </ion-card>

    <ion-card color="tertiary" class="cardCheckout" v-if="opportunityDetail && opportunityDetail.complaints">
      <ion-card-header>
        <ion-card-subtitle color="secondary">Queixas</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>
        <ion-list>
          <ion-item
            v-for="(item, i) in opportunityDetail.complaints"
            :key="i"
            color="tertiary"
            lines="none"
          >
            <ion-label>
              <h3>{{ item.name }}</h3>
              <p>{{ item.bodyCompanyName }}</p>
            </ion-label>
          </ion-item>
        </ion-list>
      </ion-card-content>
    </ion-card>

    <ion-card
      color="tertiary"
      class="cardCheckout"
      v-if="opportunityDetail && opportunityDetail.selectedProcedures && opportunityDetail.selectedProcedures.length"
    >
      <ion-card-header>
        <ion-card-subtitle color="secondary">Procedimentos sugeridos</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>
        <ion-list>
          <ion-item
            v-for="(item, i) in opportunityDetail.selectedProcedures"
            :key="i"
            color="tertiary"
            lines="none"
          >
            <ion-label>
              <h3>{{ item.label }}</h3>
              <p>{{ item.description }}</p>
            </ion-label>
          </ion-item>
        </ion-list>
      </ion-card-content>
    </ion-card>

    <ion-card
      color="tertiary"
      class="cardCheckout"
      v-if="opportunityDetail && opportunityDetail.showProceduresToUser && opportunityDetail.opportunityPrice"
    >
      <ion-card-header>
        <ion-card-subtitle color="secondary">Valor procedimentos</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>
        <ion-item color="tertiary" lines="none" v-if="opportunityDetail.proceduresPaidCents > 0">
          <ion-label class="ion-text-wrap">
            <h2>R$ {{ opportunityDetail.proceduresPaidCents / 100 }}</h2>
            <p>Valor</p>
          </ion-label>
        </ion-item>
        <ion-item v-else color="tertiary" lines="none">
          <ion-label class="ion-text-wrap">
            <h2>R$ {{ opportunityDetail.opportunityPrice.price }}</h2>
            <p>Valor dos procedimentos</p>
            <ion-chip color="danger" v-if="discount > 0">
              Desconto de 
              {{ discount }}%
            </ion-chip>
          </ion-label>
        </ion-item>
        <div v-if="opportunityDetail.proceduresPaymentType === 'credit_card'">
          <ion-item color="tertiary" lines="none">
            <ion-label class="ion-text-wrap">
              <h2>Cartão de crédito</h2>
              <p>Forma de pagamento</p>
            </ion-label>
          </ion-item>
          
          <ion-item color="tertiary" lines="none">
            <ion-label class="ion-text-wrap">
              <h2>{{ opportunityDetail.proceduresCreditCardBrand.toUpperCase() }}</h2>
              <p>Bandeira do cartão</p>
            </ion-label>
          </ion-item>

          <div v-if="opportunityDetail.proceduresInvoiceStatus === 'paid'">
            <ion-item color="tertiary" lines="none">
              <ion-label class="ion-text-wrap">
                <h2>{{ opportunityDetail.proceduresPaidAt.split('T')[0] }}</h2>
                <p>Data do pagamento</p>
                <ion-badge @click="clkInvoice('procedures')" color="success">Fatura paga - aperte para visualizar</ion-badge>
              </ion-label>
            </ion-item>
          </div>
          <div v-else>
            <ion-item color="tertiary" lines="none">
              <ion-label class="ion-text-wrap">
                <ion-badge color="warning">Fatura não paga</ion-badge>
                <p>Clique aqui para pagar</p>
              </ion-label>
            </ion-item>
          </div>
        </div>
      </ion-card-content>
    </ion-card>

  </div>
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
  IonBadge,
  IonText,
  IonChip
} from '@ionic/vue';

import { onMounted, ref, watch } from 'vue'

const props = defineProps(['opportunityDetail'])

const emits = defineEmits(['clkInvoice'])

const discount = ref(0)

watch(
  () => props.opportunityDetail,
  (nV, oV) => {
    if (!nV.opportunityPrice) return
    calculateDiscount(nV)
  }
)

function clkInvoice(type) {
  let secureUrl
  if (type === 'consultation') secureUrl = props.opportunityDetail.secureUrl
  else if (type === 'procedures') secureUrl = props.opportunityDetail.proceduresSecureUrl
  emits('clkInvoice', secureUrl)
}

function calculateDiscount (nV) {
  if (!nV.opportunityPrice.priceCents || !nV.opportunityPrice.priceCentsSum) return
  discount.value = Math.round((1 - (nV.opportunityPrice.priceCents / nV.opportunityPrice.priceCentsSum)) * 100)
}


</script>
