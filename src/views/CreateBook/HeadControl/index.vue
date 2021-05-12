<template>
  <div>
    <BookInformation />
    <BookControl :current-view="currentView" @onChangeView="onChangeView" />
    <BookNumber :current-view="currentView" />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
