import { mapGetters, mapMutations } from 'vuex';
import moment from 'moment';

import EventFlag from './EventFlag';
import BlockBar from '@/components/BlockBar';

import { MUTATES } from '@/store/modules/app/const';
import { GETTERS } from '@/store/modules/book/const';

import Modal from '@/components/Modal';

export default {
  components: {
    Modal,
    BlockBar,
    EventFlag
  },
  data() {
    return {
      slotType: {
        ON_SALE: 'sale',
        RELEASE: 'release',
        DELIVERY: 'delivery'
      }
    };
  },
  computed: {
    months: function() {
      const totalMonthToShow = this.getTotalMonthToShow();

      const monthData = Array.from({ length: totalMonthToShow }, (v, index) => {
        return this.getMonthData(index);
      });

      return monthData;
    },
    slots: function() {
      const totalMonthToShow = this.getTotalMonthToShow();

      const slotData = Array.from({ length: totalMonthToShow }, (v, index) => {
        return {
          id: index,
          slots: this.getSlot(index)
        };
      });

      return slotData.filter(s => s.slots.length > 0);
    },
    monthNames: function() {
      const totalMonthToShow = this.getTotalMonthToShow();

      const monthData = Array.from({ length: totalMonthToShow }, (v, index) => {
        return {
          slotName: `slot${index}`
        };
      });

      return monthData;
    },
    slotNames: function() {
      const totalMonthToShow = this.getTotalMonthToShow();

      const { createdDate } = this.getBookEventDates();

      const slotData = Array.from({ length: totalMonthToShow }, (v, index) => {
        const checkTime = moment(createdDate, 'MM/DD/YY').add(index, 'M');

        const isShowName = index > 0 && index < totalMonthToShow;

        return {
          id: index,
          name: isShowName ? checkTime.format('MMM') : ''
        };
      });

      return slotData.filter(s => s.name.length > 0);
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
     * Get Total Month to show in Timeline
     *
     * @returns {Number}
     */
    getTotalMonthToShow: function() {
      const { createdDate, deliveryDate } = this.getBookEventDates();

      const beginTime = moment(createdDate, 'MM/DD/YY');
      const endTime = moment(deliveryDate, 'MM/DD/YY')
        .add(1, 'M')
        .set('date', beginTime.date());

      return endTime.diff(beginTime, 'months', false) + 1;
    },
    /**
     * Get month data use for generate timeline
     *
     * @param  {Number} index index of month in timeline
     * @returns {Object}
     */
    getMonthData: function(index) {
      const { createdDate } = this.getBookEventDates();

      const checkTime = moment(createdDate, 'MM/DD/YY').add(index, 'M');

      const isShowYear = index === 0 || checkTime.month() === 0;

      return {
        text: isShowYear ? checkTime.format('yyyy') : null,
        slotName: `slot${index}`
      };
    },
    /**
     * Get list of slot will be use for checked month
     *
     * @param  {Number} index index of month in timeline
     * @returns {Array}
     */
    getSlot: function(index) {
      const {
        createdDate,
        saleDate,
        releaseDate,
        deliveryDate
      } = this.getBookEventDates();

      const saleMonth =
        saleDate === null ? -1 : moment(saleDate, 'MM/DD/YY').month();

      const releaseMonth = moment(releaseDate, 'MM/DD/YY').month();
      const deliveryMonth = moment(deliveryDate, 'MM/DD/YY').month();

      const checkTime = moment(createdDate, 'MM/DD/YY').add(index, 'M');
      const month = checkTime.month();

      const slots = [];

      if (month === saleMonth)
        slots.push(
          this.getSlotData(
            index,
            saleDate,
            this.slotType.ON_SALE,
            'On-sale Date:'
          )
        );

      if (month === releaseMonth)
        slots.push(
          this.getSlotData(
            index,
            releaseDate,
            this.slotType.RELEASE,
            'File Release Due Date:'
          )
        );

      if (month === deliveryMonth)
        slots.push(
          this.getSlotData(
            index,
            deliveryDate,
            this.slotType.DELIVERY,
            'Requested Delivery Date:',
            true
          )
        );

      return slots;
    },
    /**
     * Get slot data
     *
     * @param  {Number} index index of month in timeline
     * @param  {String} eventDate event date (sale/release/delivery)
     * @param  {String} slotType type of slot (sale/release/delivery)
     * @param  {String} description description of event date
     * @param  {Boolean} isDelivery is event date delivery or not
     * @returns {Object}
     */
    getSlotData: function(index, eventDate, slotType, description, isDelivery) {
      const event = moment(eventDate, 'MM/DD/YY');

      return {
        id: `${index}${slotType}`,
        type: slotType,
        value: eventDate,
        name: description,
        position: event.date() / event.daysInMonth(),
        isShort: isDelivery
      };
    },
    /**
     * Close modal
     */
    onCloseModal() {
      this.toggleModal({
        isOpenModal: false
      });
    }
  }
};
