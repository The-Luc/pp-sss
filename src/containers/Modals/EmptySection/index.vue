<template>
  <Modal :is-close-out-side="false" title="Empty Section(s)" width="560">
    <div class="text-500 title-notification">
      The following sections are empty:
    </div>
    <div class="box">
      <div v-for="section in sections" :key="section.id">
        {{ section.name }}
      </div>
    </div>
    <div class="text-300 title-notification">
      Empty sections are not included in print and digital editions. Please
      either delete the empty section(s) OR add a sheet to it before proceeding.
    </div>
    <PpButton class="pp-button" is-active @click="onChangeView">OK</PpButton>
  </Modal>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
