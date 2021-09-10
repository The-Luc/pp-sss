<template>
  <group-item name="Duration" :disabled="disabled">
    <pp-input
      v-if="!disabled"
      :key="componentKey"
      decimal
      type="text"
      suffix=" s"
      :value="duration"
      :disabled="disabled"
      @change="onDurationChange"
    >
    </pp-input>

    <input v-else type="text" class="pp-number disabled" />
  </group-item>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
