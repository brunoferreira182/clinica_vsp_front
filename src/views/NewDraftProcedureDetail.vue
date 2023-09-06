<template>
  <ion-page>
    <ion-content >
      <HeaderComponent/>
      <div class="q-mx-md">
          <h1 style="text-transform: capitalize;">{{ procedureDetail.label }}</h1>
          <div >
            <p>
              {{ procedureDetail.description }}
            </p>
          </div>
          <ion-button 
            expand="block"
            v-if="!$route.query.selected" 
            @click="addProcedure()"
          >
            Adicionar procedimento
          </ion-button>
        </div>
    </ion-content>
  </ion-page>
</template>


<script setup>
import {
  IonPage,
  IonButton,
  IonIcon,
  IonImg,
  IonCol,
  IonRow,
  IonContent
} from '@ionic/vue';
import { useFetch } from '../composables/fetch'
import { chevronBack } from 'ionicons/icons';
import utils from '../composables/utils'
import HeaderComponent from '../components/HeaderComponent.vue'
</script>
<script>

export default {
  name: "NewDraftProcedureDetail",
  data() {
    return {
      chevronBack,
      procedureId: '',
      procedureSelectedToObj: {},
      procedureDetail: {},
      proceduresArray: [],
      prevQuery: ''
    };
  },
  mounted(){
    utils.loading.hide()
    this.checkStoredProcedures()
    this.getProcedureById()
  },
  methods: {
    checkStoredProcedures(){
      const storedProcedures = localStorage.getItem('proceduresArray');
      if (storedProcedures) {
        this.proceduresArray = JSON.parse(storedProcedures);
      }
    },
    addProcedure() {
      if (this.$route.query.opportunityId) this.addProcedureToOpportunity()
      else this.addProcedureToLocalStorage()
    },
    addProcedureToLocalStorage() {
      if (window.localStorage.getItem('proceduresArray')) {
        const list = JSON.parse(window.localStorage.getItem('proceduresArray'))
        let repeated = false
        list.forEach(element => {
          console.log(element.procedureId === this.procedureSelectedToObj.procedureId)
          if (element.procedureId === this.procedureSelectedToObj.procedureId) {
            utils.toast('Você ja adicionou este procedimento!')
            repeated = true
            return
          }
        })
        if (repeated) return
      }
      this.proceduresArray.push(this.procedureSelectedToObj);
      window.localStorage.setItem('proceduresArray', JSON.stringify(this.proceduresArray));
      // utils.toast('Procedimento adicionado com sucesso')
      this.$router.back(-2)
    },
    addProcedureToOpportunity () {
      const opt = {
        route: '/mobile/sales/addProcedureToOpportunity',
        body: {
          opportunityId: this.$route.query.opportunityId,
          procedure: this.procedureSelectedToObj
        }
      }
      useFetch(opt).then(r => {
        if (r.errorMessage) {
          utils.toast(r.errorMessage)
          return
        }
        this.$router.back()
      })
    },
    getProcedureById(){
      const opt = {
        route: '/mobile/sales/getProcedureById',
        body: {
          procedureId: this.$route.query._id
        }
      }
      useFetch(opt).then(r => {
        this.procedureId = r.data._id,
        this.procedureSelectedToObj = r.data,
        this.procedureDetail = r.data.procedureData
      })
    },

  }
};
</script>