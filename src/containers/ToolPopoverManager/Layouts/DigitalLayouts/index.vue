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
    :disabled-layout-opts="disabled"
    :layout-type-selected="layoutTypeSelected"
    :favorite-layouts="favoriteLayouts"
    :is-digital="true"
    @setThemeLayoutForSheet="setThemeLayoutForSheet"
    @onChangeTheme="onChangeTheme"
    @onChangeLayoutType="onChangeLayoutType"
    @onSaveToFavorites="onSaveToFavorites"
    @onClose="onCancel"
    @onClickGotIt="onClickGotIt"
  />
</template>

<script src="./script.js" />
