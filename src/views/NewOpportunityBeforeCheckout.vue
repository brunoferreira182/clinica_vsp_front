<template>
  <ion-page>
    <ion-content>
    
      <Transition v-if="showCPF" appear name="bounce">
        <div class="q-pt-sm q-px-md" >
          <HeaderComponent
            title="Preencher CPF"
          />
          <InputDocument
            mode="md"
            label="CPF"
            idField = "cpf"
            @onChange="onChangeInput"
            hint="Somente números"
            class="q-mb-md q-mt-md"
            :valueField="cpf"
            :disabled="docDisabled"
          />
          <ion-button
            color="primary"
            @click="sendCPF"
            expand="block"
          >Avançar
          </ion-button>
          <div class="q-pa-md">
            <ion-text color="medium">
              {{ CPFText }}
            </ion-text>
          </div>
        </div>
      </Transition>
      <Transition  v-if="showAddress" appear class="" name="slide-fade">
        <div class="q-pt-sm q-px-md" >
          <HeaderComponent
            title="Dados de endereço"
          />
          <ion-item class="q-my-md" fill="outline" mode="md">
            <ion-label position="floating">CEP</ion-label>
            <ion-input @keyup="checkCEP"/>
          </ion-item>
          <ion-item class="q-my-md " fill="outline" mode="md">
            <ion-label position="floating">Logradouro</ion-label>
            <ion-input v-model="dadosEndereco.street"/>
          </ion-item>
          <ion-item class="q-my-md " fill="outline" mode="md">
            <ion-label position="floating">Número</ion-label>
            <ion-input type="number" @keyup="(ev) => dadosEndereco.number = ev.target.value"/>
          </ion-item>
          <ion-item class="q-my-md " fill="outline" mode="md">
            <ion-label position="floating">Complemento (opcional)</ion-label>
            <ion-input @keyup="(ev) => dadosEndereco.complement = ev.target.value"/>
          </ion-item>
          <ion-row class="justify-between q-pa-none">
            <ion-col size="8" class="q-pa-none">
              <ion-item class="q-pr-md q-mb-md" fill="outline" mode="md">
                <ion-label position="floating">Cidade</ion-label>
                <ion-input v-model="dadosEndereco.city"/>
              </ion-item>
            </ion-col>
            <ion-col size="4" class="q-pa-none">
              <ion-item fill="outline" mode="md">
                <ion-label position="floating">UF</ion-label>
                <ion-input v-model="dadosEndereco.state"/>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-button
            color="primary"
            @click="clkNewAddress"
            expand="block"
          >Avançar
          </ion-button>
        </div>
      </Transition>
      <ion-alert
        :is-open="dialogAskForAddress.open"
        header="Vamos preencher mais alguns dados!"
        sub-header="Antes de ir para o pagamento com boleto,  é necessário ter seu endereço preenchido."
        :backdropDismiss="false"
        animated
        :buttons="[
          {
            text: 'Depois!',
            handler: () => {
              closeAskAddressDialog()
            }
          },
          {
            text: 'Vamos lá!',
            handler: () => {
              confirmDialogAskAddress()
            }
          }
        ]"
      ></ion-alert>
      <ion-alert
        :is-open="dialogNewProfileRegistration.open"
        header="Vamos preencher alguns dados!"
        sub-header="Antes de ir para o pagamento, é necessário ter seu CPF preenchido."
        :backdropDismiss="false"
        animated
        :buttons="[
          {
            text: 'Depois!',
            handler: () => {
              closeDialogNewProfile()
            }
          },
          {
            text: 'Vamos lá!',
            handler: () => {
              confirmDialogNewProfile()
            }
          }
        ]"
      ></ion-alert>
    </ion-content>
  </ion-page>
</template>


<script setup>
import {
  IonPage,
  IonButton,
  IonAlert,
  IonGrid,
  IonText,
  IonInput,
  IonRow,
  IonItem,
  IonLabel,
  IonCol,
  IonContent
} from '@ionic/vue';
import { useFetch } from '../composables/fetch'
import InputDocument from '../components/InputDocument.vue'
import utils from '../composables/utils'
import HeaderComponent from '../components/HeaderComponent.vue'
</script>
<script>

export default {
  name: "NewOpportunityBeforeCheckout",
  data() {
    return {
      dialogNewProfileRegistration: {
        open: false,
      },
      dialogAskForAddress: {
        open: false,
      },
      CPFText: 'Para que você possa utilizar de todas as formas de pagamento, é necessário preencher CPF.',
      options: [],
      permissions: [],
      showAddress: false,
      showCPF: false,
      active: '',
      paymentType: '',
      userInfo: [],
      indexMenu1: 0,
      document: {},
      docDisabled: false,
      value: '',
      hasAddress: '',
      hasDocument: '',
      dadosEndereco: {
        zipCode: '',
        street: '',
        number: '',
        complement: '',
        city: '',
        state: '', 
      },
    };
  },
  watch: {
    $route(to) {
      if (to.path === '/newOpportunityBeforeCheckout') {
        this.paymentType = this.$route.query.paymentType
        this.checkUserDocumentExists()
        this.checkUserAddressExists()
      }
    },
  },
  mounted(){
    this.paymentType = this.$route.query.paymentType
    utils.loading.hide()
    this.checkUserDocumentExists()
    this.checkUserAddressExists()
  },
  methods: {
    onChangeInput(d) {
      if (d.id === 'cpf') {
        this.document[d.id] = d.value
        this.documentValidated = d.validated
        this.cpf = this.document.cpf
      }
    },
    sendCPF(){
      const opportunityId = this.$route.query.opportunityId
      if (!this.documentValidated) {
        utils.toast("O CPF informado não é válido")
        return
      }
      const opt = {
        route: '/mobile/sales/insertUserDocument',
        body: {
          document: this.cpf,
        }
      }
      utils.loading.show()
      useFetch(opt).then(() => {
        utils.loading.hide()
        utils.toast('CPF preenchido com sucesso!')
        if(this.paymentType === 'pix'){
          this.hasDocument = true
          this.$router.push('/newOpportunityCheckout?opportunityId=' + opportunityId )
        } else if(this.paymentType === 'bank_slip') {
          this.hasDocument = true
          this.dialogAskForAddress.open = true
          this.showCPF = false
          this.showAddress = true
        }
      }) 
    },
    checkCEP (ev) {
      this.dadosEndereco.zipCode = ev.target.value
      if(this.dadosEndereco.zipCode.length === 8){
        const opt = {
          route: '/mobile/utils/getAddressFromZipCode',
          body: {
            zipCode: this.dadosEndereco.zipCode
          }
        }
        utils.loading.show()
        useFetch(opt).then(r => {
          utils.loading.hide()
          this.dadosEndereco.street = r.data.logradouro
          this.dadosEndereco.city = r.data.localidade
          this.dadosEndereco.state = r.data.uf
        })
      } 
      
    },
    clkNewAddress() {
      const opportunityId = this.$route.query.opportunityId
      if(
        this.dadosEndereco.street === '' ||
        this.dadosEndereco.zipCode === '' ||
        this.dadosEndereco.number === '' ||
        this.dadosEndereco.city === '' ||
        this.dadosEndereco.state === ''
      ) {
        utils.toast('Preencha todos os campos!')
        return
      }
      const opt = {
        route: '/mobile/sales/insertUserAddress',
        body: {
          addressData: this.dadosEndereco,
        }
      }
      utils.loading.show()
      useFetch(opt).then(() => {
        utils.loading.hide()
        utils.toast('Endereço preenchido com sucesso!')
        this.clearAddress()
        if(this.hasDocument){
          this.$router.replace('/newOpportunityCheckout?opportunityId=' + opportunityId )
        } else {
          this.dialogNewProfileRegistration.open = true
          this.showCPF = true
        }
      }) 
    },
    clearAddress(){
      this.dadosEndereco.street = '' 
      this.dadosEndereco.zipCode = '' 
      this.dadosEndereco.number = '' 
      this.dadosEndereco.complement = '' 
      this.dadosEndereco.city = '' 
      this.dadosEndereco.state = ''
    },
    confirmDialogNewProfile(){
      this.dialogNewProfileRegistration.open = false
    },
    confirmDialogAskAddress(){
      this.showAddress = true
      this.dialogAskForAddress.open = false
    },
    closeAskAddressDialog(){
      this.dialogAskForAddress.open = false
      this.$router.push('/tabs/home')
    },
    closeDialogNewProfile(){
      this.dialogNewProfileRegistration.open = false
      this.$router.push('/tabs/home')
    },
    checkUserDocumentExists(){
  
      const opportunityId = this.$route.query.opportunityId
      const opt = {
        serverName: 'authentication',
        route: '/checkUserDocumentExists'
      }
      useFetch(opt).then(r => {
        this.hasDocument = r.data
        console.log('documento', this.hasDocument)
        if(this.paymentType === 'pix'){
          if(!this.hasDocument){
            this.showCPF = true
            this.dialogNewProfileRegistration.open = true
          } else{
            this.$router.push('/newOpportunityCheckout?opportunityId=' + opportunityId)
          }
        }
      })
    },
    checkUserAddressExists(){
      const opportunityId = this.$route.query.opportunityId
      const opt = {
        serverName: 'authentication',
        route: '/checkUserAddressExists'
      }
      utils.loading.show()
      useFetch(opt).then(r => {
        utils.loading.hide()
        this.hasAddress = r.data
        if(!this.hasAddress){
          console.log('não tem endereço')
          if(this.hasDocument){
            console.log('não tem endereço mas tem documento')
            this.showCPF = false
            this.showAddress = true
            this.dialogAskForAddress.open = true
            this.dialogNewProfileRegistration.open = false
          } else {
            console.log('não tem endereço e não tem documento')
            this.dialogNewProfileRegistration.open = true
            this.showCPF = true
          }
        } else {
          console.log('tem endereço')
          this.$router.push('/newOpportunityCheckout?opportunityId=' + opportunityId)
        }
      })
    }
  }
};
</script>
<style scoped>
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
</style>