import ButtonDelete from '@/components/Menu/ButtonDelete';
import ButtonAdd from '@/components/Menu/ButtonAdd';
import Menu from '@/components/Menu';
import Calendar from './Calendar';
import SectionStatus from './SectionStatus';
import Assignee from './Assignee';

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
    Assignee,
    ButtonDelete,
    ButtonAdd
  },
  props: {
    menuX: {
      type: Number,
      default: 0
    },
    menuY: {
      type: Number,
      default: 0
    },
    items: {
      type: Array,
      default: () => []
    },
    sectionId: {
      type: [String, Number],
      default: ''
    },
    status: {
      type: [String, Number],
      default: 0
    },
    sectionName: {
      type: String
    },
    dueDate: {
      type: String
    },
    menuClass: {
      type: String
    },
    assigneeId: {
      type: [String, Number],
      default: ''
    }
  },
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
      assigneeWidth: 267,
      subMenuPos: { x: 0, y: 0 },
      minDate: new Date().toISOString().slice(0, 10),
      componentKey: true
    };
  },
  computed: {
    ...mapGetters({
      sectionSelected: GETTERS.SECTION_SELECTED,
      sections: BOOK_GETTERS.SECTIONS_NO_SHEET,
      maxPage: BOOK_GETTERS.GET_MAX_PAGE,
      totalInfo: BOOK_GETTERS.TOTAL_INFO
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
    /**
     * Close sub menu calendar when click outside it
     */
    onClickOutsideCalendar() {
      this.isOpenCalendar = false;
    },
    /**
     * Close sub menu status when click outside it
     */
    onClickOutsideStatus() {
      this.isOpenStatus = false;
    },
    /**
     * Close sub menu assignee when click outside it
     */
    onClickOutsideAssignee() {
      this.isOpenAssignee = false;
    },
    /**
     * Close sub menu when click outside it
     */
    onClickOutsideMenu() {
      const isSubMenuOpen =
        this.isOpenStatus || this.isOpenCalendar || this.isOpenAssignee;

      if (this.isOpenMenu && !isSubMenuOpen) {
        this.isOpenMenu = false;
        this.setSectionSelected('');
      }
    },
    /**
     * Open calendar sub menu
     *
     * @param {Object}  event the event fire when click
     */
    openCalendar(event) {
      this.isOpenCalendar = this.toggleSubMenu(
        event.target,
        this.isOpenCalendar,
        this.calendarWidth
      );
    },
    /**
     * Open status sub menu
     *
     * @param {Object}  event the event fire when click
     */
    openSectionStatus(event) {
      this.isOpenStatus = this.toggleSubMenu(
        event.target,
        this.isOpenStatus,
        this.statusWidth
      );
    },
    /**
     * Open assignee sub menu
     *
     * @param {Object}  event the event fire when click
     */
    openAssignee(event) {
      const isOpen = this.toggleSubMenu(
        event.target,
        this.isOpenAssignee,
        this.assigneeWidth
      );

      if (isOpen) this.componentKey = !this.componentKey;

      this.isOpenAssignee = isOpen;
    },
    /**
     * Menu item click event
     *
     * @param {Object}  event the event fire when click
     * @param {Object}  item  clicked item
     */
    onItemClick({ event, item }) {
      switch (item.name) {
        case 'dueDate':
          this.openCalendar(event);
          break;
        case 'status':
          this.openSectionStatus(event);
          break;
        case 'assignee':
          this.openAssignee(event);
          break;
        default:
          break;
      }
    },
    setIsOpenMenu(sectionSelected) {
      this.isOpenMenu = sectionSelected === this.sectionId;
    },
    /**
     * Fire when user click to select due date
     *
     * @param {String}  date  selected date
     */
    async onChangeDueDate({ date }) {
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
    /**
     * Fire when user click to select a status
     *
     * @param {Number}  status selected status
     */
    async onChangeStatus({ status }) {
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
    /**
     * Fire when user click to select a community member to assign
     *
     * @param {String | Number} id    selected community member id
     * @param {String}          name  selected community member name
     */
    async onChangeAssignee({ id, name }) {
      const assigneeId = this.assigneeId === id ? -1 : id;
      const assignee = this.assigneeId === id ? '' : name;

      this.updateSection({ id: this.sectionId, assigneeId });

      this.$emit('assigneeUpdate', { assignee });

      setTimeout(() => {
        this.isOpenAssignee = false;
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
     * Toggle sub menu
     *
     * @param   {Object}  element the target element when click
     * @param   {Boolean} isOpen  is sub menu open or not
     * @param   {Number}  width   width of sub menu
     * @returns {Boolean}         sub menu should be open or not
     */
    toggleSubMenu(element, isOpen, width) {
      if (isOpen) return false;

      this.setSubMenuPosition(element, width);

      return true;
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
