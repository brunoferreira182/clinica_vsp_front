<template>
  <ion-item fill="outline" ref="item">
    <ion-label position="floating">{{ label }}</ion-label>
    <ion-input type="number" rows="1" v-model="document" @keyup="onChange" @ionBlur="markTouched"></ion-input>
    <ion-note slot="helper" v-if="fieldHint">{{ fieldHint }}</ion-note>
    <ion-note slot="error">Documento inválido</ion-note>
  </ion-item>
</template>

<script>
import { cpf } from 'cpf-cnpj-validator'
import { IonInput, IonItem, IonLabel, IonNote } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'InputDocument',
  components: { IonInput, IonItem, IonLabel, IonNote },
  data () {
    return {
      value: '',
      id: '',
      validated: false,
      document: this.valueField
    }
  },
  props: ['valueField', 'label', 'fieldHint', 'idField'],
  methods: {
    onChange (ev) {
      // cpf.isValid(this.value)
      const value = ev.target.value;
      this.value = value
      this.$refs.item.$el.classList.remove('ion-valid');
      this.$refs.item.$el.classList.remove('ion-invalid');

      const validated = cpf.isValid(this.value)
      validated ? this.$refs.item.$el.classList.add('ion-valid') : this.$refs.item.$el.classList.add('ion-invalid');
      
      validated ? this.validated = true : this.validated = false

      if (ev.keyCode === 13) this.$emit('keyupEnter')
      else this.$emit('onChange', { value, id: this.idField, validated: this.validated })
    },
    markTouched() {
      this.$refs.item.$el.classList.add('ion-touched')
    }
  },
  mounted () {
    this.value = this.valueField
    this.id = this.idField
  },
  watch: {
    valueField: function () {
      this.value = this.valueField
    }
  }
})
</script>