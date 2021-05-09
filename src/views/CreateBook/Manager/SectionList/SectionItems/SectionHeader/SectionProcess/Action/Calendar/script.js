import moment from 'moment';

const dueDate = '09/15/22';
export default {
  props: {
    releaseDate: {
      type: String
    },
    calendarX: {
      type: Number
    },
    calendarY: {
      type: Number
    },
    isOpenCalendar: {
      type: Boolean
    },
    minDate: {
      type: String
    },
    calendarWidth: {
      type: Number
    }
  },
  data() {
    return {
      dueDateData: '',
      monthRelease: '',
      yearRelease: '',
      dayRelease: '',
      dateSelected: '',
      monthSelected: ''
    };
  },
  mounted() {
    const [year, month, day] = moment(this.releaseDate)
      .format('YYYY-MM-DD')
      .split('-');
    this.monthRelease = month;
    this.yearRelease = year;
    this.dayRelease = day;
    this.dateSelected = `${year}-${month}-${day}`;
    this.monthSelected = `${year}-${month}`;
    this.dueDateData = moment(dueDate).format('YYYY-MM-DD');
  },
  methods: {
    setDateSelect(year, month) {
      if (year === this.yearRelease && month === this.monthRelease) {
        this.dateSelected = `${year}-${month}-${this.dayRelease}`;
      } else {
        this.dateSelected = `${year}-${month}`;
      }
    },
    onChangeMonth(value) {
      const [year, month] = value.split('-');
      this.setDateSelect(year, month);
    },
    onGoCurrentDate() {
      this.monthSelected = `${this.yearRelease}-${this.monthRelease}`;
      this.dateSelected = `${this.yearRelease}-${this.monthRelease}-${this.dayRelease}`;
    },
    onSelectedDay(value) {
      this.$emit('onSelectedDay', value);
    },
    onClickOutSideCalendar() {
      if (this.isOpenCalendar) {
        this.$emit('onClickOutSideCalendar');
      }
    }
  }
};
