<template>
  <ion-page>
    <ion-content>
      <HeaderComponent title="Consultas realizadas"/>
      <ion-list style="border-radius: 1rem;margin-inline: 16px;margin-bottom: 20px;">
        <ion-item
          :lines="i < opportunitiesList.length - 1 ? 'full' : 'none'"
          class="cardStyle"
          color="tertiary"
          v-for="(item,i) in opportunitiesList"
          :key="item._id"
          @click="clkOpenOpportunityDetail(item)"
        >
          <ion-label class="ion-text-wrap">
            <p>{{ item.createdAt.createdAtInFullLong}}</p>
            <!-- <ion-badge
              v-for="(complaint) in item.opportunityData.complaints" 
              :key="complaint._id"
              class="q-mr-sm"
              color="secondary"
            >{{ complaint.name }}</ion-badge> -->
            <ul style="margin-left:-15px;">
              <li
                class="ion-text-wrap" 
                v-for="(complaint) in item.opportunityData.complaints" 
                :key="complaint._id"
              >
                {{ complaint.name }}
              </li>
            </ul>
            <div class="q-mb-md">
              <h3>Valor avaliação</h3>
              <p>R$ {{ item.opportunityData.budget.budgetValue }}</p>
            </div>
            <ion-badge color="secondary" v-if="item.selectedProcedures && item.selectedProcedures.length > 0">
              Aperte aqui para ver sua avaliação
            </ion-badge>
          </ion-label>
          <!-- <ion-label slot="end">
            
          </ion-label> -->
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>


<script setup>
import {
  IonPage,
  IonButton,
  IonLabel,
  IonItem,
  IonBadge,
  IonCard,
  IonIcon,
  IonRow,
  IonCol,
  IonList,
  IonContent
} from '@ionic/vue';
import { useFetch } from '../composables/fetch'
import { chevronBack, arrowForward } from 'ionicons/icons';
import HeaderComponent from '../components/HeaderComponent.vue';
import utils from '../composables/utils'
</script>
<script>

export default {
  name: "NewOpportunitiesApprovedList",
  data() {
    return {
      opportunitiesList: [],
      opportunityId: '',
    };
  },
  watch: {
    $route(to) {
      if (to.path === '/newOpportunitiesApprovedList') {
        this.getOpportunitiesListById()
      }
    }
  },
  mounted(){
    this.getOpportunitiesListById()
  },
  methods: {
    clkOpenOpportunityDetail(item){
      this.$router.push('/newOpportunityDetail?opportunityId=' + item._id)
    },
    getOpportunitiesListById(){
      const opt = {
        route: '/mobile/afterSales/getOpportunitiesById',
      }
      utils.loading.show()
      useFetch(opt).then(r => {
        utils.loading.hide()
        this.opportunitiesList = r.data
      })
    },
  }
};
</script>
<style>
.cardStyle {
  background: var(--ion-color-tertiary);
  border-radius: 0;
  padding: 0px;
}
</style>