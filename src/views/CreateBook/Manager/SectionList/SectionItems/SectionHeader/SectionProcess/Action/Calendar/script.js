import { mapGetters } from 'vuex';
import moment from 'moment';

import project from '@/mock/project';
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
      monthSelected: ''
    };
  },
  computed: {
    ...mapGetters({
      sectionSelected: GETTERS.SECTION_SELECTED
    })
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
    onChangeMonth(value) {
      const [year, month] = value.split('-');
      this.setDateSelect(year, month);
    },
    onGoCurrentDate() {
      this.monthSelected = `${this.yearRelease}-${this.monthRelease}`;
      this.dateSelected = `${this.yearRelease}-${this.monthRelease}-${this.dayRelease}`;
    },
    onSelectedDate(value) {
      const currentSection = project.sections.find(
        section => section.id === this.sectionSelected
      );
      currentSection.releaseDate = moment(value).format('MM/DD/YY');
      this.$emit('onSelectedDate', value);
    },
    onClickOutSideCalendar() {
      if (this.isOpenCalendar) {
        this.$emit('onClickOutSideCalendar');
      }
    },
    getDay(date) {
      let i = new Date(date).getDay(date);
      return daysOfWeek[i];
    }
  }
};
