<template>
  <div>
    <span class="icon button" @click="navigate(-1)"><icon icon="chevron-left"></icon></span>
    {{ date.toFormat('MMM') }}&nbsp;{{ date.toFormat('yy') }}
    <span class="icon button" @click="navigate(1)"><icon icon="chevron-right"></icon></span>
  </div>
</template>

<script>
import {DateTime} from "luxon";

export default {
  data() {
    return {
      date: DateTime.now().setLocale('de'),
    }
  },
  methods: {
    navigate(n) {
      this.date = this.date.plus({month: n})
      this.$emit('input', this.date)
    }
  }
}
</script>