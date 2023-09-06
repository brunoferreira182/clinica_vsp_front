<template>
  <ion-page>
    <ion-content>
      <HeaderComponent title="Procedimentos"/>
      <div class=" q-mx-md q-mb-lg q-mt-sm">
        <h2 style="margin: 0;color: var(--ion-color-primary);text-transform: capitalize;">{{ bodyPartSelectedData.label }}</h2>
        <h6 style="margin-top: 10px;color: var(--ion-color-secondary);">
            Selecione um procedimento abaixo:
        </h6>
      </div>
      <ion-list class="ion-no-padding ion-margin procedures-list">
        <ion-item
          style="--background: var(--ion-color-tertiary);text-transform: capitalize;"
          button
          lines="none"
          @click="clkOpenProcedureDetail(item._id)"
          v-for="item in proceduresListByBodyPart.procedures"
          :key="item"
        >
          <ion-label>
            <h6>{{ item.procedureData.label }}</h6>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>


<script setup>
import {
  IonPage,
  IonButton,
  IonList,
  IonIcon,
  IonLabel,
  IonItem,
  IonContent
} from '@ionic/vue';
import { chevronBack } from 'ionicons/icons';
import utils from '../composables/utils'
import HeaderComponent from '../components/HeaderComponent.vue'
import { useFetch } from '../composables/fetch'
</script>
<script>

export default {
  name: "NewDraftProceduresList",
  data() {
    return {
      chevronBack,
      proceduresListByBodyPart: [],
      bodyPartSelectedData: {},
    };
  },
  watch: {
    $route(to) {
      if (to.path === '/newDraftProceduresList') {
        this.getProceduresByBodyPart()
      }
    }
  },
  mounted(){
    utils.loading.hide()
    this.getProceduresByBodyPart()
  },
  methods: {
    clkOpenProcedureDetail(item){
      const _id = item
      const extra = this.$route.query.opportunityId
        ? `&opportunityId=${this.$route.query.opportunityId}`
        : ''
      this.$router.replace('/newDraftProcedureDetail?_id=' + _id + extra)
    },
    getProceduresByBodyPart(){
      const opt = {
        route: '/mobile/sales/getProceduresByBodyPart',
        body: {
          bodyCompanyId: this.$route.query._id
        }
      }
      utils.loading.show()
      useFetch(opt).then(r => {
        utils.loading.hide()
        this.bodyPartSelectedData = r.data.bodyPart
        this.proceduresListByBodyPart = r.data
      })
    },

  }
};
</script>
<style>


.procedures-list{
  --background: var(--ion-color-tertiary);
  border-radius: 0.5rem;
  
}
</style>