<template>
  <ion-item fill="outline" ref="item">
    <ion-label position="floating">{{ label }}</ion-label>
    <ion-input rows="1" type="email" @keyup="validate"></ion-input>
    <ion-note slot="error">Email inválido</ion-note>
  </ion-item>
</template>

<script>
  import { IonInput, IonItem, IonLabel, IonNote } from '@ionic/vue';
  import { defineComponent } from 'vue';

  export default defineComponent({
    components: { IonInput, IonItem, IonLabel, IonNote },
    props: ['label', 'idField'],
    data () {
      return {
        value: '',
        validated: true,
      }
    },
    methods: {
      validateEmail(email) {
        return email.match(/^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/);
      },
      changeEvent (a, b) {
        console.log('dentro do change event', a, b)
      },
      validate(ev) {
        const value = ev.target.value;
        this.value = value
        this.$refs.item.$el.classList.remove('ion-valid');
        this.$refs.item.$el.classList.remove('ion-invalid');

        const emailValidated = this.validateEmail(value)
        emailValidated ? this.$refs.item.$el.classList.add('ion-valid') : this.$refs.item.$el.classList.add('ion-invalid');
        
        emailValidated ? this.validated = true : this.validated = false

        if (ev.keyCode === 13) this.$emit('keyupEnter', { value, id: this.idField, validated: this.validated })
        else this.$emit('onChange', { value, id: this.idField, validated: this.validated })
      },

      // markTouched() {
      //   this.$refs.item.$el.classList.add('ion-touched')
      // }
    },
  });
</script>