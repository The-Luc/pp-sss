<template>
  <div class="shape-properties-container">
    <Properties title="Shape Properties">
      <TabPropertiesMenu>
        <v-tab href="#general">
          General
        </v-tab>
        <v-tab-item value="general">
          <general-content
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
            :rotate-value="rotateValue"
            :size-width="sizeWidth"
            :size-height="sizeHeight"
            :min-size="minSize"
            :max-size="maxSize"
            :is-constrain="isConstrain"
            :min-position="minPosition"
            :max-position="maxPosition"
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
