<template>
  <div class="text-properties-container">
    <Properties title="Shape Properties">
      <TabMenu @change="onChangeTabMenu">
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
            :current-arrange="currentArrange"
            :position-y="positionY"
            :position-x="positionX"
            :rotate-value="rotateValue"
            :size-width="sizeWidth"
            :size-height="sizeHeight"
            :min-size="minSize"
            :max-size="maxSize"
            :is-constrain="isConstrain"
            @changeFlip="changeFlip"
            @change="onChange"
            @changeConstrain="onChangeConstrain"
          />
        </v-tab-item>
      </TabMenu>
    </Properties>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
