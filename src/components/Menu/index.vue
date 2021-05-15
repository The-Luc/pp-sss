<template>
  <v-menu
    content-class="pp-menu"
    :nudge-width="nudgeWidth"
    :value="isOpen"
    :close-on-click="false"
    :close-on-content-click="isCloseMenu"
    :position-x="menuX"
    :position-y="menuY"
  >
    <v-list v-click-outside="onClickOutSideMenu">
      <v-list-item v-for="(item, i) in items" :key="i">
        <Item
          :title="item.title"
          :value="item.value"
          :is-last-item="i === items.length - 1"
          @onItemClick="event => onItemClick(event, item)"
        />
      </v-list-item>
      <slot />
    </v-list>
  </v-menu>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
