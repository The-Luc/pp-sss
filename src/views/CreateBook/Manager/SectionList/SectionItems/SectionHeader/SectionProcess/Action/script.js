/* eslint-disable no-self-assign */
import moment from 'moment';
import { mapGetters } from 'vuex';

import ICON_LOCAL from '@/common/constants/icon';
import Menu from '@/components/Menu';
import { GETTERS } from '@/store/modules/app/const';
import Calendar from './Calendar';

export default {
  props: ['releaseDate', 'menuX', 'menuY', 'items', 'sectionId'],
  components: {
    Menu,
    Calendar
  },
  computed: {
    ...mapGetters({
      sectionSelected: GETTERS.SECTION_SELECTED
    })
  },
  data() {
    return {
      isOpenMenu: false,
      isOpenCalendar: false,
      calendarX: 0,
      calendarY: 0,
      calendarWidth: 600,
      minDate: new Date().toISOString().slice(0, 10)
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
  },
  methods: {
    onClickOutSideCalendar() {
      console.log('onClickOutSideCalendar');
      this.isOpenCalendar = false;
    },
    onClickOutSideMenu() {
      if (this.isOpenMenu && !this.isOpenCalendar) {
        console.log('close Menu');
        this.isOpenMenu = false;
      }
    },
    openCalendar(event) {
      this.isOpenCalendar = true;
      const parentElement = event.target.parentElement;
      const { x, y } = parentElement.getBoundingClientRect();
      this.calendarX = x - (this.calendarWidth + 50);
      this.calendarY = y;
    },
    onItemClick({ event, item }) {
      switch (item.name) {
        case 'dueDate':
          this.openCalendar(event);
          break;
        default:
          break;
      }
    },
    setIsOpenMenu(sectionSelected) {
      if (sectionSelected === this.sectionId) {
        this.isOpenMenu = true;
      } else {
        this.isOpenMenu = false;
      }
    },
    onSelectedDay(value) {
      console.log('onSelectedDay', value);
      this.isOpenCalendar = false;
    }
  }
};
