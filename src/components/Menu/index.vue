<template>
  <v-menu
    content-class="pp-menu"
    :close-on-content-click="false"
    :nudge-width="nudgeWidth"
    :nudge-left="nudgeWidth / 2"
  >
    <template #activator="{ on }">
      <img :src="src" v-on="on" />
    </template>
    <v-list>
      <v-list-item v-for="(item, i) in items" :key="i">
        <Item :title="item.title" :value="item.value" />
      </v-list-item>
      <slot />
    </v-list>
  </v-menu>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
