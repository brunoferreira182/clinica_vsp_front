<template>
  <ion-page>
    <ion-content >
      <HeaderComponent title="Prazo e orçamento" closeButton="true"/>
      <div class="q-mx-md q-mb-lg">
        <h4 style="color:var(--ion-color-primary);margin-top: 0px;">
          Selecione o prazo para iniciar o procedimento:
        </h4>
      </div>
      <div class="q-ma-md" style="border-radius: 1rem;padding: 5px;overflow: hidden;background: var(--ion-color-tertiary)">
        <ion-radio-group v-model="monthSelected">
          <!-- <ion-radio
            style="margin-left:-7px;--background: var(--ion-color-tertiary)"
            class="radio-square"
            :value="item"
            v-for="item in months"
            :key="item.name"
          >
            {{ item }}
          </ion-radio><br /> -->
          <ion-item
            style="margin-left:-7px;--background: var(--ion-color-tertiary)"
            lines="none"
            class="q-py-xs"
            v-for="item in months"
            :key="item.name"
          >
            <ion-label class="ion-text-wrap">
              <h5>{{ item }}</h5>
            </ion-label>
            <ion-radio slot="end" class="radio-square" :value="item"></ion-radio>
          </ion-item>
        </ion-radio-group>
      </div>

      <Transition name="bounce" >
        <ion-item
          v-if="monthSelected === 'Outro'"
          class="q-my-md q-px-lg" 
          fill="outline" 
          mode="md"
        >
          <ion-label position="stacked">Data:</ion-label>
          <ion-input 
            type="date"
            v-model="customerBudget.date"
          />
          <ion-note slot="helper">{{ hint2 }}</ion-note>
        </ion-item>
      </Transition>
      <!-- <ion-item class="q-my-lg q-mx-lg" fill="outline" mode="md">
        <ion-label position="floating">Valor disponível</ion-label>
        <ion-input 
          type="number"
          v-model="customerBudget.valueSelected"
        />
        <ion-note slot="helper">{{ hint1 }}</ion-note>
      </ion-item> -->
      <div class="q-ma-md">Abaixo informe o valor que você tem disponível como orçamento para o procedimento</div>
      <InputMoney
        label="Valor disponível"
        v-model="customerBudget.valueSelected"
        class="q-my-lg q-mx-md"
      />
      <div class="ion-text-center q-mt-md q-mx-md">
        <ion-button
          @click="clkOpportunityBudget"
          color="primary"
          expand="block"
        >Avançar</ion-button>
        <ion-button
          @click="clkStepBack"
          fill="outline"
          color="primary"
          expand="block"
          class="q-mt-md"
        >Voltar</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>


<script setup>
import {
  IonPage,
  IonButton,
  IonRadio,
  IonRadioGroup,
  IonInput,
  IonNote,
  IonLabel,
  IonItem,
  IonContent
} from '@ionic/vue';
import utils from '../composables/utils'
import { useFetch } from '../composables/fetch'
import HeaderComponent from '../components/HeaderComponent.vue';
import InputMoney from '../components/InputMoney.vue'
</script>
<script>

export default {
  name: "NewOrEditOpportunityBudget",
  data() {
    return {
      teste: '',
      hint1: 'Digite o valor que pretendes utilizar para este orçamento',
      hint2: 'Especifique a data desejada',
      monthSelected: '',
      customerBudget: {
        valueSelected: '',
        date: '',
      },
      months: [
        '1 mês', 
        '2 meses', 
        '3 meses', 
        '4 meses', 
        'Outro', 
      ],
      userAddressData: [],
      opportunityDetail: null
    };

  },
  beforeMount(){
    utils.loading.hide()
    this.checkUserAddressExists()
    this.getOpportunityDetailById()
  },
  methods: {
    checkUserAddressExists(){
      const opt = {
        route: '/getUserAddress',
      }
      useFetch(opt).then(r => {
        this.userAddressData = r.data
      })
    },
    clkOpenProcedureDetail(item){
      const _id = item
      this.$router.push('/newDraftProcedureDetail?_id=' + _id)
    },
    clkOpportunityBudget(){
      const opportunityId = this.$route.query.opportunityId
      if(this.monthSelected !== 'Outro'){
        this.customerBudget.date = this.monthSelected
      }
      if(this.customerBudget.valueSelected === '' ||  this.customerBudget.date === '' ) {
        utils.toast('Preencha prazo e valor!')
        return
      }
      const opt = {
        route: '/mobile/sales/newOrEditOpportunityBudget',
        body: {
          opportunityId: this.$route.query.opportunityId,
          budget: this.customerBudget
        }
      }
      utils.loading.show()
      useFetch(opt).then(() => {
        utils.loading.hide()
        this.$router.replace('/newOpportunityCheckout?opportunityId=' + opportunityId)
      })
    },
    clkStepBack () {
      this.$router.replace('/newOpportunityInsertPhoto?opportunityId=' +this.$route.query.opportunityId)
    },
    getOpportunityDetailById(){
      const opt = {
        route: '/mobile/sales/getOpportunityDetailById',
        body: {
          opportunityId: this.$route.query.opportunityId,
        },
      }
      utils.loading.show()
      useFetch(opt).then(r => {
        utils.loading.hide()
        this.opportunityDetail = r.data
        if (r.data.opportunityData.clientBudget) {
          this.customerBudget.valueSelected = r.data.opportunityData.clientBudget.valueSelected
          this.customerBudget.date = r.data.opportunityData.clientBudget.date
          this.monthSelected = r.data.opportunityData.clientBudget.date
        }
      })
    }
  }
};
</script>
<style scoped>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
  ion-radio {
    width: 28px;
    height: 28px;
  }

  ion-radio::part(container) {
    border-radius: 1rem;
    border: 1px solid #bda983;
  }

  ion-radio::part(mark) {
    background: none;
    transition: none;
    transform: none;
    border-radius: 0;
  }

  ion-radio.radio-checked::part(container) {
    background: var(--ion-color-secondary);
    border-color: transparent;
    
  }

  ion-radio.radio-checked::part(mark) {
    width: 6px;
    height: 10px;
    border-width: 0px 2px 2px 0px;
    border-style: solid;
    border-color: var(--ion-color-background);

    transform: rotate(45deg);
  }
</style>