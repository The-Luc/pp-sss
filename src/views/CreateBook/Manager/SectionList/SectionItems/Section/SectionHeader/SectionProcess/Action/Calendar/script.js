import { mapGetters } from 'vuex';
import moment from 'moment';

import { DATE_FORMAT } from '@/common/constants';
import { GETTERS } from '@/store/modules/app/const';

import book from '@/mock/book';

const dueDate = book.releaseDate;
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
      monthSelected: '',
      yearSelected: ''
    };
  },
  computed: {
    ...mapGetters({
      sectionSelected: GETTERS.SECTION_SELECTED
    })
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
    this.dueDateData = moment(dueDate).format('YYYY-MM-DD');
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
    onSelectedDate(value) {
      const currentSection = book.sections.find(
        section => section.id === this.sectionSelected
      );
      currentSection.releaseDate = moment(value).format(DATE_FORMAT.BASE);
      this.$emit('change', value);
    },
    onClickOutSide() {
      if (this.isOpenCalendar) {
        this.$emit('clickOutSide');
      }
    },
    getDay(date) {
      let i = new Date(date).getDay(date);
      return daysOfWeek[i];
    }
  }
};
