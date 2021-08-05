<template>
  <div class="key-word">
    <v-chip
      v-if="active"
      close
      label
      close-icon="mdi-close"
      @click:close="onclick(keyWord)"
    >
      {{ keyWord }}
    </v-chip>
    <v-chip v-else class="inactive" @click.native="onclick(keyWord)">
      {{ keyWord }}
    </v-chip>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
