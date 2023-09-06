<template>
  <ion-page>
    <ion-content style="padding-top: calc(var(--ion-safe-area-top))">
      <div class="ion-padding" >
        <div class="ion-text-center q-my-lg">
          <ion-img
            :src="VivianLogo"
            class="login-logo ion-padding"
          />
        </div>
      </div>
      <div class="ion-text-center">
        <ion-spinner color="primary" v-if="showSpinner"></ion-spinner>
      </div>
      
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonContent, IonImg, IonSpinner } from '@ionic/vue';
import utils from '../composables/utils'
import { APP_NAME, COMPANY_ID } from '../composables/variables'
import VivianLogo from '/src/assets/logo-viviam-simoes.svg'
export default {
  components: {
    IonPage,
    IonContent,
    IonImg,
    IonSpinner
  },
  data() {
    return {
      VivianLogo,
      showSpinner: true
    };
  },
  name: "Loading",
  watch: {
    $route(to) {
      console.log('o caia')
      if (to.path === '/loading') {
        console.log('o caia 2')
        if (this.$route.query.postAction === 'createGuestUser') {
          console.log('o caia 3')
          this.createGuestUser()
        }
      }
    }
  },
  mounted () {
    console.log('montu???')
   if (this.$route.query.postAction === 'createGuestUser') {
      console.log('o caia 3')
      this.createGuestUser()
    }
  },


  methods: {
    async createGuestUser() {
      await utils.createGuestUser()
      this.$router.push('/tabs/home?updateTabs=true')
    }
  },
};
</script>

<style scoped>
.login-logo {
  /* width: 12em; */
  height: 14em;
}
</style>