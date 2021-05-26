<template>
  <div class="layouts-container">
    <PpToolPopover title="Layouts">
      <template #action>
        <div class="pp-selected-theme">
          <div class="pp-selected-theme--header">
            <SelectLayout :items="items" @change="onChangeTheme" />

            <span class="pp-selected-theme--header--selected-title"
              >Theme:</span
            >
            <PpSelect :items="items" @change="onChangeTheme" />
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
