<style lang="scss" scoped>
@import "./style.scss";
</style>

<template>
  <div class="book-number item-center">
    <Number
      :isActive="currentView === bookViewType.PRINT"
      :type="bookNumberType.PAGES"
      totalPage="56"
    />
    <LineVertical height="16" />
    <Number
      :isActive="currentView === bookViewType.MANAGER"
      :type="bookNumberType.SHEETS"
      totalPage="56"
    />
    <LineVertical height="16" />
    <Number
      :isActive="currentView === bookViewType.DIGITAL"
      :type="bookNumberType.SCREENS"
      totalPage="56"
    />
  </div>
</template>

<script>
import { BOOK_NUMBER_TYPE, BOOK_VIEW_TYPE } from "@/common/constants/book";
import Number from "./Number";
import LineVertical from "../LineVertical";

export default {
  data() {
    return {
      bookNumberType: BOOK_NUMBER_TYPE,
      bookViewType: BOOK_VIEW_TYPE
    };
  },
  components: {
    Number,
    LineVertical
  },
  props: {
    currentView: String
  }
};
</script>
