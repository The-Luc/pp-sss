<template>
  <div class="image-properties-container">
    <Properties title="Image Properties">
      <TabPropertiesMenu>
        <v-tab href="#general">
          General
        </v-tab>
        <v-tab-item value="general">
          <ImageStyle
            :style-selected="styleSelected"
            :options="imageStyle"
            @onSelectImageStyle="onSelectImageStyle"
          />
          <General
            :is-allow-fill-color="false"
            :is-show-border="true"
            :opacity-value="opacityValue"
            :current-shadow="currentShadow"
            :current-border="currentBorder"
            :is-digital="isDigitalEdition"
            :play-in-config="playInConfig"
            :play-out-config="playOutConfig"
            :play-in-order="playInOrder"
            :play-out-order="playOutOrder"
            animation-title="Image Animation"
            @change="onChange"
            @changeShadow="onChangeShadow"
            @changeBorder="onChangeBorder"
            @onApply="onApplyAnimation"
            @preview="onClickPreview"
            @changeOrder="onChangeOrder"
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

<style lang="scss" src="./style.scss" scoped />
