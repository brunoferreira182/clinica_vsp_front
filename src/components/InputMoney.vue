<template>
  <ion-item fill="outline" ref="item" mode="md">
    <ion-label position="floating">{{ label }}</ion-label>
    <ion-input
      rows="1"
      @ionBlur="format($event)"
      @ionInput="format($event)"
      @ionFocus="cursorEnd"
      ref="inputMoney"
      inputmode="numeric"
      :value="value"
      ></ion-input>
  </ion-item>
</template>

<script>
  import { IonInput, IonItem, IonLabel } from '@ionic/vue';
  import { defineComponent } from 'vue';

  export default defineComponent({
    components: { IonInput, IonItem, IonLabel },
    props: ['label', 'idField', 'modelValue'],
    data () {
      return {
        value: '',
        validated: true,
      }
    },
    mounted () {
      console.log(this.modelValue, 'modelValue')
    },
    watch: {
      modelValue: function (nV, oV) {
        console.log(nV, oV, 'watch model value')
        if (nV !== '') this.value = 'R$ ' + nV
      }
    },
    methods: {
      cursorEnd () {
        console.log('focus')
        this.$refs.inputMoney.$el.setFocus()
      },
      format (ev) {
        console.log('dispatou formar')
        const formattedValue = this.formatValue(ev.target.value)
        this.value = formattedValue
        this.$refs.inputMoney.$el.value = formattedValue
        this.$emit('update:modelValue', formattedValue.replace('R$ ', '').replace('.', ''))
      },
      formatValue (value) {
        const numbers = +value.replace(/\D/g, "")
        const numbersStirng = numbers.toString()
        const len = numbersStirng.length
        if (len === 0 || numbers === 0) return ''
        else if (len === 1) return `R$ 0,0${numbersStirng}`
        else if (len === 2) return `R$ 0,${numbersStirng}`
        let integer = numbersStirng.slice(0, len - 2)
        const decimal = numbersStirng.slice(len - 2, len)
        const lenInteger = integer.toString().length
        if (lenInteger > 3) {
          const integerPos = integer.slice(lenInteger - 3, lenInteger)
          const integerPre = integer.slice(0, lenInteger - 3)
          integer = `${integerPre}.${integerPos}`
        }
        return `R$ ${integer},${decimal}`
      },
    },
  });
</script>