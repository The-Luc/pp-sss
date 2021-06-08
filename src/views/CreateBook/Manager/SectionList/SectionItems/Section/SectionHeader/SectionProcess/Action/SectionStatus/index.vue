<template>
  <v-menu
    :value="isOpenStatus"
    content-class="pp-status"
    :position-x="statusX"
    :position-y="statusY"
    :close-on-content-click="false"
    :nudge-width="statusWidth"
  >
    <v-list v-click-outside="onClickOutSideStatus" dense>
      <v-list-item-group :value="status" color="primary">
        <v-list-item v-for="(item, i) in statusList" :key="i">
          <v-list-item-content @click="onSelectedStatus(item)">
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
