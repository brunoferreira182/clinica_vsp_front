<template>
  <ion-page>
    <ion-content :scroll-y="false">
      <HeaderComponent title="Novo orçamento"/>
      <h1 class="ion-text-center" style="color: var(--ion-color-secondary); margin-top: -45px;">Novo orçamento</h1>
      <div 
        class="ion-text-center q-ma-md q-mb-lg" style="color: var(--ion-color-primary);"> 
        Toque em alguma parte do corpo:
      </div>
      <div
        class="svg-container"
        v-if="view === 'body' && !loadingParts"
      >
        <svg
          class="svg-body"
          ref="body"
          version="1.1" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 800 1360"
          xml:space="preserve"
        >
        
          <image 
            style="height:100%;"
            :xlink:href="image"
            
          />
          <path
            v-for="(item, i) in arrayBodies"
            :key="i"
            :style="`${item.gender === 'male' ? 'translate: -0px -0px' :
            'translate: 49px 0px;scale:1.03'}`"
            :d="item.d"
            :fill="pathAttrs.fill"
            :stroke="pathAttrs.stroke"
            :vector-effect="pathAttrs.vectorEffect"
            :stroke-opacity="pathAttrs.strokeOpacity"
            :class="`${item.paint ? 'path-filled' : 'path-not-selected'}`"
            :ref="'path' + i"
            @click="clkBodyPart(item)"
          />
        </svg>
        <div class="base-chao-1" ></div>
        <div class="base-chao-2" ></div>
      </div>
      <div
        v-if="view === 'face' && !loadingParts"
        style="position: relative;
        height: 55vh;
        justify-content: center;
        display: flex;"
      >
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 900 700"
          xml:space="preserve"
        >
          <image
            style="height:100%"
            :xlink:href="imgFace"
          />
          <path
            v-for="(item, i) in arrayFace"
            :style="`translate: -1px -2px;scale:0.89`"
            :key="i"
            :d="item.d"
            :fill="pathAttrs.fill"
            :stroke="pathAttrs.stroke"
            :vector-effect="pathAttrs.vectorEffect"
            :stroke-opacity="pathAttrs.strokeOpacity"
            :class="`${item.paint ? 'path-filled' : 'path-not-selected'}`"
            :ref="'path' + i"
            @click="clkBodyPart(item)"
          ></path>
        </svg>
      </div>
      <ion-grid 
        v-if="view === 'body' && !loadingParts"
      >
        <ion-row class="ion-justify-content-center" >
          <ion-button 
            class="q-mx-md q-mt-sm"
            style="text-transform: none; translate: 0vw -36vh;z-index:30; transform: translateX(-126px);"
            color="secondary"
            size="large"
            fill="clear"
            @click="clkDirection()"
          >
            <ion-icon slot="icon-only" :icon="chevronBack"></ion-icon>
          </ion-button>
          <ion-button 
            class="q-mx-md q-mt-sm"
            style="text-transform: none; translate: 0vw -36vh;z-index:30; transform: translateX(126px);"
            color="secondary"
            size="large"
            fill="clear"
            @click="clkDirection()"
          >
            <ion-icon slot="icon-only" :icon="chevronForward"></ion-icon>
          </ion-button>
        </ion-row>
      </ion-grid>
      <!-- <ion-grid v-if="view === 'face' && !loadingParts"> -->
        <ion-row class="ion-justify-content-center" v-if="view === 'face' && !loadingParts">
          <ion-button 
            class="q-mx-md q-mt-sm"
            style="text-transform: none; translate: 0vw 1vh;z-index:30"
            shape="round"
            color="primary"
            size="small"
            fill="outline"
            @click="clkBackToBody"
          >
            Voltar para corpo
          </ion-button>
        </ion-row>
      <!-- </ion-grid> -->
      

      <ion-modal 
        v-if="$route.path === '/newDraftComplaintSelection' || $route.path === '/newDraftComplaintsList'"
        :scroll-y="false" 
        ref="modalComplaints"
        :is-open="selectedComplaints.length > 0 && openModal" 
        @willDismiss="modalClosed"
        @ionModalWillPresent="modalOpen"
        :initial-breakpoint="safeArea > 0 ? 0.13 : 0.1" 
        :breakpoints="safeArea > 0 ? [0.13,0.99] : [0.1,0.99] " 
        :backdrop-dismiss="false" 
        :show-backdrop="false" 
        @ionBreakpointDidChange="brekpointChanged" 
        :backdrop-breakpoint="1"
      >
        
        <ion-content 
          :scroll-y="false" 
          style="box-shadow: 10px;
          position: relative;--background: var(--ion-color-tertiary)"
        >
          <div 
            class="ion-padding" 
            style="position: relative;
            margin-top: 10px;margin-bottom: 15px;height: 60px;"
          >
            <div style="margin-right: auto;margin-left: 10px;color: var(--ion-color-primary);">
              <div 
                ref="selecionados" 
                class="text-size-animation small-text" 
                style="position:absolute;
                margin-top: 0px;"
              >Sua seleção:
              </div>
              <transition name="fade">
                <ion-text 
                  v-if="dragMessage" 
                  color="secondary"
                  style="font-size: 13px;
                  position: absolute;
                  margin-top: 22px;"
                >Arraste para cima para prosseguir
                </ion-text>
              </transition>
            </div>
          </div>
          <div 
            style="margin-right: 20px;
            position: absolute;
            top: 26px;
            right: 0;
            margin-top: 5px;"
          >
            <transition name="fade-right">
              <div 
                v-if="dragMessage" 
                style="
                translate: -0px 0px;
                color: var(--ion-color-primary);
                background: var(--ion-color-background);
                border-radius: 20px;
                padding-inline: 15px;
                font-size: 24px;
                font-family: Arial;
                "

              >
                {{ selectedComplaints.length }}
              </div>
            </transition>
          </div>
          <transition name="fade">
            <ion-list v-if="!dragMessage" class="ion-margin" style="border-radius: 0.5rem;">
              <ion-item
                button
                lines="none"
                :detail="false"
                v-for="(item,i) in selectedComplaints"
                :key="i"
              >
                <ion-label @click="clkSelectedItem(item.complaintId)">
                  <h2>{{i + 1 + '.  ' + item.name }}</h2>
                  <p>{{ item.bodyCompanyName }}</p>
                </ion-label>
                <ion-button
                  size="small"
                  fill="clear"
                  mode="ios"
                  @click="clkDeleteComplaintSelection(item)"
                >
                  <ion-icon color="medium" :icon="trash" slot="icon-only"></ion-icon>
                </ion-button>
              </ion-item>
            </ion-list>
          </transition>
          <div 
            style="position:absolute;
            bottom: 50px;
            display:flex;
            justify-content: center;
            width: 100%;
            "
          >
            <ion-button
              color="primary"
              expand="block"
              class="q-ma-md"
              style="width: 100%"
              @click="clkToTakePhotoStep"
            >
              Prosseguir
            </ion-button>
          </div>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>


<script setup>
import {
  IonPage,
  IonButton,
  IonGrid,
  IonRow,
  IonContent,
  IonModal,
  IonText,
  IonBadge,
  IonList,
  IonItem,IonLabel,IonIcon
} from '@ionic/vue';
import { useFetch } from '../composables/fetch'
import HeaderComponent from '../components/HeaderComponent.vue';
import { trash, chevronBack,sync, chevronForward } from 'ionicons/icons';
import utils from '../composables/utils'
import imgFemaleBack from '/src/assets/bodies/female_back.png'
import imgFemaleFront from '/src/assets/bodies/female_front.png'
import imgMaleBack from '/src/assets/bodies/male_back.png'
import imgMaleFront from '/src/assets/bodies/male_front.png'
import imgFace from '/src/assets/bodies/face.png'
</script>
<script>

export default {
  name: "newDraftComplaintSelection",
  components: {
    HeaderComponent
  },
  data() {
    return {
      view: 'body',
      direction: 'front',
      front: true,
      pathAttrs: {
        fill: '#FF0000',
        stroke: '#ff8080',
        vectorEffect: 'non-scaling-stroke',
        fillOpacity: '0',
        strokeOpacity: '1',
        style: ''
      },
      arrayBodies: [],
      arrayFace: [],
      image: null,
      imgStyle: '',
      imgFemaleBack: '/assets/bodies/female_back.png',
      imgFemaleFront: '/assets/bodies/female_front.png',
      imgMaleBack: '/assets/bodies/male_back.png',
      imgMaleFront: '/assets/bodies/male_front.png',
      modalElement: false,
      dragMessage: false,
      modalBackdropBreakpoint: 0.1,
      openModal: true,
      safeArea: 0,
      opportunityData: null,
      gender: null,
      loadingParts: true,
      bodyConfig: 'complaints',
      selectedComplaints: [],
      arrayOfComplaints: []
    };
  },
  watch: {
    $route(to, from) {
      if (to.path === '/newDraftComplaintSelection') {
        this.modalOpen()
        this.dragMessage = true;
        this.openModal = true
        this.brekpointChanged()
        if (from.path === '/newDraftComplaintsList') {
          console.log('chegou aquqiquiqiuq')
          this.checkSelectedComplaints()
        }
        else this.getActiveOpportunitiesFromUser()
      }
    }
  },
  mounted(){
    utils.loading.hide()
    this.getActiveOpportunitiesFromUser()
    this.modalBackdropBreakpoint = 0.1
    this.brekpointChanged()
    const styles = getComputedStyle(document.documentElement);
    this.safeArea = +styles.getPropertyValue('--ion-safe-area-bottom').replace('px', '').trim()
  },
  methods: {
    async clkBodyPart (item) {
      await this.newComplaint(item)
    },
    async newComplaint(item) {
      if (item.bodyBlankId === "642eafc38c3e902328067a55 aqui tirando a face") {
        this.view = 'face'
      } else {
        const _id = item._id
        let extra = ''
        if (this.opportunityData) extra = `&opportunityId=${this.opportunityData._id}`
        this.$router.push('/newDraftComplaintsList?_id=' + _id + extra)
      }
    },
    async clkDirection(){
      this.$refs.body.classList.add('hide')
      this.direction === 'back' ? this.direction = 'front' : this.direction = 'back'
      this.front = !this.front
      utils.loading.show()
      await this.getBodyParts('body')
      utils.loading.hide()
      this.checkSelectedComplaints()
    },
    getActiveOpportunitiesFromUser () {
      const opt = { route: '/mobile/sales/getActiveOpportunitiesFromUser' }
      useFetch(opt).then(async r => {
        if (r.error) {
          utils.toast('Ocorreu um erro. Tente novamente.')
          return
        }
        if (r.data) {
          this.opportunityData = r.data
          this.setComplaintsToLocalStorage(r.data.opportunityData.complaints)
          this.gender = r.data.opportunityData.gender
        }
        else {
          this.gender = this.$route.query.gender
          this.opportunityData = null
        }
        await this.getBodyParts('body')
        await this.getBodyParts('face')
        this.checkSelectedComplaints()
      })
    },
    async getBodyParts (type) {
      await this.getComplaintsBody(type)
    },
    async getComplaintsBody (type) {
      this.imgStyle = (`height:100%;aspect-ratio: 3/5;`)
      const opt = {
        route: '/mobile/sales/getComplaintsBody',
        body: {
          type,
          gender: this.gender,
        }
      }
      if (this.view ==='body') {
        opt.body.direction = this.direction
      }
      this.loadingParts = true
      const r = await useFetch(opt)
      if (type === 'body') {
        this.arrayBodies = r.data
        this.showBody()
      }
      else if (type === 'face') this.arrayFace = r.data
      this.loadingParts = false
    },
    async getCompanyBody (type) {
      this.imgStyle = (`height:100%;aspect-ratio: 3/5;`)
      const opt = {
        route: '/mobile/sales/getCompanyBody',
        body: {
          type,
          gender: this.gender,
        }
      }
      if (this.view ==='body') {
        opt.body.direction = this.direction
      }
      this.loadingParts = true
      const r = await useFetch(opt)
      if (type === 'body') {
        this.arrayBodies = r.data
        this.showBody()
      }
      else if (type === 'face') this.arrayFace = r.data
      this.loadingParts = false
    },
    showBody () {
      if(this.gender === 'female' && this.direction === 'front') this.image = imgFemaleFront
      else if(this.gender === 'male' && this.direction === 'front') this.image = imgMaleFront
      else if(this.gender === 'female' && this.direction === 'back') this.image = imgFemaleBack
      else if(this.gender === 'male' && this.direction === 'back') this.image = imgMaleBack
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
    
    async checkSelectedComplaints() {
      this.selectedComplaints = this.getComplaintsFromLocalStorage()
      // if (this.opportunityData) {
      //   this.selectedComplaints = this.opportunityData.opportunityData.complaints
      // } else {
      //   this.selectedComplaints = this.getComplaintsFromLocalStorage()
      // }
      this.arrayBodies.forEach((bodyPart, i) => {
        this.arrayBodies[i].paint = false
        this.selectedComplaints.forEach(c => {
          if (c.bodyCompanyId === bodyPart._id) this.arrayBodies[i].paint = true
        })
      })

      this.arrayFace.forEach((bodyPart, i) => {
        this.arrayFace[i].paint = false
        this.selectedComplaints.forEach(c => {
          if (c.bodyCompanyId === bodyPart._id) this.arrayBodies[i].paint = true
        })
      })
    },
    clkDeleteComplaintSelection (item) {
      if (this.opportunityData) this.opportunityData.opportunityData.complaints.splice(item,1)
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
      this.checkSelectedComplaints()
      if (this.$route.path !== '/newDraftComplaintSelection') this.updateRoute()
    },
    updateRoute () {
      const query = {...this.$route.query}
      delete query.update
      const keys = Object.keys(query)
      let newRoute = this.$route.path + '?'
      keys.forEach(k => {
        newRoute += `${k}=${query[k]}&`
      })
      newRoute += `update=${new Date().getTime()}`
      console.log(newRoute)
      this.$router.replace(newRoute)
    },
    clkSelectedItem(id) {
      this.$refs.modalComplaints.$el.setCurrentBreakpoint(0.1)
      this.dragMessage = true;
      this.modalBackdropBreakpoint = 0.1
      this.$refs.selecionados.classList.remove('big-text')   
      this.$refs.selecionados.classList.add('small-text')   
      setTimeout(() => {
        if (this.$route.path === '/newDraftProcedureDetail') {
          this.$router.replace(`/newDraftProcedureDetail?_id=${id}&selected=true`)
        } else this.$router.push(`/newDraftProcedureDetail?_id=${id}&selected=true`)
      },500)
    },
    brekpointChanged () {
      if (this.selectedComplaints.length > 0 && this.$refs.modalComplaints) {
        this.$refs.modalComplaints.$el.getCurrentBreakpoint().then(breakpoint => {
          if (breakpoint === 0.99) {
            this.dragMessage = false;
            this.modalBackdropBreakpoint = 1
            this.$refs.selecionados.classList.remove('small-text')   
            this.$refs.selecionados.classList.add('big-text')   
          } else {
            this.dragMessage = true;
            this.modalBackdropBreakpoint = 0.1
            this.$refs.selecionados.classList.remove('big-text')   
            this.$refs.selecionados.classList.add('small-text')   
          }
        });
      }
    },
    modalClosed() {
      if (this.$route.path === '/newDraftComplaintSelection') {
        this.dragMessage = false;
        this.modalBackdropBreakpoint = 0.1
        this.$refs.selecionados.classList.remove('big-text')   
        this.$refs.selecionados.classList.add('small-text')   
      }
    },
    modalOpen () {
      this.dragMessage = false
      setTimeout(() => {
        this.dragMessage = true
      },200)
    },
    clkToTakePhotoStep () {
      // if (this.opportunityData) this.$router.push('/newOpportunityInsertPhoto?opportunityId=' + this.opportunityData.opportunityId)
      if (this.opportunityData) this.updateComplaintsFromOpportunity()
      else this.newOpportunity()
    },
    goToActiveBudget () {
      let route = ''
      if (this.opportunityData.status.status === 'inImages') {
        route = '/newOpportunityInsertPhoto?opportunityId='
      }
      else if (this.opportunityData.status.status === 'inBudget') {
        route = '/newOrEditOpportunityBudget?opportunityId='
      }
      else if (this.opportunityData.status.status === 'waitingPayment') {
        route = '/newOpportunityCheckout?opportunityId='
      }
      console.log(this.opportunityData.status.status)
      this.$router.push(route + this.opportunityData.opportunityId)
    },
    newOpportunity () {
      const opt = {
        route: '/mobile/sales/newOpportunity',
        body: {
          complaints : this.selectedComplaints,
          gender: window.localStorage.getItem('lastGender')
        }
      }
      utils.loading.show()
      useFetch(opt).then(r => {
        utils.loading.hide()
        const opportunityId = r.data.opportunityId
        this.openModal = false
        localStorage.removeItem('complaints')
        this.$router.push('/newOpportunityInsertPhoto?opportunityId=' + opportunityId)
      })
    },
    updateComplaintsFromOpportunity () {
      const opt = {
        route: '/mobile/sales/updateComplaintsFromOpportunity',
        body: {
          opportunityId: this.opportunityData._id,
          complaints: this.selectedComplaints,
        }
      }
      utils.loading.show()
      useFetch(opt).then(r => {
        utils.loading.hide()
        this.openModal = false
        localStorage.removeItem('complaints')
        this.$router.push('/newOpportunityInsertPhoto?opportunityId=' + this.opportunityData._id)
      })
    },
    clkBackToBody () {
      this.view = 'body'
      // if (this.$refs.body) this.$refs.body.classList.remove('hide')
      // this.showBody()
    }
  }
};
</script>
<style scoped>
.path-filled{
  fill: rgb(253, 135, 0);
  fill-opacity: 0.5;
  stroke: rgb(253, 135, 0);
  stroke-opacity: 0.2;
}
.path-filled:hover{
  fill: rgb(253, 135, 0);
  cursor: pointer;
  stroke: rgb(253, 135, 0);
  stroke-opacity: 0.8;
}
.path-not-selected {
  fill: transparent;
  stroke: rgb(253, 135, 0);
  stroke-opacity: 0.9;
}
.path-not-selected:hover {
  fill: rgb(253, 135, 0);
  fill-opacity: 0.2;
  cursor: pointer;
  transition: all 1s;
  stroke: rgb(253, 135, 0);
  stroke-opacity: 0.1;
}

.big-text {
  /* transform: scale(1.1) ; */
  font-size: 20px;
  translate: -10px 10px;
  -webkit-font-smoothing: antialiased;
}
.small-text {
  font-size: 20px;
  -webkit-font-smoothing: antialiased;
}
.text-size-animation {
  transition: all 0.5s ease;
  -webkit-font-smoothing: antialiased;
}
.fade-enter-active {
  transition: all 0.3s ease-out;
}

.fade-leave-active,.fade-right-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.fade-enter-from,
.fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.fade-right-leave-to {
  transform: translateX(20px);
  opacity: 0;
  
}

.fade-right-enter-active {

  animation: bounce-in 0.5s;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.40);
  }
  100% {
    transform: scale(1);
  }
}

.base-chao-1 {
  width: 25vh;
  background-color:var(--ion-color-secondary);
  height: 25vh;
  position: absolute;
  bottom: -10vh;
  border-radius: 50%;
  transform:rotateX(75deg) ;
  z-index: 10;
  opacity: 0.40;
  box-shadow: 0 30px 5px black;
}
.base-chao-2 {
  width: 100vh;
  background-color:var(--ion-color-tertiary);
  height: 100vh;
  position: absolute;
  bottom: -55vh;
  border-radius: 50%;transform:rotateX(75deg) ;
  z-index: 5;
  opacity: 0.4;
  box-shadow: 0 50px 10px -20px rgb(139, 121, 104);
}
.svg-container {
  position: relative;
  height: 60vh;
  justify-content: center;
  display: flex;
  z-index: 20;
}
.svg-body {
  transition: all 0.2s ease-in-out;
  z-index: 20;
}
.hide {
  opacity: 0;
}

</style>

