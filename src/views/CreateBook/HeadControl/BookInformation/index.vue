<template>
  <div class="book book-information">
    <ExitBuilder />
    <BookName />
    <Help />
  </div>
</template>

<script>
import ExitBuilder from "./ExitBuilder";
import BookName from "./BookName";
import Help from "./Help";

export default {
  components: {
    ExitBuilder,
    Help,
    BookName
  }
};
</script>
