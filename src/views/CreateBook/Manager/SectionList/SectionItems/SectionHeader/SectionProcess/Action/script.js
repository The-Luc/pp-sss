import moment from 'moment';
import { mapGetters, mapMutations } from 'vuex';

import ButtonDelete from '@/components/Menu/ButtonDelete';
import ICON_LOCAL from '@/common/constants/icon';
import Menu from '@/components/Menu';
import { GETTERS, MUTATES } from '@/store/modules/app/const';
import Calendar from './Calendar';
import SectionStatus from './SectionStatus';
import { MODAL_TYPES } from '@/common/constants';

export default {
  props: [
    'releaseDate',
    'menuX',
    'menuY',
    'items',
    'sectionId',
    'sectionStatus',
    'sectionName',
    'isShowDelete'
  ],
  components: {
    Menu,
    Calendar,
    SectionStatus,
    ButtonDelete
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
      isOpenStatus: false,
      calendarX: 0,
      calendarY: 0,
      calendarWidth: 600,
      statusX: 0,
      statusY: 0,
      statusWidth: 180,
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
    ...mapMutations({
      toggleModal: MUTATES.TOGGLE_MODAL
    }),
    onOpenModal(sectionId, sectionName) {
      this.toggleModal({
        isOpenModal: true,
        modalData: {
          type: MODAL_TYPES.DELETE_SECTION,
          props: { sectionId, sectionName }
        }
      });
    },
    onClickOutSideCalendar() {
      this.isOpenCalendar = false;
    },
    onClickOutSideStatus() {
      this.isOpenStatus = false;
    },
    onClickOutSideMenu() {
      if (this.isOpenMenu && !this.isOpenCalendar && !this.isOpenStatus) {
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
    openSectionStatus(event) {
      this.isOpenStatus = true;
      const parentElement = event.target.parentElement;
      const { x, y } = parentElement.getBoundingClientRect();
      this.statusX = x - this.statusWidth;
      this.statusY = y;
    },
    onItemClick({ event, item }) {
      switch (item.name) {
        case 'dueDate':
          this.openCalendar(event);
          break;
        case 'status':
          this.openSectionStatus(event);
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
    onSelectedDate(date) {
      this.$emit('onSelectedDate', date);
      setTimeout(() => {
        this.isOpenCalendar = false;
      }, 0);
    },
    onSelectedStatus(status) {
      this.$emit('onSelectedStatus', status);
      setTimeout(() => {
        this.isOpenStatus = false;
      }, 0);
    }
  }
};
