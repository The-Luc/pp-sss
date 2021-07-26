<template>
  <div
    class="layouts-container"
    :class="{
      'layouts-container-prompt': !isVisited,
      'empty-layout-container': displayLayouts.length === 0
    }"
  >
    <div v-if="!isVisited && isPrompt" class="prompt"></div>
    <GotIt
      v-if="!isVisited && isPrompt"
      :title="textDisplay.promptTitle"
      :message="textDisplay.promptMsg"
      @click="onClickGotIt"
    />
    <PpToolPopover
      :title="textDisplay.title"
      @cancel="onCancel"
      @change="setThemeLayoutForSheet"
    >
      <template #action>
        <div class="pp-layouts-action-container">
          <SelectTheme
            :items="themesOptions"
            :theme-selected="themeSelected"
            @change="onChangeTheme"
          />
          <SelectLayout
            :items="layoutsOpts"
            :disabled="disabled"
            :title="textDisplay.optionTitle"
            :layout-selected="layoutSelected"
            @change="onChangeLayout"
          />
        </div>
      </template>

      <template #content>
        <div class="layout-item-container">
          <div
            v-show="displayLayouts.length === 0"
            class="empty-layout-content"
          >
            <p class="empty-layout-text">No Layout Matches</p>
            <Item
              v-for="(layout, index) in layoutEmptyLength"
              :key="index"
              is-empty
            />
          </div>
          <Item
            v-for="layout in displayLayouts"
            :ref="`layout${layout.id}`"
            :key="layout.id"
            :layout="layout"
            :selected-layout-id="tempLayoutIdSelected"
            :is-favorites="layout.isFavorites"
            :is-digital="isDigital"
            @click="onSelectLayout"
            @saveToFavorites="onSaveToFavorites"
          />
        </div>
      </template>
    </PpToolPopover>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
