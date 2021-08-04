<template>
  <div></div>
</template>
<script>
import {TYPE} from "vue-toastification";

const INTERNAL_SERVER_ERROR = 'Ein unerwarteter Fehler im Server ist aufgetreten. Bitte kontaktieren sie den Support.'
const GENERAL_CLIENT_ERROR = 'Ein unerwarteter Fehler ist aufgetreten. Bitte kontaktieren sie den Support.'

export default {
  methods: {
    handleError(err) {
      let msg = 'error';
      let type = 'danger';
      if (err.response) {
        // client received an error response (5xx, 4xx)
        if (err.response.status === 404) {
          msg = 'Die angeforderten Daten konnten nicht gefunden werden.'
          type = 'warning';
        } else if (err.response.status < 500) {
          msg = err.response.data.message;
          type = err.response.data.type || 'warning';
        } else {
          msg = INTERNAL_SERVER_ERROR
        }
      } else if (err.request) {
        // client never received a response, or request never left
        msg = 'Es gibt Probleme mit der Verbindung zum System. Bitte versuchen Sie es später erneut';
      } else {
        // anything else
        msg = GENERAL_CLIENT_ERROR;
      }
      this.showMessage({
        message: msg,
        type: type
      });
    },
    showInfo(message) {
      this.showMessage({
        message: message,
        type: TYPE.INFO
      })
    },
    showSuccess(message){
      this.showMessage({
        message,
        type: TYPE.SUCCESS
      })
    },
    showMessage(message) {
      if (message != null) {
        let type = message.type ?? TYPE.INFO;
        if (message.type === 'danger')
          type = TYPE.ERROR
        if (message.type === 'warning')
          type = TYPE.WARNING
        this.$toast(message.message, {
          type: type
        })
      }
    }
  }
}
</script>