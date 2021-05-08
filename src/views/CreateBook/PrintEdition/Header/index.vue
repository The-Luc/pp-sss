<template lang="">
  <div class="row print-editor-header">
    <v-btn class="btn-save" outlined color="#42738D">
      SAVE & EXIT
    </v-btn>
    <span>{{ nameEditor }}</span>
  </div>
</template>

<script>
import './index.scss';
export default {
  props: {
    nameEditor: {
      type: String,
      required: true
    },
  }
};
</script>

<style lang=""></style>
