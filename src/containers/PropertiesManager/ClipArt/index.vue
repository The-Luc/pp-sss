<template>
  <div class="clip-art-properties-container">
    <Properties title="Clip Art Properties">
      <TabPropertiesMenu>
        <v-tab href="#general">
          General
        </v-tab>
        <v-tab-item value="general">
          <general-content
            :is-allow-fill-color="isAllowFillColor"
            :color-value="colorValue"
            :opacity-value="opacityValue"
            :current-shadow="currentShadow"
            :is-digital="isDigitalEdition"
            @change="onChange"
            @changeShadow="onChangeShadow"
            @onApply="onApplyAnimation"
            @preview="onClickPreview"
            @changeOrder="onChangeOrder"
          ></general-content>
        </v-tab-item>
        <v-tab href="#arrange">
          Arrange
        </v-tab>
        <v-tab-item value="arrange">
          <ArrangeContent
            :position="position"
            :min-position="minPosition"
            :max-position="maxPosition"
            :size-width="size.width"
            :size-height="size.height"
            :min-size="minSize"
            :max-size="maxSize"
            :is-constrain="isConstrain"
            :rotate-value="rotateValue"
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
