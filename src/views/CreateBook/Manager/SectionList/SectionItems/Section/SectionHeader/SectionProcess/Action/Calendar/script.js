import moment from 'moment';

import { dueDateMenu } from '@/hooks';

const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default {
  props: {
    date: {
      type: String
    },
    calendarX: {
      type: Number
    },
    calendarY: {
      type: Number
    },
    isOpen: {
      type: Boolean,
      default: false
    },
    minDate: {
      type: String
    },
    calendarWidth: {
      type: Number
    }
  },
  setup() {
    const { specialDates } = dueDateMenu();

    return { specialDates };
  },
  data() {
    return {
      dueDateData: '',
      monthRelease: '',
      yearRelease: '',
      dayRelease: '',
      dateSelected: '',
      monthSelected: '',
      yearSelected: ''
    };
  },
  watch: {
    dateSelected(val) {
      const [year, month] = val.split('-');

      if (year === this.yearRelease && month === this.monthRelease) {
        this.setDateSelect(year, month);
      }
    },
    monthSelected(val) {
      const [year] = val.split('-');
      if (year === this.yearRelease) {
        this.setMonthSelected(year);
      }
    }
  },
  mounted() {
    const [year, month, day] = moment(this.date)
      .format('YYYY-MM-DD')
      .split('-');
    this.monthRelease = month;
    this.yearRelease = year;
    this.dayRelease = day;
    this.dateSelected = `${year}-${month}-${day}`;
    this.monthSelected = `${year}-${month}`;
    this.dueDateData = moment(this.specialDates.releaseDate).format(
      'YYYY-MM-DD'
    );
  },
  methods: {
    /**
     * Base on year and month value to set dateSelected
     * @param  {Number} year The year value
     * @param  {Number} month The month value
     */
    setDateSelect(year, month) {
      if (year === this.yearRelease && month === this.monthRelease) {
        this.dateSelected = `${year}-${month}-${this.dayRelease}`;
      } else {
        this.dateSelected = `${year}-${month}`;
      }
    },
    setMonthSelected(year) {
      this.monthSelected = `${year}-${this.monthRelease}`;
    },
    onSelectedMonth(value) {
      const [year, month] = value.split('-');
      this.setDateSelect(year, month);
    },
    onGoCurrentDate() {
      const [year, month] = moment(new Date())
        .format('YYYY-MM-DD')
        .split('-');
      this.monthSelected = `${year}`;
      this.dateSelected = `${year}-${month}`;
    },
    /**
     * Fire when user click to select due date
     *
     * @param {String}  date  selected date
     */
    onSelectedDate(date) {
      this.$emit('change', { date });
    },
    /**
     * Fire when user click outside of calendar modal
     */
    onClickOutside() {
      if (this.isOpen) {
        this.$emit('clickOutside');
      }
    },
    getDay(date) {
      let i = new Date(date).getDay(date);
      return daysOfWeek[i];
    }
  }
};
