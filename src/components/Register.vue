<template>
  <ion-page>
    <ion-content class="ion-padding " style="padding-top: calc(var(--ion-safe-area-top))">
      
      <div v-if="step === 'email'">
        <ion-text class="text-center">
          <h4>Vamos iniciar seu cadastro</h4>
        </ion-text>

        <div>
          <InputEmail
            label="Digite seu email"
            idField = "email"
            @onChange="onChangeInput"
            class="q-mb-md"
          ></InputEmail>

          <InputTelephone
            label="Digite seu telefone"
            idField = "telefone"
            @onChange="onChangeInput"
            class="q-mb-sm"
            hint="Com DDD e número."
          ></InputTelephone>

          <ion-item fill="outline" ref="item" class="q-mb-sm">
            <ion-label position="floating">Escolha um nome para seu perfil</ion-label>
            <ion-input rows="1" v-model="userData.user"></ion-input>
            <ion-note slot="helper">
              Seu usuário será: 
              <ion-chip>@{{ userData.user.replace(/\s/g, '_').replace(/[.;,~^´`!@#$%¨&']/g, '').toLowerCase() }}</ion-chip>
            </ion-note>
          </ion-item>

          <ion-item fill="outline" ref="item" class="q-mb-md" v-if="userData.birthdate" >
            <ion-label color="medium" position="floating">Data de nascimento (opcional)</ion-label>
            <ion-input rows="1" v-model="userData.birthdate" ></ion-input>
            <ion-button color="medium" fill="clear" slot="end" @click="userData.birthdate = null">
              <ion-icon :icon="closeOutline" slot="icon-only"></ion-icon>
            </ion-button>
          </ion-item>

          <ion-button
            expand="block"
            @click="openPicker"
            class="q-mb-lg"
            dense
          >
            {{ !userData.birthdate ? 'Data de nascimento (opcional)' : 'Trocar data de nascimento' }}
          </ion-button>

          <ion-button
            expand="block"
            @click="clkChkInitialData"
          >
            Continuar
          </ion-button>
        </div>

      </div>

      <div v-if="step === 'password'">
        <ion-text class="text-center">
          <h4>Agora cadastre sua senha</h4>
        </ion-text>
        <div class="q-mb-md">
          <InputPassword
            class="q-mb-md"
            label="Digite uma senha"
            idField = "password"
            @onChange="onChangeInput"
          />
          <InputPassword
            label="Confirme a senha digitada"
            idField = "confirmPassword"
            @onChange="onChangeInput"
          />
        </div>

        <ion-button
            expand="block"
            @click="chkPasswords"
          >
            Continuar
          </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonButton,
  IonContent,
  IonText,
  pickerController,
  IonItem, IonLabel, IonInput, IonNote,
  IonChip,
  IonIcon
} from '@ionic/vue';
import InputEmail from '../components/InputEmail'
import InputPassword from '../components/InputPassword'
import InputTelephone from '../components/InputTelephone.vue'
import { useFetch } from '../composables/fetch'
import utils from '../composables/utils'
import CryptoJS from 'crypto-js'
import { closeOutline } from 'ionicons/icons';
</script>

<script>

export default {
  data() {
    return {
      step: "email",
      monthsDefault: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      years: [],
      days: [],
      months: [],
      userData: {
        email: '',
        phone: '',
        birthdate: null,
        user: ''
      },
      passwordData: {
        password: '',
        confirmPassword: ''
      },
      verified: {
        email: false,
        phone: false
      },
      key: '',
      smsCode: '',
      emailValidated: false
    };
  },
  name: "NewUserView",
  beforeMount() {
    this.attachmentsAddress = utils.attachmentsAddress()
    for (let i = 1; i < 32; i++) {
      this.days.push({ text: i < 10 ? '0' + i : i, value: i < 10 ? '0' + i : i })
    }
    const today = new Date()
    const year = today.getFullYear()
    for (let i = 18; i < 100; i++) {
      this.years.push({ text: year - i, value: year - i })
    }
    this.monthsDefault.forEach((m, i) => {
      this.months.push({ text: m, value: (i + 1) < 10 ? '0' + (i + 1) : (i + 1) })
    })
  },
  mounted () {
    window.localStorage.clear()
  },
  methods: {
    chkPasswords () {
      if (this.passwordData.password !== this.passwordData.confirmPassword) {
        utils.toast('As senhas não conferem. Tente novamente')
        return
      }
      this.createPassword()
    },
    createPassword () {
      const tk = CryptoJS.AES.encrypt(JSON.stringify(this.passwordData), this.key).toString()
      const opt = {
        serverName: 'authentication',
        route: '/auth/createPassword',
        body: {
          tk
        }
      }
      utils.loading.show()
      useFetch(opt).then(r => {
        utils.loading.hide()
        if (r.error) {
          return
        }
        this.resetForms()
        utils.toast('Seu usuário foi criado com sucesso. Faça o login para prosseguir.')
        this.$router.push('/login')
      })
    },
    clkChkInitialData () {
      // faz checagens
      this.createUser()
    },
    createUser () {
      this.userData.user = this.userData.user.replace(/\s/g, '_').replace(/[.;,~^´`!@#$%¨&']/g, '').toLowerCase()
      const opt = {
        serverName: 'authentication',
        route: '/auth/createUser',
        body: {
          userData: this.userData
        }
      }
      utils.loading.show()
      useFetch(opt).then(r => {
        utils.loading.hide()
        if (r.error) {
          return
          // if (r.errorType === 'generateNewSms') {
          //   utils.toast('oigale')
          // } else {
          //   utils.toast(r.message)
          //   return
          // }
          
        }
        this.key = r.data.key
        window.localStorage.setItem('$k', r.data.key)
        if (!r.data.askSms || r.data.askSms === 'false') {
          const d = CryptoJS.AES.encrypt(JSON.stringify(r.data), r.data.key).toString()
          window.localStorage.setItem('u' + r.data.userId, d)
          window.localStorage.setItem('au', r.data.userId)
          this.resetForms()
          this.step = 'password'
        } if (r.data.askSms) {
          this.step = 'smsCode'
          // this.labelBtnEnter = 'Verificar'
        }
        
        this.resetForms()
      })
    },
    onChangeInput (d) {
      
      if (d.id === 'email' || d.id === 'phone') {
        this.userData[d.id] = d.value
        this.emailValidated = d.validated
      } else this.passwordData[d.id] = d.value
    },
    async openPicker() {
      console.log("abriu")
      const picker = await pickerController.create({
        columns: [
          {
            name: 'day',
            options: this.days
          },
          {
            name: 'month',
            options: this.months
          },
          {
            name: 'year',
            options: this.years
          },
        ],
        buttons: [
          {
            text: 'Voltar',
            role: 'cancel',
          },
          {
            text: 'Confirma',
            handler: (value) => {
              this.userData.birthdate = `${value.day.value}/${value.month.value}/${value.year.value}`
            },
          },
        ],
      });
      await picker.present();
    },
    resetForms () {
      this.userData.email = ''
      this.userData.phone = ''
      this.passwordData.password = ''
      this.passwordData.confirmPassword = ''
      this.smsCode = ''
    },
  },
};
</script>
