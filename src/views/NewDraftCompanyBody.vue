<template>
  <ion-page>
    <ion-content >
      <div class="q-mx-md">
        
        <h1>Novo orçamento</h1>
        <h6 style="padding: 0;color: var(--ion-color-secondary);" class="q-py-md">
          Selecione o gênero para prosseguir.
        </h6>
        <div
          v-if="activeBudget"
          class="active-budget-button q-mt-md"
          @click="goToActiveBudget"
        >
          Você possui um orçamento em andamento.<br> 
          <small> clique aqui para continuar</small>
        </div>
      </div>
      <div style="display: flex;flex-direction: column;gap:15px;margin-top: 2vh;" class="ion-padding" >
        <div 
          style="padding:0px;text-align: center;"
        >
          <ion-card
            @click="getCompanyBody(genderOptions.male)"
            class="cardStyle "
          >
            <div class="text-h5">
              Masculino
            </div>
            <div>
              <ion-icon size="large" class="ion-no-margin" color="secondary" :icon="man" />
            </div>
          </ion-card>
        </div>
        <div
          style="padding:0px;text-align: center;"
        >
          <ion-card
            @click="getCompanyBody(genderOptions.female)"
            class="cardStyle "
          >
          <div class="text-h5">
            Feminino
          </div>
          <div>
            <ion-icon size="large" color="secondary" :icon="woman" />
          </div>
          </ion-card>
        </div>
      </div>

    </ion-content>
  </ion-page>
</template>


<script setup>
import {
  IonPage,
  IonCard,
  IonAlert,
  IonIcon,
  IonCol, IonRow,
  IonContent,
  alertController
} from '@ionic/vue';
import { useFetch } from '../composables/fetch'
import HeaderComponent from '../components/HeaderComponent.vue'
import { man, woman } from 'ionicons/icons';
import utils from '../composables/utils'
</script>
<script>

export default {
  name: "newDraftCompanyBody",
  data() {
    return {
      man, woman , 
      arrayMyProcedures: [],
      selectedProceduresCount: 0,
      dialogAskForContinueProceduresList: {
        open: false,
      },
      dialogText: 'Parece que você já tem um orçamento em aberto. Deseja continuar ou quer descartá-lo e iniciar outro?',
      genderSelected: '',
      genderOptions: {
        male: 'male',
        female: 'female'
      },
      activeBudget: false,
    };
  },
  watch: {
    $route(to) {
      if (to.path === '/newDraftCompanyBody') {
        this.getActiveOpportunitiesFromUser()
        window.localStorage.removeItem('proceduresArray');
      }
    
    }
  },
  mounted(){
    this.getActiveOpportunitiesFromUser()
  },
  methods: {
    goToActiveBudget () {
      const route = '/newDraftComplaintSelection?opportunityId='
      // if (this.activeBudget.status.status === 'inImages') {
      //   route = '/newOpportunityInsertPhoto?opportunityId='
      // }
      // else if (this.activeBudget.status.status === 'inBudget') {
      //   route = '/newOrEditOpportunityBudget?opportunityId='
      // }
      // else if (this.activeBudget.status.status === 'waitingPayment') {
      //   route = '/newOpportunityCheckout?opportunityId='
      // }
      // console.log(this.activeBudget.status.status)
      this.$router.push(route + this.activeBudget.opportunityId)
    },
    getActiveOpportunitiesFromUser () {
      const opt = {
        route: '/mobile/sales/getActiveOpportunitiesFromUser',
      }
      utils.loading.show()
      useFetch(opt).then( r => {
        utils.loading.hide()
        this.activeBudget = r.data
      })
    },
    clearAndInactiveOpportunities(){
      window.localStorage.removeItem('proceduresArray');
      this.inactiveUserOpportunities()
    },
    inactiveUserOpportunities(){
      const opt = {
        route: '/mobile/sales/inactiveUserOpportunities',
      }
      utils.loading.show()
      useFetch(opt).then(() => {
        utils.loading.hide()
        utils.toast('Orçamento descartado!')
      })
    },
    clkContinueToMyDraft(){
      this.$router.push('/newDraftComplaintSelection')
    },
    getCompanyBody(genderOptions){
      this.genderSelected = genderOptions
      console.log(this.genderSelected)
      const opt = {
        route: '/mobile/sales/getCompanyBody',
      }
      utils.loading.show()
      useFetch(opt).then(() => {
        utils.loading.hide()
        const lastGender = window.localStorage.getItem('lastGender')
        if (lastGender && lastGender !== this.genderSelected) {
          // dialogo
          this.showDialogSwitchGender()
          return
        }
        this.$router.push('/newDraftComplaintSelection?gender=' + this.genderSelected)
        window.localStorage.setItem('lastGender', this.genderSelected)

      })
    },
    async showDialogSwitchGender() {
      const alert = await alertController.create({
          header: 'Orçamento ativo!',
          message: 'Você iniciou um orçamento com outro gênero. Deseja continuar? Seu outro orçamento será apagado.',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
                ''
              },
            },
            {
              text: 'Continuar',
              role: 'confirm',
              handler: () => {
                
                window.localStorage.setItem('lastGender', this.genderSelected)
                window.localStorage.removeItem('proceduresArray')
                this.deleteOtherOppotunities()
              },
            },
          ],
        });
        await alert.present();
    },
    deleteOtherOppotunities() {
      const opt = {
        route: '/mobile/sales/inactivateUserOpportunities',
      }
      useFetch(opt).then(r => {      
        this.$router.push('/newDraftComplaintSelection?gender=' + this.genderSelected + '&clearList=true')
      })
    },
  }
};
</script>


<style scoped>
.cardStyle{
  border-radius: 0.5rem; 
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 60px;
  align-items: center;
  justify-content: center;
  margin-inline: 50px;
  margin-block: 0;
  box-shadow: 0px 0px 7px -0px var(--ion-color-tertiary);
}
.cardStyle:active {
  background: var(--ion-color-tertiary);
}
.active-budget-button {
  background-color: var(--ion-color-secondary);
  color: var(--ion-color-background);
  /* margin-inline: 10px; */
  padding: 10px;
  border-radius: 0.4rem;
}
.active-budget-button:active {
  opacity: 0.85;
}
</style>