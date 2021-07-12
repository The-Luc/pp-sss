<template>
  <div
    class="layouts-container"
    :class="{
      'layouts-container-prompt': !isVisited,
      'empty-layout-container': layouts.length === 0
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
            :selected-layout-id="tempLayoutIdSelected"
            :is-digital="isDigital"
            @click="onSelectLayout"
          />
        </div>
      </template>
    </PpToolPopover>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
