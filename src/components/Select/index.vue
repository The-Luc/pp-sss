<template>
  <v-select
    class="pp-select"
    :items="items"
    item-text="label"
    item-value="value"
    solo
    :value="selectedVal"
    return-object
    persistent-hint
    :menu-props="{
      maxHeight: 'auto',
      zIndex: 9999
    }"
    @change="onChange"
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
        />
        <v-list-item-content>
          <v-list-item-title>
            <v-row no-gutters align="center">
              <span>{{ item.label }}</span>
            </v-row>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
    <template v-if="prependedIcon" #prepend>
      <img :src="prependedIcon" alt="prepend-icon" class="prepend-icon" />
    </template>
    <template v-if="appendedIcon" #append>
      <img :src="appendedIcon" alt="arrow-select" />
    </template>
  </v-select>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
