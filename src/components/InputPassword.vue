<template>
  <ion-item fill="outline">
    <ion-label position="floating">{{ label }}</ion-label>
    <ion-button  @click="showHidePassword" slot="end" fill="clear" color="dark">
      <ion-icon v-if="showPassword" slot="icon-only" :icon="eyeOutline"/>
      <ion-icon v-else slot="icon-only" :icon="eyeOffOutline"/>
    </ion-button>
    <ion-input rows="1" :type="passwordType" @keyup="onChange">
      
    </ion-input>
  </ion-item>
</template>


<script setup>
import {
  IonInput,
  IonItem,
  IonLabel,
  IonIcon,
  IonButton,
  // IonNote
} from '@ionic/vue';
import { defineComponent } from 'vue';
import { eyeOutline,eyeOffOutline } from 'ionicons/icons'
</script>

<script>

  export default defineComponent({
  components: { 
    IonInput,
    IonItem,
    IonLabel,
    IonIcon,
    IonButton,
    // IonNote
  },
  name: 'medInputPassword',
  data () {
    return {
      value: '',
      id: '',
      isPwd: true,
      passwordType: 'password',
      showPassword: false
    }
  },
  props: ['valueField', 'label', 'fieldHint', 'idField'],
  methods: {
    onChange (ev) {
      const value = ev.target.value;
      this.value = value
      if (ev.keyCode === 13) this.$emit('keyupEnter')
      else this.$emit('onChange', { value, id: this.id })
    },
    showHidePassword () {
      this.showPassword = !this.showPassword
      if (this.showPassword) {
        this.passwordType = 'text'
      } else {
        this.passwordType = 'password'
      }
    }
  },
  mounted () {
    this.value = this.valueField
    this.id = this.idField
  }
})
</script>
