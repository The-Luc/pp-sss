<template>
  <div class="container">
    <div class="icon-container ml-20 mt-10" v-for="(icon, i) in icons" :key="i">
      <i :class="icon" />
      <span class="icon-name ml-20">{{ icon }}</span>
    </div>
  </div>
</template>
<script src="./Icon.js" />
<style>
@import "./Icon.scss";
</style>
