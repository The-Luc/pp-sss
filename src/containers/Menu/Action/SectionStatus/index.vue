<template>
  <v-menu
    :value="isOpen"
    content-class="pp-status"
    :position-x="statusX"
    :position-y="statusY"
    :close-on-content-click="false"
    :nudge-width="statusWidth"
  >
    <v-list v-click-outside="onClickOutside" dense>
      <v-list-item-group :value="status">
        <v-list-item v-for="item in statusList" :key="item.value">
          <v-list-item-content @click="onSelected(item)">
            <v-list-item-title
              class="text-500 text-size-md"
              v-text="item.name"
            />
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
