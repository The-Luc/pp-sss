<template>
  <div class="key-word">
    <v-chip
      v-if="active"
      close
      label
      close-icon="mdi-close"
      @click:close="active = false"
    >
      {{ keyWord }}
    </v-chip>
    <div v-else class="btn-key-word" @click="active = true">{{ keyWord }}</div>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
