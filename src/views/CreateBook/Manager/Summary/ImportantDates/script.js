import { mapState } from 'vuex';
import moment from 'moment';
export default {
  computed: {
    ...mapState('book', ['book']),
    dueDate() {
      let date = moment(new Date(this.book.releaseDate)).format('MM/DD/YY');
      return date;
    },
    deliveryDate() {
      let date = moment(new Date(this.book.releaseDate))
        .add(14, 'days')
        .format('MM/DD/YY');
      return date;
    },
    countdown() {
      let dueDate = moment(this.book.releaseDate, 'MM/DD/YYYY');
      let currentDate = moment(new Date());
      return moment(dueDate).diff(currentDate, 'days');
    }
  }
};
