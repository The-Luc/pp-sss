<style lang="scss">
@import "./style.scss";
</style>

<template>
  <div>
    <BookInformation />
    <BookControl :currentView="currentView" @onChangeView="onChangeView" />
    <BookNumber :currentView="currentView" />
  </div>
</template>

<script>
import { BOOK_VIEW_TYPE } from "@/common/constants/book";
import BookInformation from "./BookInformation";
import BookControl from "./BookControl";
import BookNumber from "./BookNumber";

export default {
  components: {
    BookInformation,
    BookControl,
    BookNumber
  },
  data() {
    return {
      currentView: BOOK_VIEW_TYPE.MANAGER
    };
  },
  methods: {
    onChangeView(view) {
      this.currentView = view;
      this.$router.push(`/create-book/${view.toLowerCase()}`);
    }
  }
};
</script>
