<template>
  <div class="text-properties-container">
    <Properties title="Clip Art Properties">
      <TabMenu>
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
            :is-constrain="isConstrain"
            @changeFlip="changeFlip"
            @change="onChange"
          />
        </v-tab-item>
      </TabMenu>
    </Properties>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
