import { mapGetters, mapMutations } from 'vuex';
import moment from 'moment';

import BlockBar from '@/components/BlockBar';

import { MUTATES } from '@/store/modules/app/const';
import { GETTERS } from '@/store/modules/book/const';

import Modal from '@/components/Modal';

export default {
  components: {
    Modal,
    BlockBar
  },
  computed: {
    months: function() {
      const {
        createdDate,
        //saleDate,
        //releaseDate,
        deliveryDate
      } = this.getBookEventDates();

      const beginTime = moment(createdDate, 'MM/DD/YY');
      const endTime = moment(deliveryDate, 'MM/DD/YY')
        .add(1, 'M')
        .set('date', beginTime.date());

      const totalMonthToShow = endTime.diff(beginTime, 'months', false) + 1;

      beginTime.add(-1, 'M');

      const months = Array.from({ length: totalMonthToShow }, (v, index) => {
        beginTime.add(1, 'M');

        if (index === 0 || beginTime.month() === 0) {
          return {
            text: beginTime.format('yyyy')
          };
        }

        return {};
      });

      return months;
    }
  },
  methods: {
    ...mapGetters({
      getBookEventDates: GETTERS.GET_BOOK_DATES
    }),
    ...mapMutations({
      toggleModal: MUTATES.TOGGLE_MODAL
    }),
    /**
     * Close model
     */
    onCloseModal() {
      this.toggleModal({
        isOpenModal: false
      });
    }
  }
};
