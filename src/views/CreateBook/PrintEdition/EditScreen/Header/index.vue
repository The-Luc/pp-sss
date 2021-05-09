<template lang="">
  <div class="row print-editor-header">
    <PpButton
      type="btn"
      class="btn-save"
    >
      SAVE & EXIT
    </PpButton>
    <span>{{ nameEditor }}</span>
  </div>
</template>

<script>
import PpButton from '@/components/Button';
export default {
  props: {
    nameEditor: {
      type: String,
      required: true
    },
  },
  components: {
    PpButton,
  },
};
</script>

<style lang="scss" src="./index.scss"></style>
