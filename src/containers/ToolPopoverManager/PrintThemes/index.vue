<template>
  <div>
    <ThemesToolPopover
      :items="items"
      :option-theme-selected="optionThemeSelected"
      :themes="themes"
      :selected-theme-id="selectedThemeId"
      @onCancel="onCancel"
      @onChangeThemeSelected="onChangeThemeSelected"
      @onChangeTheme="onChangeTheme"
      @onSelectTheme="onSelectTheme"
    />
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
