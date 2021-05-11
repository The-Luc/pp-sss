<template>
  <div class="book-number item-center">
    <Number
      :is-active="currentView === bookViewType.PRINT"
      :type="bookNumberType.PAGES"
      total-page="56"
    />
    <LineVertical height="16" />
    <Number
      :is-active="currentView === bookViewType.MANAGER"
      :type="bookNumberType.SHEETS"
      total-page="56"
    />
    <LineVertical height="16" />
    <Number
      :is-active="currentView === bookViewType.DIGITAL"
      :type="bookNumberType.SCREENS"
      total-page="56"
    />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" scoped src="./style.scss" />
