<template>
  <div
    class="layouts-container"
    :class="{
      'layouts-container-prompt': !isVisited,
      'empty-layout-container': layouts.length === 0
    }"
  >
    <div
      v-if="(!isVisited && isPrompt) || isTranslucentContent"
      class="prompt"
    ></div>
    <GotIt
      v-if="!isVisited && isPrompt"
      :title="textDisplay.promptTitle"
      :message="textDisplay.promptMsg"
      @click="onClickGotIt"
    />
    <PpToolPopover
      :title="textDisplay.title"
      :is-footer-hidden="isFooterHidden"
      @cancel="onCancel"
      @change="setThemeLayoutForSheet"
    >
      <template #action>
        <div class="pp-layouts-action-container">
          <SelectTheme
            :items="themesOptions"
            :theme-selected="themeSelected"
            :disabled="disabledThemeOpts"
            @change="onChangeTheme"
          />
          <SelectLayout
            :items="layoutTypes"
            :disabled="disabledLayoutOpts"
            :title="textDisplay.optionTitle"
            :layout-selected="layoutTypeSelected"
            :is-digital="isDigital"
            @change="onChangeLayoutType"
          />
        </div>
      </template>

      <template #content>
        <div class="layout-item-container">
          <div v-show="layouts.length === 0" class="empty-layout-content">
            <p class="empty-layout-text">No Layout Matches</p>
            <Item
              v-for="(layout, index) in layoutEmptyLength"
              :key="index"
              is-empty
            />
          </div>
          <Item
            v-for="layout in layouts"
            :ref="`layout${layout.id}`"
            :key="layout.id"
            :layout="layout"
            :selected-layout-id="selectedLayout.id"
            :is-favorites="isInFavorites(layout)"
            :is-favorites-disabled="
              layout.isFavoritesDisabled || layout.isCustom
            "
            :is-digital="isDigital"
            :is-preview-disabled="isOnPreview"
            @click="onSelectLayout"
            @saveToFavorites="onSaveToFavorites"
            @togglePreview="onTogglePreview"
          />
        </div>
      </template>
    </PpToolPopover>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
