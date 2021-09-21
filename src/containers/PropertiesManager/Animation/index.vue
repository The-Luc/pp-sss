<template>
  <div class="animation-properties-container">
    <properties-container title="Animation">
      <animation-box
        type="playIn"
        :items="playInItems"
        :selected-item="selectedItem"
        @click="onSelectObject"
      />
      <animation-box
        type="playOut"
        :items="playOutItems"
        :selected-item="selectedItem"
        @click="onSelectObject"
      />
    </properties-container>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
