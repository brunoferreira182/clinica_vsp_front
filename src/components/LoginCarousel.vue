<template>
  <div class="ion-padding">
    <div v-if="loginStep === 'email'">
      <InputEmail
        label="Email"
        idField = "email"
        @onChange="onChangeInput"
        @keyupEnter="clkLogin"
      ></InputEmail>
    </div>
    <div v-if="loginStep === 'password'">
      <InputPassword
        label="Senha"
        idField="password"
        @onChange="onChangePwd"
        @keyupEnter="clkLogin"
      ></InputPassword>
    </div>
    <div>
      <ion-button expand="block" class="q-mt-md" @click="clkLogin">{{ labelBtnEnter }}</ion-button>
      <ion-button
        expand="block"
        fill="outline"
        @click="loginStep = 'email'"
        class="q-mt-md"
        v-if="loginStep === 'password'"
      >Voltar</ion-button>
      <ion-button
        expand="block"
        @click="clkForgotPassword"
        fill="clear"
        style="text-transform:none"
        color="primary"
        v-if="loginStep === 'password'"
      >Esqueci minha senha</ion-button>
    </div>

    <div class="q-mt-xl ion-text-center" v-if="loginStep === 'email'">
      <div class="q-mb-md q-mt-md">É novo aqui?</div>
      <ion-button
        expand="block"
        @click="gotoSignup"
        color="primary"
        class="q-mb-md"
      >
        Crie uma conta
      </ion-button>
      <ion-button
        fill="outline"
        expand="block"
        @click="clkGuestUser"
        color="primary"
      >
        Ou entre como convidado
      </ion-button>
    </div>
  </div>
</template>

<script>
import {
  IonButton,
} from '@ionic/vue';
import { defineComponent } from 'vue';
import InputEmail from './InputEmail.vue'
import InputPassword from './InputPassword.vue'
import CryptoJS from 'crypto-js'
import utils from '../composables/utils'
import { useFetch } from '../composables/fetch'

export default defineComponent({
  props: {
    addLogin: Boolean,
    originalUserId: Number
  },
  emits: ['done'],
  components: {
    IonButton,
    InputEmail,
    InputPassword

  },
  data() {
    return {
      slideOpts: {
        initialSlide: 1
      },
      email: '',
      password: '',
      emailValidated: '',
      labelBtnEnter: 'Próximo',
      btnLoginLoading: false,
      loginStep: 'email',
      key: '',
      swiper: null
    }
  },
  methods: {
    gotoSignup() {
      this.$router.push("/register");
    },
    clkGuestUser () {
      this.$router.push('/loading?postAction=createGuestUser')
      // this.$router.push('/tabs/home?postAction=createGuestUser')
    },
    clkForgotPassword () {
      this.$router.push('/forgotPassword')
    },
    clkBack () {
      this.email = ''
      this.loginStep = 'email'
      this.labelBtnEnter = 'Próximo'
    },
    onChangeInput (d) {
      this[d.id] = d.value
      if (d.id === 'email') {
        this.emailValidated = d.validated
      }
    },
    onChangePwd (d) {
      this.password = d.value
    },
    clkLogin () {
      if (this.loginStep === 'email') {
        if (!this.emailValidated) {
          utils.toast('Digite um email valido')
          return
        } else if (this.email === '') {
          utils.toast('Preencha o email')
          return
        }

        this.checkEmail()
      } else if (this.loginStep === 'password') {
        if (this.password === '') {
          utils.toast('Preencha a senha')
          return
        }
        this.makeLogin()
      }
    },
    async checkEmail () {
      this.btnLoginLoading = true
      const opt = {
        serverName: 'authentication',
        route: '/getKey',
        body: { login: this.email }
      }
      utils.loading.show()
      useFetch(opt).then(r => {
        utils.loading.hide()
        this.btnLoginLoading = false
        if (r.error) return        
        if (r.data.info && r.data.info === 'smsScreen') {
          this.$router.push('/newUser?step=smsCode&key=' + r.data.key)
          return
        } else if (r.data.info && r.data.info === 'makeNewPassword') {
          this.$router.push('/newUser?step=smsCode&key=' + r.data.key)
          return
        }
        this.key = r.data.key
        this.loginStep = 'password',
        this.labelBtnEnter = 'Entrar'
        
      })
    },
    makeLogin () {
      utils.loading.show()
      const opt = {
        serverName: 'authentication',
        route: '/makeLogin',
        body: {
          user: this.email,
          token: CryptoJS.AES.encrypt(
            this.password,
            this.key
          ).toString(),
          addLogin: {
            addLogin: this.addLogin,
            originalUserId: this.originalUserId
          }
        }
      };
      useFetch(opt).then(r => {
        utils.loading.hide()
        if (r.error) {
          this.btnEnterLoading = false;
          return;
        }
        this.loginStep = 'email'
        this.email = ''
        this.password = ''
        this.emailValidated = ''
        this.labelBtnEnter = 'Próximo'
        this.$emit('done', r.data, this.key)
      });
    },
  }
});
</script>
