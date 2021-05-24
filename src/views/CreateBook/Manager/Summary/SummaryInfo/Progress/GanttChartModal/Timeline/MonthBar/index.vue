<template>
  <BlockBar :items="months" custom-class="months">
    <template v-for="slot in slots" #[`slot${slot.id}`]>
      <span :key="slot.id" class="text-500">
        {{ slot.name }}
      </span>
    </template>
  </BlockBar>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
