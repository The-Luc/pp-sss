<template>
  <div class="themes-container">
    <PpToolPopover
      title="Themes"
      action-text="Change Theme"
      @cancel="onCancel"
      @change="onChangeThemeSelected"
    >
      <template #action>
        <div class="pp-selected-theme">
          <div class="pp-selected-theme--header">
            <span class="pp-selected-theme--header--selected-title"
              >Selected Theme:</span
            >
            <PpSelect
              :items="items"
              :selected-val="optionThemeSelected"
              @change="onChangeTheme"
            />
          </div>
        </div>
      </template>

      <template #content>
        <div class="theme-item-container">
          <Item
            v-for="theme in themes"
            :ref="`theme${theme.id}`"
            :key="theme.id"
            :theme="theme"
            :selected-theme-id="selectedThemeId"
            @click="onSelectTheme"
          />
        </div>
      </template>
    </PpToolPopover>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
