<template>
  <div id="mask-select-container" class="mask-select-container">
    <v-select
      class="mask-select"
      :items="items"
      item-text="name"
      item-value="value"
      solo
      :menu-props="{ contentClass: 'dropdown' }"
      attach="#mask-select-container"
      :value="selectedVal"
      @change="onChange"
    >
      <template #item="{ item, on }">
        <v-list-item v-on="on">
          <div
            class="shape-container"
            :class="{ 'item-active': isActive(item.value) }"
          >
            <div :class="item.className"></div>
          </div>
          <div class="name">{{ item.name }}</div>
        </v-list-item>
      </template>
      <template #append>
        <img :src="appendedIcon" alt="arrow-select" />
      </template>
    </v-select>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
