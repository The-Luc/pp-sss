<template>
  <div>
    <ThemesToolPopover
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
