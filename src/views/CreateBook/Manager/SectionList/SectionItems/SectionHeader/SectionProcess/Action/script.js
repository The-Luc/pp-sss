import moment from 'moment';
import { mapGetters } from 'vuex';

import ICON_LOCAL from '@/common/constants/icon';
import Menu from '@/components/Menu';
import { GETTERS } from '@/store/modules/app/const';
import Calendar from './Calendar';
import SectionStatus from './SectionStatus';
import { useBook, useMutationSection } from '@/hooks';

export default {
  setup() {
    const { updateSection } = useMutationSection();
    const { book, getBook } = useBook();

    return {
      updateSection,
      book,
      getBook
    };
  },
  props: ['dueDate', 'menuX', 'menuY', 'items', 'sectionId', 'sectionStatus'],
  components: {
    Menu,
    Calendar,
    SectionStatus
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
    async onSelectedDate(date) {
      const dueDate = moment(date).format('MM/DD/YY');
      const { isSuccess } = await this.updateSection(
        this.book.id,
        this.sectionId,
        {
          dueDate
        }
      );
      if (isSuccess) {
        const section = this.book.sections.find(
          section => section.id === this.sectionId
        );
        section.dueDate = dueDate;
      }
      setTimeout(() => {
        this.isOpenCalendar = false;
      }, 0);
    },
    async onSelectedStatus(status) {
      const { isSuccess } = await this.updateSection(
        this.book.id,
        this.sectionId,
        {
          status
        }
      );
      if (isSuccess) {
        const section = this.book.sections.find(
          section => section.id === this.sectionId
        );
        section.status = status.label;
      }
      setTimeout(() => {
        this.isOpenStatus = false;
      }, 0);
    }
  }
};
