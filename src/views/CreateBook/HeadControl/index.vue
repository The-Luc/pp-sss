<template>
  <div>
    <BookInformation />
    <BookControl :current-view="currentView" @onChangeView="onChangeView" />
    <BookNumber :current-view="currentView" />
  </div>
</template>

<script>
import { BOOK_VIEW_TYPE } from "@/common/constants";
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
      this.$router.push(`/edit/${view.toLowerCase()}`);
    }
  }
};
</script>

<style lang="scss" src="./style.scss" />
