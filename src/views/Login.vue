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
        <div class="text-center">
          <LoginCarousel
            :addLogin="false"
            @done="registerLogin"
          />
          <!-- <LoginWithGoogle @loginDone="loginWithGoogleDone"/> -->
          
        </div>

        
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonButton, IonContent, IonImg } from '@ionic/vue';
import LoginCarousel from "../components/LoginCarousel.vue";
import utils from '../composables/utils'
import { APP_NAME, COMPANY_ID } from '../composables/variables'
import { Keyboard } from '@capacitor/keyboard';
import pushService from '../composables/notifications'
import VivianLogo from '/src/assets/logo-viviam-simoes.svg'
// import LoginWithGoogle from '../components/LoginWithGoogle.vue'
export default {
  components: {
    IonPage,
    LoginCarousel,
    IonContent,
    IonImg,
    // LoginWithGoogle
  },
  data() {
    return {
      VivianLogo,
      loginStep: "email",
      key: "",
      appVersion: "",
      appName: '',
      loginImageType: 'default',
      CID: COMPANY_ID,
      attachmentsAddress: '',
      APP_NAME
    };
  },
  name: "LoginPage",
  watch: {
    $route(to) {
      if (to.path === '/login' || to.path === '/newUser') {
        window.localStorage.clear()
      }
    }
  },
  mounted () {
    this.$emit("unregisterLogin");
    // this.loginImageType = utils.returnLoginImageType()
    this.attachmentsAddress = utils.attachmentsAddress()
    window.localStorage.clear()
  },


  methods: {
    loginWithGoogleDone (data) {
      console.log('data aqui do login', data)
    },
    
    registerLogin(data, key) {
      utils.registerLogin(data)
      utils.loading.clear()
      pushService.initPush()
      this.$router.push("/tabs/home?updateTabs=true");
    },
  },
};
</script>

<style scoped>
.q-carousel__slide {
  padding-right: 0%;
  padding-left: 0%;
}
.login-logo {
  /* width: 12em; */
  height: 14em;
}
</style>