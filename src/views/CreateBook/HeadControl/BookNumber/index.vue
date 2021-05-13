<template>
  <div class="book-number item-center">
    <Number
      :is-active="currentView === bookViewType.PRINT"
      :type="bookNumberType.PAGES"
      :total="getTotalInfo.totalPages"
    />
    <LineVertical height="16" />
    <Number
      :is-active="currentView === bookViewType.MANAGER"
      :type="bookNumberType.SHEETS"
      :total="getTotalInfo.totalSheets"
    />
    <LineVertical height="16" />
    <Number
      :is-active="currentView === bookViewType.DIGITAL"
      :type="bookNumberType.SCREENS"
      :total="getTotalInfo.totalScreens"
    />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" scoped src="./style.scss" />
