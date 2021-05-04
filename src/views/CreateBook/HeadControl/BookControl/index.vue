<template>
  <div class="book book-control">
    <PpButton
      :isActive="currentView === bookViewType.PRINT"
      type="btn"
      @click="onChangeView(bookViewType.PRINT)"
      linkTo="/create-book/print"
    >
      Print Edition
    </PpButton>
    <LineVertical />
    <PpButton
      :isActive="currentView === bookViewType.MANAGER"
      type="btn"
      @click="onChangeView(bookViewType.MANAGER)"
      linkTo="/create-book/manager"
    >
      Manager
    </PpButton>
    <LineVertical />
    <PpButton
      :isActive="currentView === bookViewType.DIGITAL"
      type="btn"
      @click="onChangeView(bookViewType.DIGITAL)"
      linkTo="/create-book/digital"
    >
      Digital Edition
    </PpButton>
  </div>
</template>

<script>
import { BOOK_VIEW_TYPE } from "@/common/constants/book";
import PpButton from "@/components/Button";
import LineVertical from "../LineVertical";

export default {
  components: {
    PpButton,
    LineVertical
  },
  props: {
    currentView: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      bookViewType: BOOK_VIEW_TYPE
    };
  },
  methods: {
    onChangeView(newView) {
      this.$emit("onChangeView", newView);
    }
  }
};
</script>
