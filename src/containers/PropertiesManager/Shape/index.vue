<template>
  <div class="shape-properties-container">
    <Properties title="Shape Properties">
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
