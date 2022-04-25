<template>
  <div
    class="layouts-container"
    :class="{
      'layouts-container-prompt': !isVisited,
      'empty-layout-container': isEmptyTab
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
      :disabled="isEmptyTab"
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
            @change="onChangeLayoutType"
          />
        </div>
        <div v-if="!isDigital" class="layout-tab-container">
          <p>View:</p>
          <v-tabs v-model="tabActive" height="20">
            <v-tab v-for="tab in tabs" :key="tab.value">{{ tab.label }}</v-tab>
          </v-tabs>
        </div>
      </template>

      <template #content>
        <v-tabs-items v-model="tabActive">
          <v-tab-item
            v-for="(tab, idx) in tabs"
            :key="idx"
            class="layout-item-container"
          >
            <div v-if="tab.items.length === 0" class="empty-layout-content">
              <p class="empty-layout-text">No Layout Matches</p>
              <Item
                v-for="(layout, index) in layoutEmptyLength"
                :key="index"
                is-empty
              />
            </div>
            <Item
              v-for="layout in tab.items"
              v-else
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
          </v-tab-item>
        </v-tabs-items>
      </template>
    </PpToolPopover>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
