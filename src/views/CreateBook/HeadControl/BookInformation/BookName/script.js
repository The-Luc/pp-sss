export default {
  data() {
    return {
      bookName: 'SMS Yearbook 2021'
    };
  },
  methods: {
    onBlur() {
      console.log(this.bookName);
    }
  }
};
