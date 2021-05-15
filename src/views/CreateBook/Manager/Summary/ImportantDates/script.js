import { mapGetters } from 'vuex';
import { GETTERS } from '@/store/modules/book/const';
import moment from 'moment';
export default {
  computed: {
    ...mapGetters({
      book: GETTERS.BOOK_DETAIL
    }),
    dueDate() {
      let date = moment(new Date(this.book.releaseDate)).format('MM/DD/YY');
      return date;
    },
    deliveryDate() {
      let date = moment(new Date(this.book.deliveryDate)).format('MM/DD/YY');
      return date;
    },
    countdown() {
      let dueDate = moment(this.book.releaseDate, 'MM/DD/YYYY');
      let currentDate = moment(new Date());
      return moment(dueDate).diff(currentDate, 'days');
    }
  }
};
