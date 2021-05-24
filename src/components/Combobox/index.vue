<template>
  <v-combobox
    ref="ppCombobox"
    v-click-outside="onClickOutCombobox"
    class="pp-combobox"
    :items="items"
    item-text="label"
    item-value="value"
    solo
    no-filter
    hide-no-data
    :menu-props="{
      value: isOpenMenu,
      closeOnContentClick: true,
      closeOnClick: true,
      positionX: menuX + 23, // 23: width of .v-input__prepend-outer + margin
      positionY: menuY,
      absolute: true,
      nudgeWidth: 92 // 92: Width of .v-input__control
    }"
    @change="onChange"
  >
    <template #item="{ item }">
      <span>{{ item.label }}</span>
    </template>
    <template v-if="prependedIcon" #prepend>
      <img :src="prependedIcon" alt="prepend-icon" class="prepend-icon" />
    </template>
    <template v-if="appendedIcon" #append>
      <img
        class="pointer"
        :src="appendedIcon"
        alt="arrow-select"
        @click="onOpenMenu"
      />
    </template>
  </v-combobox>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
