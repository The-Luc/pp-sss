<template>
  <v-combobox
    ref="ppCombobox"
    v-click-outside="onClickOutCombobox"
    class="pp-combobox"
    :disabled="disabled"
    :items="items"
    item-text="name"
    item-value="value"
    :value="selectedVal"
    :attach="container"
    :nudge-right="20"
    solo
    no-filter
    hide-no-data
    :menu-props="{
      value: isOpenMenu,
      closeOnContentClick: true,
      closeOnClick: true,
      maxHeight: 'auto',
      positionX: menuX + marginMenu, // width of .v-input__prepend-outer + margin
      positionY: menuY,
      absolute: true,
      nudgeWidth,
      ...nudgePosition
    }"
    @change="onChange"
    @keydown.enter="onEnter"
    @keydown.esc="onEsc"
  >
    <template #item="{ item, attrs, on }">
      <v-list-item
        v-slot="{ active }"
        class="pp-select--item"
        v-bind="attrs"
        v-on="on"
      >
        <img
          :style="{ visibility: active ? 'visible' : 'hidden' }"
          class="icon-ative"
          :src="activeMenuIcon"
          alt="icon-active"
        />
        <v-list-item-content>
          <v-list-item-title>
            <v-row no-gutters align="center">
              <span>{{ item.name }}</span>
            </v-row>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
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

<style lang="scss" src="./style.scss" scoped />
