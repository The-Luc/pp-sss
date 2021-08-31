<template>
  <div
    ref="propertiesContainer"
    class="properties-container"
    :class="{ digital: isDigital }"
  >
    <component :is="renderObject" :is-digital="isDigital" />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
