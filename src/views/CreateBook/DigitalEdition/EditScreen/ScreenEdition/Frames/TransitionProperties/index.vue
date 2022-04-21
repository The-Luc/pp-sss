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
        :id="transition.id"
        :transition-index="index"
        :sheet-id="sheetId"
        :section-id="sectionId"
        :is-header-displayed="false"
        :transition="transition.transition"
        :direction="transition.direction"
        :duration="transition.duration"
        :is-expand-default="true"
        @settingChange="onSettingChanged"
      ></item>
    </custom-menu>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
