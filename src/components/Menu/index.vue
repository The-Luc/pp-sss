<template>
  <v-menu
    v-click-outside="{
      handler: onClickOutsideStandard
    }"
    content-class="pp-menu"
    :nudge-width="nudgeWidth"
    :value="isOpen"
    :close-on-content-click="false"
    :nudge-left="nudgeWidth / 2"
  >
    <slot />
    <template #activator="{  }">
      <img :src="src" @click="onClick" />
    </template>
    <v-list>
      <v-list-item v-for="(item, i) in items" :key="i">
        <Item
          :title="item.title"
          :value="item.value"
          @onItemClick="event => onItemClick(event, item)"
        />
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
