<template>
  <div
    id="transition-menu"
    class="transition-properties-container"
    :style="{ top: `${topValue}px`, left: `${left}px` }"
  >
    <custom-menu
      content-class="menu-content"
      container="#transition-menu"
      :is-open="index > -1"
      @onClickOutsideMenu="onClickOutsideMenu"
    >
      <item
        :transition-index="index"
        :is-header-displayed="false"
        :transition="transition.transition"
        :direction="transition.direction"
        :duration="transition.duration"
        @transitionChange="onTransitionChange"
      ></item>
    </custom-menu>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
