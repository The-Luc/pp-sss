<template>
  <div class="text-properties-container">
    <Properties title="Text Properties">
      <TabMenu @change="onChangeTabMenu">
        <v-tab href="#general">
          General
        </v-tab>
        <v-tab-item value="general">
          <GeneralContent />
        </v-tab-item>

        <v-tab href="#style">
          Style
        </v-tab>
        <v-tab-item value="style">
          <StyleContent
            :border-options="borderOptions"
            :selected-border="selectedBorder"
            @changeBorderOption="changeBorderOption"
          />
        </v-tab-item>

        <v-tab href="#arrange">
          Arrange
        </v-tab>
        <v-tab-item value="arrange">
          <ArrangeContent />
        </v-tab-item>
      </TabMenu>
      <PickerPopup v-if="isOpenColorPicker" />
    </Properties>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
