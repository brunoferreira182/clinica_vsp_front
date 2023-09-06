<template>
  <ion-page>
    <ion-content>
      <HeaderComponent title="Queixas"/>
      <div class=" q-mx-md q-mb-lg q-mt-sm">
        <!-- <h2 style="margin: 0;color: var(--ion-color-primary);text-transform: capitalize;">{{ bodyPartSelectedData.label }}</h2> -->
        <h6 style="margin-top: 10px;color: var(--ion-color-secondary);">
          O que deseja melhorar? Aperte até 3 opções.
        </h6>
      </div>
      <div class="ion-padding">
        <ion-button
          v-for="(item, i) in complaints"
          :key="item"
          expand="block"
          shape="round"
          @click="clkComplaint(item, i)"
          :fill="complaints[i].checked ? 'solid' : 'outline'"
          color="secondary"
        >{{ item.name }}</ion-button>
        <ion-button
          expand="block"
          shape="round"
          @click="clkComplaint(other)"
          :fill="other.checked ? 'solid' : 'outline'"
          color="secondary"
        >Outro</ion-button>
        <transition name="bounce">
          <ion-item v-if="other.checked" mode="md" fill="outline" class="q-mt-md">
            <ion-label position="floating">Digite aqui</ion-label>
            <ion-input
              v-model="other.name"
              mode="md"
            ></ion-input>
          </ion-item>
        </transition>
      </div>

      <div class="ion-padding">
        <ion-button
          expand="block"
          @click="clkConfirm"
          color="primary"
        >Confirmar</ion-button>
      </div>
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
  IonContent,
  IonInput,
  alertController
} from '@ionic/vue';
import { chevronBack } from 'ionicons/icons';
import utils from '../composables/utils'
import HeaderComponent from '../components/HeaderComponent.vue'
import { useFetch } from '../composables/fetch'
</script>
<script>

export default {
  name: "newDraftComplaintsList",
  data() {
    return {
      chevronBack,
      complaints: [],
      complaintsQtySelected: 0,
      other: {
        dialogOpen: false,
        checked: false,
        name: '',
        bodyCompanyId: '',
        bodyCompanyName: '',
        complaintId: 'other'
      },
      selectedComplaints: []
    };
  },
  watch: {
    $route(to) {
      if (to.path === '/newDraftComplaintsList') {
        this.getComplaintsByBodyPart()
        this.selectedComplaints = this.getComplaintsFromLocalStorage()
        this.verifyCheckButtons()
      }
      
    }
  },
  mounted(){
    utils.loading.hide()
    this.getComplaintsByBodyPart()
    
  },
  methods: {
    getComplaintsByBodyPart () {
      const opt = {
        route: '/mobile/sales/getComplaintsByBodyPart',
        body: {
          bodyCompanyId: this.$route.query._id
        }
      }
      utils.loading.show()
      useFetch(opt).then(r => {
        utils.loading.hide()
        if (r.error) return
        this.complaints = r.data
        if (this.complaints.length > 0) {
          this.other.bodyCompanyId = this.complaints[0].bodyCompanyId
          this.other.bodyCompanyName = this.complaints[0].bodyCompanyName
        }
        this.verifyCheckButtons()
        this.syncSelectedComplaints()
      })
    },
    syncSelectedComplaints () {
      this.selectedComplaints = this.getComplaintsFromLocalStorage()
      this.verifyCheckButtons()
    },
    clkComplaint (item, i) {
      if (item.checked) this.removeComplaintFromSelected(item, i)
      else this.addComplaintToSelected(item, i)
    },
    addComplaintToSelected (item, i) {
      if (this.selectedComplaints.length === 3) {
        utils.toast('Para marcar mais uma opção, desmarque alguma já selecionada')
        return
      }
      if (item.complaintId === 'other') {
        this.other.checked = true
        // this.showOtherDialog()
        return
      }
      
      this.complaints[+i].checked = true
      this.addComplaintToLocalStorage(item)
    },
    addComplaintToLocalStorage (item) {
      const lsComplaints = this.getComplaintsFromLocalStorage()
      lsComplaints.push(item)
      this.selectedComplaints = lsComplaints
      this.setComplaintsToLocalStorage(lsComplaints)
    },
    getComplaintsFromLocalStorage () {
      let localStorageComplaints = window.localStorage.getItem('complaints')
      if (!localStorageComplaints) localStorageComplaints = []
      else localStorageComplaints = JSON.parse(localStorageComplaints)
      return localStorageComplaints
    },
    setComplaintsToLocalStorage (complaints) {
      localStorage.setItem('complaints', JSON.stringify(complaints))
    },
    removeComplaintFromSelected (item, i) {
      item.complaintId === 'other' ? this.other.checked = false : this.complaints[+i].checked = false
      this.removeComplaintFromLocalStorage(item)
    },
    removeComplaintFromLocalStorage (item) {
      const lsComplaints = this.getComplaintsFromLocalStorage()
      let index
      lsComplaints.forEach((c, i) => {
        if (c.complaintId === item.complaintId) index = i
      })
      lsComplaints.splice(index, 1)
      this.setComplaintsToLocalStorage(lsComplaints)
      this.selectedComplaints = lsComplaints
    },
    verifyCheckButtons () {
      console.log('camadona?')
      this.complaints.forEach((c, i) => {
        this.complaints[i].checked = false
        this.selectedComplaints.forEach(lsC => {
          if (c.complaintId === lsC.complaintId && c.bodyCompanyId === lsC.bodyCompanyId) {
            this.complaints[i].checked = true
          }
          if (lsC.complaintId === 'other' && lsC.bodyCompanyId === c.bodyCompanyId) this.other = lsC
        })
      })
    },
    clkConfirm () {
      if (this.other.checked) {
        if (this.other.name === '') {
          utils.toast('Preencha sua reclamação no campo Digite aqui.')
          return
        }
        const complaints = this.getComplaintsFromLocalStorage()
        complaints.push(this.other)
        this.setComplaintsToLocalStorage(complaints)
      }
      this.$router.back()
    },
    async showOtherDialog () {
      const alert = await alertController.create({
        header: 'Digite aqui',
        buttons: ['OK'],
        inputs: [
          {
            type: 'textarea',
          },
        ],
      });

      await alert.present();
      console.log(alert, 'alert aqui')
    }
  }
};
</script>
<style>
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

.complaints-list{
  --background: var(--ion-color-tertiary);
  border-radius: 0.5rem;
  
}
</style>