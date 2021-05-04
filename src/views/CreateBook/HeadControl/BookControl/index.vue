<template>
  <div class="book book-control">
    <PpButton
      :is-active="currentView === bookViewType.PRINT"
      type="btn"
      link-to="/edit/print"
      @click="onChangeView(bookViewType.PRINT)"
    >
      Print Edition
    </PpButton>
    <LineVertical />
    <PpButton
      :is-active="currentView === bookViewType.MANAGER"
      type="btn"
      link-to="/edit/manager"
      @click="onChangeView(bookViewType.MANAGER)"
    >
      Manager
    </PpButton>
    <LineVertical />
    <PpButton
      :is-active="currentView === bookViewType.DIGITAL"
      type="btn"
      link-to="/edit/digital"
      @click="onChangeView(bookViewType.DIGITAL)"
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
