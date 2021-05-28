<template>
  <div class="layouts-container">
    <PpToolPopover title="Layouts">
      <template #action>
        <div class="pp-layouts-action-container">
          <SelectTheme
            :items="themesOptions"
            :theme-selected="themeSelected"
            @change="onChangeTheme"
          />
          <SelectLayout
            :items="layoutsOpt"
            :disabled="disabled"
            :layout-selected="layoutSelected"
            @change="onChangeLayout"
          />
        </div>
      </template>

      <template #content>
        <div class="layout-item-container">
          <div v-show="layouts.length === 0" class="empty-layout">
            No Layout Matches
          </div>
          <Item
            v-for="layout in layouts"
            :ref="`layout${layout.id}`"
            :key="layout.id"
            :layout="layout"
            :selected-layout-id="tempLayoutIdSelected"
            @click="onSelectLayout"
          />
        </div>
      </template>
    </PpToolPopover>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
