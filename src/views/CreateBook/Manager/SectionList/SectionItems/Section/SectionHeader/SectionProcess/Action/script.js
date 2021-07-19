import ButtonDelete from '@/components/Menu/ButtonDelete';
import ButtonAdd from '@/components/Menu/ButtonAdd';
import Menu from '@/components/Menu';
import Calendar from './Calendar';
import SectionStatus from './SectionStatus';

import { mapGetters, mapMutations } from 'vuex';
import moment from 'moment';

import { MODAL_TYPES, ICON_LOCAL, DATE_FORMAT } from '@/common/constants';
import { GETTERS, MUTATES } from '@/store/modules/app/const';
import {
  GETTERS as BOOK_GETTERS,
  MUTATES as BOOK_MUTATES
} from '@/store/modules/book/const';

import { useMutationSection, useSectionActionMenu } from '@/hooks';

export default {
  components: {
    Menu,
    Calendar,
    SectionStatus,
    ButtonDelete,
    ButtonAdd
  },
  props: [
    'menuX',
    'menuY',
    'items',
    'sectionId',
    'status',
    'sectionName',
    'dueDate',
    'menuClass'
  ],
  setup() {
    const { updateSection: updateSectionDb } = useMutationSection();
    const { updateSection } = useSectionActionMenu();

    return {
      updateSectionDb,
      updateSection
    };
  },
  data() {
    return {
      isOpenMenu: false,
      isOpenCalendar: false,
      isOpenStatus: false,
      isOpenAssignee: false,
      calendarWidth: 550,
      statusWidth: 180,
      subMenuPos: { x: 0, y: 0 },
      minDate: new Date().toISOString().slice(0, 10)
    };
  },
  computed: {
    ...mapGetters({
      sectionSelected: GETTERS.SECTION_SELECTED,
      sections: BOOK_GETTERS.SECTIONS_NO_SHEET,
      maxPage: BOOK_GETTERS.GET_MAX_PAGE,
      totalInfo: BOOK_GETTERS.GET_TOTAL_INFO
    }),
    isShowAdd() {
      let index = this.sections.findIndex(item => item.id === this.sectionId);

      return !(this.totalInfo.totalPages >= this.maxPage || !index);
    },
    isShowDelete() {
      const index = this.sections.findIndex(item => item.id === this.sectionId);

      const isCover = index === 0;
      const isHalfSheet = index === 1 || index === this.sections.length - 1;

      return !isCover && !isHalfSheet;
    }
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
      toggleModal: MUTATES.TOGGLE_MODAL,
      addSheet: BOOK_MUTATES.ADD_SHEET,
      setSectionSelected: MUTATES.SET_SELECTION_SELECTED
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
        this.setSectionSelected('');
      }
    },
    openCalendar(event) {
      this.isOpenCalendar = true;

      this.setSubMenuPosition(event.target, this.calendarWidth);
    },
    openSectionStatus(event) {
      this.isOpenStatus = true;

      this.setSubMenuPosition(event.target, this.statusWidth);
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
      this.isOpenMenu = sectionSelected === this.sectionId;
    },
    async onChangeDueDate(date) {
      const dueDate = moment(date).format(DATE_FORMAT.BASE);

      const { isSuccess } = await this.updateSectionDb(1719, this.sectionId, {
        dueDate
      });

      if (isSuccess) {
        this.updateSection({ id: this.sectionId, dueDate });

        this.$emit('dueDateUpdate', { dueDate });
      }

      setTimeout(() => {
        this.isOpenCalendar = false;
      }, 0);
    },
    async onChangeStatus(status) {
      const { isSuccess } = await this.updateSectionDb(1719, this.sectionId, {
        status: status.value
      });

      if (isSuccess) {
        this.updateSection({ id: this.sectionId, status: status.value });

        this.$emit('statusUpdate', { status: status.value });
      }

      setTimeout(() => {
        this.isOpenStatus = false;
      }, 0);
    },
    async onChangeAssignee({ id, name }) {
      this.updateSection({ id: this.sectionId, assigneeId: id });

      this.$emit('assigneeUpdate', { assignee: name });

      setTimeout(() => {
        this.isOpenStatus = false;
      }, 0);
    },
    onAddSheet(sectionId) {
      this.isOpenMenu = false;
      this.setSectionSelected('');
      this.addSheet({
        sectionId
      });
    },
    onScroll() {
      if (this.isOpenMenu) {
        this.isOpenMenu = false;
        this.setSectionSelected('');
      }
    },
    /**
     * Set sub menu position
     *
     * @param {Object}  element the target element when click
     * @param {Number}  width   width of sub menu
     */
    setSubMenuPosition(element, width) {
      const parentElement = element.parentElement;

      const { x, y } = parentElement.getBoundingClientRect();

      this.subMenuPos.x = x - width;
      this.subMenuPos.y = y;
    }
  }
};
