<template>
  <div :style="{ width: `${width}px` }" class="box-property-container">
    <Header :title="title" />
    <slot />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
