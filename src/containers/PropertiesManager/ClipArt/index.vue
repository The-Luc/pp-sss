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
          <Arrange
            :position-x="3.21"
            :position-y="4.32"
            :value-rotate="10"
            :min-rotate="-360"
            :max-rotate="360"
            @changeRotate="changeRotate"
          />
        </v-tab-item>
      </TabMenu>
    </Properties>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
