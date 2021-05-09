/* eslint-disable no-self-assign */
import moment from 'moment';
import { mapGetters } from 'vuex';
import ICON_LOCAL from '@/common/constants/icon';
import Menu from '@/components/Menu';
import { GETTERS } from '@/store/modules/app/const';

const dueDate = '09/15/22';
export default {
  props: [
    'releaseDate',
    'isOpenCalendar',
    'calendarWidth',
    'calendarPosition',
    'menuX',
    'menuY',
    'items',
    'sectionId'
  ],
  components: {
    Menu
  },
  computed: {
    ...mapGetters({
      sectionSelected: GETTERS.SECTION_SELECTED
    })
  },
  data() {
    return {
      isOpenMenu: false,
      dueDateData: '',
      monthRelease: '',
      yearRelease: '',
      dayRelease: '',
      dateSelected: '',
      monthSelected: '',
      nowDate: new Date().toISOString().slice(0, 10)
    };
  },
  watch: {
    dateSelected(val) {
      if (val) {
        const [year, month] = moment(val)
          .format('YYYY-MM')
          .split('-');
        this.setDateSelect(year, month);
      }
    },
    sectionSelected(value) {
      this.setIsOpenMenu(value);
    }
  },
  mounted() {
    this.moreIcon = ICON_LOCAL.MORE_ICON;
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
      this.yearRelease = this.yearRelease;
      this.monthRelease = this.monthRelease;
    },
    onChangeMonth(value) {
      const [year, month] = value.split('-');
      this.setDateSelect(year, month);
    },
    onGoCurrentDate() {
      this.monthSelected = `${this.yearRelease}-${this.monthRelease}`;
      this.dateSelected = `${this.yearRelease}-${this.monthRelease}-${this.dayRelease}`;
    },
    onMenuToggle(isOpen) {
      this.$emit('onMenuToggle', isOpen);
    },
    onItemClick({ event, item }) {
      this.$emit('onItemClick', { event, item });
    },
    setIsOpenMenu(sectionSelected) {
      console.log('setIsOpenMenu', sectionSelected, this.sectionId);
      if (sectionSelected === this.sectionId) {
        this.isOpenMenu = true;
      } else {
        this.isOpenMenu = false;
      }
    }
  }
};
