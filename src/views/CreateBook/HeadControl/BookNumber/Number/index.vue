<template>
  <p
    class="book-number-information text-300 text-size-md text-center mb-0"
    :class="{
      active: isActive
    }"
  >
    {{ numberText }}
  </p>
</template>

<script>
import { BOOK_NUMBER_TYPE } from "@/common/constants/book";

export default {
  props: {
    totalPage: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    isActive: Boolean
  },
  computed: {
    numberText() {
      let res = "";
      switch (this.type) {
        case BOOK_NUMBER_TYPE.SCREENS:
          {
            const numScreens = this.getSheetsBypage();
            res = `${numScreens} Screens`;
          }
          break;
        case BOOK_NUMBER_TYPE.SHEETS:
          {
            const numSheets = this.getSheetsBypage();
            res = `${numSheets} Sheets`;
          }
          break;
        default:
          res = `${this.totalPage} Pages`;
          break;
      }
      return res;
    }
  },
  methods: {
    getSheetsBypage() {
      // Basically, 1 sheet includes 2 pages
      const realNumberPage = this.totalPage - 4; // Includes: 2 page of cover and 2 page of 2 half-sheet
      return realNumberPage / 2;
    }
  }
};
</script>

<style lang="scss" src="./style.scss" />
