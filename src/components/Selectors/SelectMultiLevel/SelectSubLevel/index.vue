<template>
  <v-list class="pp-select-sub" @click.native="onSubContainerClick($event)">
    <v-list-item
      v-for="item in items"
      :key="item.value"
      class="pp-select-sub--item"
      :class="getCustomCssClass(item)"
      @click.native="onSubClick(item)"
    >
      <img
        :style="{
          visibility: isSelected(item) ? 'visible' : 'hidden'
        }"
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
  </v-list>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
