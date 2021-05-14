<template>
  <div>
    <BookInformation />
    <BookControl v-if="showHeader" />
    <BookNumber v-if="showHeader" />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
