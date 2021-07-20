<template>
  <div class="image-properties-container">
    <Properties title="Image Properties">
      <TabPropertiesMenu @change="onChangeTabMenu">
        <v-tab href="#general">
          General
        </v-tab>
        <v-tab-item value="general">
          <GeneralContent />
        </v-tab-item>
        <v-tab href="#arrange">
          Arrange
        </v-tab>
        <v-tab-item value="arrange">
          <ArrangeContent
            :position="position"
            :min-position="minPosition"
            :max-position="maxPosition"
            :size-width="sizeWidth"
            :size-height="sizeHeight"
            :min-size="minSize"
            :max-size="maxSize"
            :is-constrain="isConstrain"
            :rotate-value="rotateValue"
            @changeFlip="changeFlip"
            @change="onChange"
            @changeConstrain="onChangeConstrain"
          />
        </v-tab-item>
        <v-tab href="#reset">
          Reset
        </v-tab>
        <v-tab-item value="reset">
          <Reset
            @onClickCropImage="onClickCropImage"
            @onClickRemoveImage="onClickRemoveImage"
            @onClickBackgroundImage="onClickBackgroundImage"
          />
        </v-tab-item>
      </TabPropertiesMenu>
    </Properties>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
