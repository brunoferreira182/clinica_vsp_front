<template>
  <ion-item fill="outline" ref="item" mode="md">
    <ion-label position="floating">{{ label }}</ion-label>
    <ion-input
      rows="1"
      @ionInput="format($event)"
      @ionBlur="format($event)"
      :value="value"
      inputmode="numeric"
      maxlength="19"
      ref="inputCC"
      
    ></ion-input>
    <ion-note v-if="hint" slot="helper">{{ hint }}</ion-note>
  </ion-item>
</template>

<script>
  import { IonInput, IonItem, IonLabel, IonNote } from '@ionic/vue';
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'InputCreditCard',
    components: { IonInput, IonItem, IonLabel, IonNote },
    props: ['label', 'idField', 'hint', 'modelValue'],
    data () {
      return {
        value: '',
        validated: true,
      }
    },
    methods: {
      format (ev) {
        const formattedValue = this.formatValue(ev.target.value)
        this.value = formattedValue
        this.$refs.inputCC.$el.value = formattedValue
        this.validate(formattedValue)
        this.$emit('update:modelValue', formattedValue.replace(/\s/g, ''))
      },
      formatValue (value) {
        const numbers = value.replace(/\D/g, "")
        const len = numbers.length
        let ret
        if (len < 5) ret = numbers
        else if (len < 9) {
          ret = `${numbers.slice(0, 4)} ${numbers.slice(4, len)}`
        } else if (len < 13) {
          ret = `${numbers.slice(0, 4)} ${numbers.slice(4, 8)} ${numbers.slice(8, len)}`
        } else {
          ret = `${numbers.slice(0, 4)} ${numbers.slice(4, 8)} ${numbers.slice(8, 12)} ${numbers.slice(12, len)}`
        }
        return ret
      },
      validate (value) {
        this.$refs.inputCC.$el.classList.remove('ion-valid');
        this.$refs.inputCC.$el.classList.remove('ion-invalid');
        const ccValidated = window.Iugu.utils.validateCreditCardNumber(value)
        ccValidated ? this.$refs.inputCC.$el.classList.add('ion-valid') : this.$refs.inputCC.$el.classList.add('ion-invalid');
      },

      markTouched() {
        this.$refs.item.$el.classList.add('ion-touched')
      }
    },
  });
</script>