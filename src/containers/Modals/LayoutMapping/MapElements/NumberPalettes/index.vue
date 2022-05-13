<template>
  <v-menu
    :value="isOpen"
    content-class="pp-number-palettes"
    :position-x="posX"
    :position-y="posY"
    :nudge-width="78"
    absolute
    :close-on-click="false"
  >
    <v-list dense>
      <v-list-item-group v-click-outside="onClickOutside">
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          @click="onSelected(item)"
        >
          <v-list-item-icon>
            <img
              :style="{ visibility: item.active ? 'visible' : 'hidden' }"
              class="icon-active"
              :src="activeMenuIcon"
              alt="icon-active"
            />
          </v-list-item-icon>
          <v-list-item-icon>
            <div
              v-if="item.value > 0"
              class="icon-color-indicator"
              :style="{ backgroundColor: item.color }"
            ></div>
            <div
              v-else
              class="icon-color-indicator icon-color-indicator--unassign"
            ></div>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title
              :class="{ 'bold-title': item.isBold }"
              v-text="item.title"
            />
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
