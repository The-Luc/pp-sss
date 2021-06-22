<template>
  <div
    class="toolname-container"
    :class="{
      actions: toolComponent === 'Actions'
    }"
  >
    <component :is="toolComponent" :key="componentKey" />
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
