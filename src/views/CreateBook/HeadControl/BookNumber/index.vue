<template>
  <div class="book-number item-center">
    <Number
      :is-active="path.indexOf(screen.PRINT) > -1"
      :type="bookNumberType.PAGES"
      :total="getTotalInfo.totalPages"
    />
    <LineVertical height="16" />
    <Number
      :is-active="path.indexOf(screen.MANAGER) > -1"
      :type="bookNumberType.SHEETS"
      :total="getTotalInfo.totalSheets"
    />
    <LineVertical height="16" />
    <Number
      :is-active="path.indexOf(screen.DIGITAL) > -1"
      :type="bookNumberType.SCREENS"
      :total="getTotalInfo.totalScreens"
    />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" scoped src="./style.scss" />
