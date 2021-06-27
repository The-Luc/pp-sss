<template>
  <div class="background-properties-container">
    <Properties v-if="isSingle" title="Background Properties">
      <PropertiesContent
        :opacity="opacityValue"
        :disabled="isDisabled"
        :is-left="isLeft"
        @opacityChange="onChangeOpacity"
        @remove="onRemove"
      />
    </Properties>

    <Properties v-else title="Background Properties">
      <TabMenu
        class="background-tabs"
        :active-tab-name="activeTab"
        @change="onTabChange"
      >
        <v-tab href="#background-left">
          Left Hand Page
        </v-tab>
        <v-tab-item value="background-left">
          <PropertiesContent
            :opacity="opacityValue.left"
            :disabled="isDisabled.left"
            :is-left="isLeft.left"
            @opacityChange="onChangeOpacity"
            @remove="onRemove"
          />
        </v-tab-item>

        <v-tab href="#background-right">
          Right Hand Page
        </v-tab>
        <v-tab-item value="background-right">
          <PropertiesContent
            :opacity="opacityValue.right"
            :disabled="isDisabled.right"
            :is-left="isLeft.right"
            @opacityChange="onChangeOpacity"
            @remove="onRemove"
          />
        </v-tab-item>
      </TabMenu>
    </Properties>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
