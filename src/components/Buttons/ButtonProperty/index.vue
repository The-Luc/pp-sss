<template>
  <div class="button-property">
    <div class="item-container">
      <v-btn class="item-btn" :disabled="disabled" @click="onClick">
        <v-icon v-if="!$slots.icon">{{ iconName }}</v-icon>
        <slot name="icon" />
      </v-btn>
      <div class="item-title">{{ title }}</div>
    </div>
  </div>
</template>
<script src="./script.js" />

<style lang="scss" src="./style.scss" />
