<template>
  <div class="background-properties-container">
    <properties-container v-if="isSingle" title="Background Properties">
      <div
        class="background-properties-wrapper"
        :class="{ digital: isDigital }"
      >
        <properties-content
          :opacity="opacityValue"
          :is-left="isLeft"
          :disabled="isDisabled"
          @opacityChange="onChangeOpacity"
          @remove="onRemove"
        ></properties-content>
      </div>
    </properties-container>

    <properties-container v-else title="Background Properties">
      <tab-menu
        class="background-properties-wrapper"
        :active-tab-name="activeTab"
        @change="onTabChange"
      >
        <v-tab href="#background-left">
          Left Hand Page
        </v-tab>
        <v-tab-item value="background-left">
          <properties-content
            :opacity="opacityValue.left"
            :disabled="isDisabled.left"
            :is-left="isLeft.left"
            @opacityChange="onChangeOpacity"
            @remove="onRemove"
          ></properties-content>
        </v-tab-item>

        <v-tab href="#background-right">
          Right Hand Page
        </v-tab>
        <v-tab-item value="background-right">
          <properties-content
            :opacity="opacityValue.right"
            :disabled="isDisabled.right"
            :is-left="isLeft.right"
            @opacityChange="onChangeOpacity"
            @remove="onRemove"
          ></properties-content>
        </v-tab-item>
      </tab-menu>
    </properties-container>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
