<template>
  <div ref="propertiesContainer" class="properties-container">
    <component :is="renderObject" :is-digital="isDigital" />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
