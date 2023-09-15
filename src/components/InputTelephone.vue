<template>
  <ion-item fill="outline" ref="item">
    <ion-label position="floating">{{ label }}</ion-label>
    <ion-input
      rows="1"
      @ionInput="format($event)"
      @ionBlur="format($event)"
      @keydown.delete="handleBackspace"
      :value="value"
      inputmode="numeric"
      maxlength="15"
      ref="inputPhone"
    ></ion-input>
    <ion-note v-if="hint" slot="helper">{{ hint }}</ion-note>
  </ion-item>
</template>

<script>
import { IonInput, IonItem, IonLabel, IonNote } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'InputTelephone',
  components: { IonInput, IonItem, IonLabel, IonNote },
  props: ['label', 'idField', 'hint'],
  data() {
    return {
      value: '',
      validated: true,
    };
  },
  methods: {
    format(ev) {
      const formattedValue = this.formatValue(ev.target.value);
      this.value = formattedValue;
      this.$refs.inputPhone.$el.value = formattedValue;
      this.$emit('update:modelValue', formattedValue);
    },
    formatValue(value) {
      const numbers = value.replace(/\D/g, '');
      const len = numbers.length;
      if (value.length > 15) return value.slice(0, 15);
      if (len < 3) return `(${numbers})`;
      const ddd = numbers.slice(0, 2);
      let numPre = '';
      let numPos = '';
      if (len <= 7) {
        numPre = ' ' + numbers.slice(2, len);
      } else if (len > 7) {
        numPre = ' ' + numbers.slice(2, 7);
        numPos = ' ' + numbers.slice(7, len);
      }
      return `(${ddd})${numPre}${numPos}`;
    },
    handleBackspace(ev) {
      if (ev.keyCode === 8) {
        // Backspace key code
        const currentValue = this.value;
        if (currentValue.length > 0) {
          const newValue = currentValue.slice(0, -3); // Remove o último caractere
          this.value = newValue;
          this.$refs.inputPhone.$el.value = newValue;
          this.$emit('update:modelValue', newValue);
        }
      }
    },
    valid(ev) {
      const value = ev.target.value;
      this.$refs.item.$el.classList.remove('ion-valid');
      this.$refs.item.$el.classList.remove('ion-invalid');

      const validated = this.validate(value);
      validated
        ? this.$refs.item.$el.classList.add('ion-valid')
        : this.$refs.item.$el.classList.add('ion-invalid');

      validated ? (this.validated = true) : (this.validated = false);

      if (ev.keyCode === 13) this.$emit('keyupEnter');
      else
        this.$emit('onChange', { value: this.value, id: this.idField, validated: this.validated });
    },

    markTouched() {
      this.$refs.item.$el.classList.add('ion-touched');
    },
  },
});
</script>
