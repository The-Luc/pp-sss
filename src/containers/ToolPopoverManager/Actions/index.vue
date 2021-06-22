<template>
  <div class="actions-container">
    <Item v-for="item in items" :key="item.value" :item="item" />
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
