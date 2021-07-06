<template>
  <div class="text-properties-container">
    <Properties title="Text Properties">
      <TabPropertiesMenu>
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
          <ArrangeContent
            :position="position"
            :min-position="minPosition"
            :max-position="maxPosition"
            :rotate-value="rotateValue"
            :size-width="sizeWidth"
            :size-height="sizeHeight"
            :max-size="maxSize"
            :min-height="minHeight"
            :min-width="minWidth"
            :is-constrain="isConstrain"
            :disabled="disabled"
            @changeFlip="changeFlip"
            @change="onChange"
            @changeConstrain="onChangeConstrain"
          />
        </v-tab-item>
      </TabPropertiesMenu>
    </Properties>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
