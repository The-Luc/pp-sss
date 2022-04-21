<template>
  <button-property :title="title" :disabled="disabled" @click="onClick">
    <template #icon>
      <v-icon class="icon-right" :class="{ vertical: !isHorizontal }">
        switch_left
      </v-icon>
    </template>
  </button-property>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
