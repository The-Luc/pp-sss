<template>
  <Menu
    v-if="isOpenMenu"
    nudge-width="308"
    :content-class="'pp-menu point-down-menu'"
    :menu-x="menuX"
    :menu-y="menuY"
    :is-open="isOpenMenu"
    @onClickOutsideMenu="onClickOutsideMenu"
  >
    <div class="btn-group">
      <v-btn type="btn" class="btn btn-replace-layout" @click="onReplaceLayout"
        >Replace Layout</v-btn
      >
      <v-btn type="btn" class="btn btn-delete" @click="onDelete"
        >Delete Frame</v-btn
      >
    </div>
  </Menu>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
