<template>
  <div v-if="value">
    <span class="icon button" @click="navigate(-1)"><icon icon="chevron-left"></icon></span>
    {{ value.toFormat('MMMM', {locale: 'DE'}) }}&nbsp;{{ value.toFormat('yy') }}
    <span class="icon button" @click="navigate(1)"><icon icon="chevron-right"></icon></span>
  </div>
</template>

<script>
import {DateTime} from "luxon";

export default {
  props: {
    value: {
      type: Object,
      default: () => DateTime.now()
    }
  },
  methods: {
    navigate(n) {
      let newDate = this.value.plus({month: n})
      this.$emit('input', newDate)
    }
  }
}
</script>
