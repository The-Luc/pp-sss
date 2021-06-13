<template>
  <div class="background-properties-container">
    <Properties title="Background Properties">
      <OpacityProp :value="selectedOpacityValue" @change="onChangeOpacity" />

      <div class="group-container">
        <FlipProp />

        <v-divider vertical class="item-vertical"></v-divider>

        <Remove />
      </div>
    </Properties>
  </div>
</template>

<script src="./script.js" />
