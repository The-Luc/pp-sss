<template>
  <v-menu
    :value="isOpen"
    content-class="pp-number-palettes"
    :position-x="posX"
    :position-y="posY"
    :nudge-width="68"
    absolute
    :close-on-click="false"
  >
    <v-list v-click-outside="onClickOutside" dense>
      <v-list-item v-for="(item, index) in items" :key="index">
        <v-list-item-content @click="onSelected(item)">
          <v-list-item-title
            class="text-500 text-size-md"
            v-text="item.title"
          />
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
