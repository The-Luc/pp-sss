import moment from 'moment';
import { mapGetters, mapMutations } from 'vuex';

import { useBook, useMutationSection } from '@/hooks';
import { MODAL_TYPES, ICON_LOCAL } from '@/common/constants';

import { GETTERS, MUTATES } from '@/store/modules/app/const';
import { GETTERS as BOOK_GETTERS } from '@/store/modules/book/const';
import ButtonDelete from '@/components/Menu/ButtonDelete';
import ButtonAdd from '@/components/Menu/ButtonAdd';
import Menu from '@/components/Menu';
import Calendar from './Calendar';
import SectionStatus from './SectionStatus';

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
  props: [
    'menuX',
    'menuY',
    'items',
    'sectionId',
    'status',
    'sectionName',
    'dueDate'
  ],
  components: {
    Menu,
    Calendar,
    SectionStatus,
    ButtonDelete,
    ButtonAdd
  },
  computed: {
    ...mapGetters({
      sectionSelected: GETTERS.SECTION_SELECTED,
      sections: BOOK_GETTERS.SECTIONS
    })
  },
  data() {
    return {
      isOpenMenu: false,
      isOpenCalendar: false,
      isOpenStatus: false,
      calendarX: 0,
      calendarY: 0,
      isShowAdd: false,
      isShowDelete: false,
      calendarWidth: 550,
      statusX: 0,
      statusY: 0,
      statusWidth: 180,
      minDate: new Date().toISOString().slice(0, 10),
      isCloseMenu: false
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
    console.log('status', this.status);
    this.moreIcon = ICON_LOCAL.MORE_ICON;
    this.setIsShowDelete();
    this.setIsShowAdd();
  },
  methods: {
    ...mapMutations({
      toggleModal: MUTATES.TOGGLE_MODAL,
      addSheet: 'book/addSheet',
      MaxPage: 'book/getMaxPage',
      TotalInfo: 'book/getTotalInfo',
      setSectionSelected: MUTATES.SET_SELECTION_SELECTED
    }),
    setIsShowDelete() {
      const index = this.sections.findIndex(item => item.id === this.sectionId);
      if (index !== 0 && index !== 1 && index !== this.sections.length - 1) {
        this.isShowDelete = true;
      } else {
        this.isShowDelete = false;
      }
    },
    setIsShowAdd() {
      let index = this.sections.findIndex(item => item.id === this.sectionId);
      if (this.TotalInfo.totalPages >= this.MaxPage || !index) {
        this.isShowAdd = false;
      } else {
        this.isShowAdd = true;
      }
    },
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
        this.setSectionSelected('');
      }
    },
    openCalendar(event) {
      this.isOpenCalendar = true;
      const parentElement = event.target.parentElement;
      const { x, y } = parentElement.getBoundingClientRect();
      this.calendarX = x - this.calendarWidth;
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
        const section = this.book.sections.find(s => s.id === this.sectionId);
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
        const section = this.book.sections.find(s => s.id === this.sectionId);
        section.status = status.label;
      }
      setTimeout(() => {
        this.isOpenStatus = false;
      }, 0);
    },
    onAddSheet(sectionId) {
      this.isCloseMenu = true;
      this.addSheet({
        sectionId
      });
    },
    onScroll() {
      if (this.isOpenMenu) {
        this.isOpenMenu = false;
        this.setSectionSelected('');
      }
    }
  }
}
