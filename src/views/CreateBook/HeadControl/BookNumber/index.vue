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

<script>
import { BOOK_NUMBER_TYPE, BOOK_VIEW_TYPE } from "@/common/constants/book";
import Number from "./Number";
import LineVertical from "../LineVertical";

export default {
  components: {
    Number,
    LineVertical
  },
  props: {
    currentView: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      bookNumberType: BOOK_NUMBER_TYPE,
      bookViewType: BOOK_VIEW_TYPE
    };
  }
};
</script>

<style lang="scss" scoped src="./style.scss" />
