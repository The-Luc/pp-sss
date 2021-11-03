import BlockBar from '@/components/BarProcesses/BlockBar';
import EventFlag from './EventFlag';

import moment from 'moment';

import { useGanttChart } from '../../composables';

import { isEmpty, getWidthOfGanttTimeline } from '@/common/utils';

import { DATE_FORMAT } from '@/common/constants';

export default {
  components: {
    BlockBar,
    EventFlag
  },
  setup() {
    const {
      eventDates,
      totalDayToShow,
      totalMonthToShow,
      saleDateFromBeginning,
      releaseDateFromBeginning,
      deliveryDateFromBeginning
    } = useGanttChart();

    return {
      eventDates,
      totalDayToShow,
      totalMonthToShow,
      saleDateFromBeginning,
      releaseDateFromBeginning,
      deliveryDateFromBeginning
    };
  },
  computed: {
    events() {
      const { createdDate } = this.eventDates;

      return Array.from({ length: this.totalMonthToShow }, (_, index) => {
        return this.getEventData(index, createdDate);
      });
    },
    eventFlags() {
      return this.getEventFlags();
    }
  },
  methods: {
    /**
     * Get data of month use for generate timeline
     *
     * @param   {Number} index        index of month in timeline
     * @param   {Number} createdDate  the created day of book
     * @returns {Object}              the data of chosen month
     */
    getEventData(index, createdDate) {
      const checkTime = moment(createdDate, DATE_FORMAT.BASE).add(index, 'M');

      const isShowYear = index === 0 || checkTime.month() === 0;

      return {
        text: isShowYear ? checkTime.format('yyyy') : null,
        isUseBorder: true,
        width: getWidthOfGanttTimeline(createdDate, index, this.totalDayToShow)
      };
    },
    /**
     * Get list of event flag
     *
     * @returns {Array} List of slot with data
     */
    getEventFlags() {
      const { saleDate, releaseDate, deliveryDate } = this.eventDates;

      const eventFlags = [];

      if (!isEmpty(saleDate)) {
        eventFlags.push(
          this.getEventFlagData(
            saleDate,
            'On-sale Date:',
            this.saleDateFromBeginning
          )
        );
      }

      eventFlags.push(
        this.getEventFlagData(
          releaseDate,
          'File Release Due Date:',
          this.releaseDateFromBeginning
        )
      );

      eventFlags.push(
        this.getEventFlagData(
          deliveryDate,
          'Requested Delivery Date:',
          this.deliveryDateFromBeginning,
          true
        )
      );

      return eventFlags;
    },
    /**
     * Get data for event flag
     *
     * @param   {String}  eventDate   event date (sale/release/delivery)
     * @param   {String}  description description of event date
     * @param   {Number}  totalDay    total day from beginning
     * @param   {Boolean} isShort     is short flag
     * @returns {Object}              the data of chosen slot
     */
    getEventFlagData(eventDate, description, totalDay, isShort = false) {
      return {
        value: eventDate,
        name: description,
        position: totalDay / this.totalDayToShow,
        isShort
      };
    }
  }
};
