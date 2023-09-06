<template>
  <ion-page>
    <ion-content>
      <HeaderComponent title="Procedimentos pagos"/>

      <ion-list style="border-radius: 1rem;margin-inline: 16px;margin-bottom: 20px;">
        <div
          v-for="(item,i) in opportunitiesList"
          :key="i"
        >
          <ion-text>
            <p>{{ item.createdAt.createdAtInFullLong}}</p>
          </ion-text>
          <div class="q-mt-sm">
            <ion-badge
              v-for="(complaint) in item.opportunityData.complaints" 
              :key="complaint._id"
              class="q-mr-sm"
              color="secondary"
            >{{ complaint.name }}</ion-badge>
          </div>
          <ion-item
            lines="none"
            class="cardStyle"
            color="tertiary"
            @click="clkOpenOpportunityDetail(item)"
            style="border-radius: 1rem;"
          >
            <ion-label class="ion-text-wrap">
              
              
              <ul style="margin-left:-15px;">
                <li
                  class="ion-text-wrap" 
                  v-for="(procedure,i) in item.selectedProcedures" 
                  :key="i"
                >
                  {{ procedure.label }}
                </li>
              </ul>
            </ion-label>
            <ion-label slot="end">
              <!-- <h3>Valor procedimentos</h3> -->
              <p>R$ {{ item.opportunityData.opportunityPrice.price }}</p>
            </ion-label>
          </ion-item>
        </div>
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
  IonContent,
  IonText
} from '@ionic/vue';
import { useFetch } from '../composables/fetch'
import { chevronBack, arrowForward } from 'ionicons/icons';
import HeaderComponent from '../components/HeaderComponent.vue';
import utils from '../composables/utils'
</script>
<script>

export default {
  name: "PaidProceduresOpportunities",
  data() {
    return {
      opportunitiesList: [],
      opportunityId: '',
    };
  },
  mounted(){
    this.getPaidProceduresOpportunities()
  },
  methods: {
    clkOpenOpportunityDetail(item){
      this.$router.push('/newOpportunityDetail?opportunityId=' + item._id)
    },
    getPaidProceduresOpportunities(){
      const opt = {
        route: '/mobile/afterSales/getPaidProceduresOpportunities',
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