<template>
  <div class="layouts-container">
    <PpToolPopover title="Layouts">
      <template #action>
        <div class="pp-layouts-action-container">
          <SelectTheme :items="themesOptions" @change="onChangeTheme" />
          <SelectLayout
            :items="layouts"
            :disabled="disabled"
            :layout-selected="layoutSelected"
            @change="onChangeLayout"
          />
        </div>
      </template>

      <!-- <template #content>
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
      </template> -->
    </PpToolPopover>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
