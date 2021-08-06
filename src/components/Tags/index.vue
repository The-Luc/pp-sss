<template>
  <div class="key-word">
    <v-chip
      :class="{ inactive: !keyword.active }"
      :close="keyword.active"
      label
      close-icon="mdi-close"
      @click:close="onclick(keyword)"
      @click.native="onclick(keyword, true)"
    >
      {{ keyword.value }}
    </v-chip>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
