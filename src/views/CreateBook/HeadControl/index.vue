<template>
  <div>
    <BookInformation v-if="isInfoBarDisplayed" />
    <BookControl v-if="isHeaderDisplayed" :book-id="generalInfo.bookId" />
    <BookNumber v-if="isHeaderDisplayed" :number-info="numberInfo" />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
