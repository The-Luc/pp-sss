<template>
  <div class="video-properties-container">
    <Properties title="Video Properties">
      <TabPropertiesMenu>
        <v-tab href="#general">
          Movie
        </v-tab>
        <v-tab-item value="general">
          <Movie />
        </v-tab-item>

        <v-tab href="#style">
          Style
        </v-tab>
        <v-tab-item value="style">
          <StyleContent
            :is-allow-fill-color="false"
            :is-show-border="true"
            :opacity-value="opacityValue"
            :current-shadow="currentShadow"
            :current-border="currentBorder"
            @change="onChange"
            @changeShadow="onChangeShadow"
            @changeBorder="onChangeBorder"
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
