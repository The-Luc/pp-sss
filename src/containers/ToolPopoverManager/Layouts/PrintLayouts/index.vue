<template>
  <Layouts
    :is-visited="isVisited"
    :layouts="layouts"
    :layout-id="layoutId"
    :is-prompt="isPrompt"
    :text-display="textDisplay"
    :themes-options="themesOptions"
    :layout-types="layoutTypes"
    :theme-selected="themeSelected"
    :disabled-theme-opts="disabledTheme"
    :layout-type-selected="layoutTypeSelected"
    :favorite-layouts="favoriteLayouts"
    @setThemeLayoutForSheet="setThemeLayoutForSheet"
    @onChangeTheme="onChangeTheme"
    @onChangeLayoutType="onChangeLayoutType"
    @onSaveToFavorites="onSaveToFavorites"
    @onClose="onCancel"
    @onClickGotIt="onClickGotIt"
  />
</template>

<script src="./script.js" />
