<template>
  <div class="book-name-control">
    <v-text-field v-model="bookName" @blur="onBlur" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      bookName: "SMS Yearbook 2021"
    };
  },
  methods: {
    onBlur() {
      console.log(this.bookName);
    }
  }
};
</script>

<style lang="scss" src="./style.scss" />
