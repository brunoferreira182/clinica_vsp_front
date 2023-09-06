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
        <div class="ion-text-center">
          <h3>Você é bem vindo aqui!</h3>

          Para ter acesso a todas as funcionalidades, crie uma conta.
        </div>

        <div class="ion-padding ion-text-center">
          <ion-button
            expand="block"
            @click="gotoSignup"
            color="primary"
            class="q-mb-md"
          >
            Crie uma conta
          </ion-button>
          <ion-button
            expand="block"
            @click="$router.replace('/login')"
            color="primary"
            class="q-mb-md"
          >
            Já tenho uma conta
          </ion-button>
          <ion-button
            fill="outline"
            expand="block"
            @click="$router.back()"
            color="primary"
          >
            Voltar
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonButton, IonContent, IonImg } from '@ionic/vue';
import { APP_NAME, COMPANY_ID } from '../composables/variables'
import VivianLogo from '/src/assets/logo-viviam-simoes.svg'
export default {
  components: {
    IonPage, IonButton,
    IonContent,
    IonImg,
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
  name: "GuestInfo",
  methods: {
    gotoSignup() {
      this.$router.push("/register");
    },
  },
};
</script>

<style scoped>
.login-logo {
  /* width: 12em; */
  height: 14em;
}
</style>