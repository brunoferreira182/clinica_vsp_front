<template>
  <ion-page>
    <ion-content>
      <HeaderComponent title="Fotos" closeButton="true"/>
      <PhotoHandler
        v-show="startPhotoHandler"
        :start="startPhotoHandler"
        :allFiles="true"
        :noCrop="false"
        @captured="captured"
        @cancel="cancelPhotoHandler"
      />
      <div>
        <h4 class="ion-text-start q-px-md text-primary">
          Enviar fotos:
        </h4>
        <p class="ion-text-start q-px-md q-mb-sm">
          Solicitamos fotos do seu corpo, de cada área que foi escolhida. Essas imagens auxiliarão o médico no momento da sua consulta.
        </p>
        <div v-if="type === 'procedures'">
          <div 
            v-for="(procedure, index) in proceduresArray" 
            :key="procedure._id"
            class="q-pt-sm"
          >
            <h5 class="ion-text-start q-px-lg text-primary" >
              {{ index + 1 }}. {{ procedure.procedureData.label }}
              
            </h5>
            <ion-row class="ion-align-items-center">
              <ion-col size="6" v-for="image in procedure.images" :key="image._id">
                <ion-card class="cardStyle">
                  <ion-button
                    color="primary"
                    style="
                      position: absolute;
                      display: flex;
                      margin-bottom: 120px;
                      margin-right: 135px;
                    "
                    fill="clear"
                    @click="clkDeleteImg(image)"
                  >
                    <ion-icon slot="icon-only" color="dark" :icon="close" />
                  </ion-button>
                  <!-- <ion-img :id="image.filename" :src="`${utils.attachmentsAddress()}${image.filename}`"/> -->
                  <img :id="image.filename" :src="`${utils.attachmentsAddress()}${image.filename}`"/>
                </ion-card>
              </ion-col>
              <ion-col size="5">
                <ion-button 
                  @click="clkAddAttachment(procedure)" 
                  class="q-mx-md"
                  size="small"
                  color="secondary"
                  fill="clear"
                  style="font-weight: 500;"
                >
                  <ion-icon :icon="camera" slot="end" />
                  Adicionar imagem
                </ion-button>
              </ion-col>
            </ion-row>
          </div>
        </div>

        <div v-if="type === 'complaints'">
          <div 
            v-for="(bodyPart, index) in bodyPartsSelected" 
            :key="bodyPart.bodyCompanyId"
            class="q-pt-sm"
          >
            <h5 class="ion-text-start q-px-lg text-primary" >
              {{ index + 1 }}. {{ bodyPart.bodyCompanyName }}
              
            </h5>
            <ion-row class="ion-align-items-center">
              <ion-col size="6" v-for="image in bodyPart.images" :key="image._id">
                <ion-card class="cardStyle">
                  <ion-button
                    color="primary"
                    style="
                      position: absolute;
                      display: flex;
                      margin-bottom: 120px;
                      margin-right: 135px;
                    "
                    fill="clear"
                    @click="clkDeleteImg(image)"
                  >
                    <ion-icon slot="icon-only" color="dark" :icon="close" />
                  </ion-button>
                  <!-- <ion-img :id="image.filename" :src="`${utils.attachmentsAddress()}${image.filename}`"/> -->
                  <img :id="image.filename" :src="`${utils.attachmentsAddress()}${image.filename}`"/>
                </ion-card>
              </ion-col>
              <ion-col size="5">
                <ion-button 
                  @click="clkAddAttachmentToBodyPart(bodyPart, index)"
                  class="q-mx-md"
                  size="small"
                  color="secondary"
                  fill="clear"
                  style="font-weight: 500;"
                >
                  <ion-icon :icon="camera" slot="end" />
                  Adicionar imagem
                </ion-button>
              </ion-col>
            </ion-row>
          </div>
        </div>


      </div>
      <div class="q-pa-md q-mt-sm" >
        <ion-button 
        class="q-mb-sm"
          expand="block"
          @click="clkGoToPayment"
        >
          Avançar
        </ion-button>
        <ion-button @click="clkStepBack" expand="block" fill="outline">
          Voltar
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>


<script setup>
import {
  IonPage,
  IonRow,
  IonCardHeader,
  IonCardSubtitle,
  IonCol,
  IonLabel,
  IonBadge,
  IonList,
  IonItem,
  IonAlert,
  IonImg,
  IonIcon,
  IonButton,
  IonCard,
  IonContent
} from '@ionic/vue';
import { useFetch } from '../composables/fetch'
import PhotoHandler from '../components/PhotoHandler.vue'
import utils from '../composables/utils'
import { camera, close } from 'ionicons/icons';
import HeaderComponent from '@/components/HeaderComponent.vue';
import { MODE_MASTER_SERVER } from '../composables/variables'
</script>
<script>
export default {
  name: "NewOpportunityInsertPhoto",
  data() {
    return {
      close,
      photoStep: '',
      value: '',
      show: false,
      startPhotoHandler: false,
      customerPictures: [],
      proceduresArray: [],
      image: null,
      procedureData: {
        procedureId: '',
        procedureData: {},
      },
      step: 'initial',
      newImageLoading: true,
      type: 'complaints',
      bodyPartsSelected: [],
      opportunityBodyPartId: null,
    };
  },
  watch: {
    $route(to) {
      if (to.path === '/newOpportunityInsertPhoto') {
        utils.loading.hide()
        this.getOpportunityDetailById()
      }
    }
  },
  mounted(){
    utils.loading.hide()
    this.getOpportunityDetailById()
  },
  methods: {
    clkDeleteImg(item){
      const opt = {
        route: '/mobile/sales/deleteOpportunityImage',
        body: {
          opportunityImageId: item.opportunityImageId
        },
      }
      utils.loading.show()
			useFetch(opt).then(r => {
        utils.loading.hide()
        utils.toast('Imagem deletada com sucesso')
        this.getOpportunityDetailById()
      })
    },
    
    clkGoToPayment(){
      if (!this.chkImages()) {
        utils.toast('Insira ao menos uma imagem por procedimento')
        return
      }
      const opt = {
        route: '/mobile/sales/goToBudget',
        body: {
          opportunityId : this.$route.query.opportunityId
        }
      }
			useFetch(opt).then(r => {
        this.$router.replace('newOrEditOpportunityBudget?opportunityId=' + this.$route.query.opportunityId)
      })
    },
    chkImages () {
      let ret = true
      if (MODE_MASTER_SERVER !== 'prod' && MODE_MASTER_SERVER !== 'dev_ext') return ret
      if (this.type === 'procedures') {
        this.proceduresArray.forEach(procedure => {
          if (!procedure.images || !procedure.images.length || procedure.images.length === 0) ret = false
        })
      } else if (this.type === 'complaints') {
        this.bodyPartsSelected.forEach(bodyPart => {
          if (!bodyPart.images || bodyPart.images.length === 0) ret = false
        })
      }
      return ret

    },
    clkAddAttachment (item) {
      this.procedureData.procedureData = item.procedureData
      this.procedureData.procedureId = item.procedureId
      this.step = 'addAttachment'
      this.startPhotoHandler = !this.startPhotoHandler
    },
    clkAddAttachmentToBodyPart (item, i) {
      console.log(item)
      this.opportunityBodyPartId = item._id
      this.step = 'addAttachment'
      this.startPhotoHandler = !this.startPhotoHandler
    },
    cancelPhotoHandler () {
      this.startPhotoHandler = false
      this.step = 'initial'
    },
    captured(fileUrl, fileBlob, fileName) {
      this.sendFile( fileBlob )
      this.startPhotoHandler = false
    },
    sendFile (file) {
      const opt = {
        route: '/mobile/sales/newOpportunityImage',
        body: {
          opportunityId: this.$route.query.opportunityId,
          // procedureData: this.procedureData
        },
        file: [file]
      }
      if (this.type === 'procedure') opt.body.procedureData = this.procedureData
      else if (this.type === 'complaints') {
        opt.body.opportunityBodyPartId = this.opportunityBodyPartId
      }
      this.newImageLoading = true
			useFetch(opt).then(r => {
        // utils.loading.hide()
        if(r.error === false) this.getOpportunityDetailById()
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
        this.newImageLoading = false
        this.proceduresArray = r.data.opportunityData.procedures
        this.bodyPartsSelected = r.data.bodyPartsSelected
        this.value = r.data.opportunityData.budgetValue,
        this.customerPictures = r.data
        this.show = true
      })
    },
    clkStepBack () {
      this.$router.back()
    }
  }
};
</script>
<style scoped>
p {
  color: #6e6e6e;
}
ion-item {
  --border-radius: 1rem;
  --background: #cfcfcf;
  --color: rgb(99, 99, 99);
}
ion-badge {
  --background: #c2955d;
  --color: white;
  --padding-end: 20px;
  --padding-start: 20px;
}
.cardStyle{
  border-radius: 0.5rem; 
  height: 9rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 5px 2.5px 5px 5px;
  box-shadow: 0px 0px 6px -3px;
}

.dot-pulse {
  position: relative;
  left: -9999px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #ffffff;
  color: #ffffff;
  box-shadow: 9999px 0 0 -5px;
  animation: dot-pulse 1.5s infinite linear;
  animation-delay: 0.25s;
}
.dot-pulse::before, .dot-pulse::after {
  content: "";
  display: inline-block;
  position: absolute;
  top: 0;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #ffffff;
  color: #ffffff;
}
.dot-pulse::before {
  box-shadow: 9980px 0 0 -5px;
  animation: dot-pulse-before 1.5s infinite linear;
  animation-delay: 0s;
}
.dot-pulse::after {
  box-shadow: 10008px 0 0 -5px;
  animation: dot-pulse-after 1.5s infinite linear;
  animation-delay: 0.5s;
}

@keyframes dot-pulse-before {
  0% {
    box-shadow: 9980px 0 0 -5px;
  }
  30% {
    box-shadow: 9980px 0 0 2px;
  }
  60%, 100% {
    box-shadow: 9980px 0 0 -5px;
  }
}
@keyframes dot-pulse {
  0% {
    box-shadow: 9999px 0 0 -5px;
  }
  30% {
    box-shadow: 9999px 0 0 2px;
  }
  60%, 100% {
    box-shadow: 9999px 0 0 -5px;
  }
}
@keyframes dot-pulse-after {
  0% {
    box-shadow: 10008px 0 0 -5px;
  }
  30% {
    box-shadow: 10008px 0 0 2px;
  }
  60%, 100% {
    box-shadow: 10008px 0 0 -5px;
  }
}
</style>