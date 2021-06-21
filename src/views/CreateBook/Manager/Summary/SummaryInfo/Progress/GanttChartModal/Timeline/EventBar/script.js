import BlockBar from '@/components/BarProcesses/BlockBar';
import EventFlag from './EventFlag';

import { mapGetters } from 'vuex';
import moment from 'moment';

import { DATE_FORMAT } from '@/common/constants';
import { GETTERS } from '@/store/modules/book/const';

export default {
  components: {
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
    ...mapGetters({
      eventDates: GETTERS.BOOK_DATES,
      totalMonthToShow: GETTERS.TOTAL_MONTH_SHOW_ON_CHART
    }),
    events: function() {
      return Array.from({ length: this.totalMonthToShow }, (v, index) => {
        return this.getEventData(index);
      });
    },
    slots: function() {
      const slotData = Array.from(
        { length: this.totalMonthToShow },
        (v, index) => {
          return {
            id: index,
            slots: this.getSlot(index)
          };
        }
      );

      return slotData.filter(s => s.slots.length > 0);
    }
  },
  methods: {
    /**
     * getEventData - Get data of month use for generate timeline
     *
     * @param   {Number} index index of month in timeline
     * @returns {Object}       the data of chosen month
     */
    getEventData: function(index) {
      const { createdDate } = this.eventDates;

      const checkTime = moment(createdDate, DATE_FORMAT.BASE).add(index, 'M');

      const isShowYear = index === 0 || checkTime.month() === 0;

      return {
        text: isShowYear ? checkTime.format('yyyy') : null,
        isUseBorder: true,
        slotName: `slot${index}`
      };
    },
    /**
     * getSlot - Get list of slot will be use for checked month
     *
     * @param   {Number} index  Index of month in timeline
     * @returns {Array}         List of slot with data
     */
    getSlot: function(index) {
      const {
        createdDate,
        saleDate,
        releaseDate,
        deliveryDate
      } = this.eventDates;

      const saleMonth =
        saleDate === null ? -1 : moment(saleDate, DATE_FORMAT.BASE).month();

      const releaseMonth = moment(releaseDate, DATE_FORMAT.BASE).month();
      const deliveryMonth = moment(deliveryDate, DATE_FORMAT.BASE).month();

      const checkTime = moment(createdDate, DATE_FORMAT.BASE).add(index, 'M');
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
     * getSlotData - Get data for slot of timeline
     *
     * @param   {Number}  index       index of month in timeline
     * @param   {String}  eventDate   event date (sale/release/delivery)
     * @param   {String}  slotType    type of slot (sale/release/delivery)
     * @param   {String}  description description of event date
     * @param   {Boolean} isDelivery  is event date delivery or not
     * @returns {Object}              the data of chosen slot
     */
    getSlotData: function(index, eventDate, slotType, description, isDelivery) {
      const event = moment(eventDate, DATE_FORMAT.BASE);

      return {
        id: `${index}${slotType}`,
        type: slotType,
        value: eventDate,
        name: description,
        position: event.date() / event.daysInMonth(),
        isShort: isDelivery
      };
    }
  }
};
