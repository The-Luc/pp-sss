<template>
  <v-btn-toggle
    class="pp-button-group"
    :active-class="ppActiveClass"
    :value="item"
    :multiple="multiple"
    :mandatory="mandatory"
    @change="onChange"
  >
    <slot />
  </v-btn-toggle>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
