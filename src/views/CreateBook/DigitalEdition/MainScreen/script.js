import ThumbnailItem from '@/components/Thumbnail/ThumbnailItem';

import { mapGetters } from 'vuex';

import { useUser } from '@/hooks';

import { getSectionsWithAccessible } from '@/common/utils';

import { GETTERS as DIGITAL_GETTERS } from '@/store/modules/digital/const';

import { useBookDigitalInfo } from './composables';
import { useSectionItems } from '@/views/CreateBook/Manager/composables';
import { ROLE } from '@/common/constants';

export default {
  components: {
    ThumbnailItem
  },
  setup() {
    const { currentUser } = useUser();
    const { getBookDigitalInfo } = useBookDigitalInfo();
    const { sections: bookSections } = useSectionItems();

    return { currentUser, getBookDigitalInfo, bookSections };
  },
  data() {
    return {
      selectedSheet: null
    };
  },
  computed: {
    ...mapGetters({
      sectionList: DIGITAL_GETTERS.SECTIONS_SHEETS
    }),
    bookId() {
      return this.$route.params.bookId;
    },
    sections() {
      return getSectionsWithAccessible(this.sectionList, this.currentUser);
    },
    isAdmin() {
      return this.currentUser.role === ROLE.ADMIN;
    }
  },
  async created() {
    await this.getBookDigitalInfo(this.$route.params.bookId);
  },
  watch: {
    bookSections: {
      deep: true,
      async handler(val, oldVal) {
        if (val !== oldVal)
          await this.getBookDigitalInfo(this.$route.params.bookId);
      }
    }
  },
  methods: {
    /**
     * Get name of page of selected sheet
     *
     * @param   {String}  pageName  name of page of selected sheet
     * @returns {Object}            name of page
     */
    getPageName({ pageName }) {
      return { left: pageName };
    },
    /**
     * Toggle menu by set sheet selected id
     */
    toggleMenu(sheetId) {
      if (!this.selectedSheet || this.selectedSheet !== sheetId) {
        this.selectedSheet = sheetId;
        return;
      }

      if (this.selectedSheet && this.selectedSheet === sheetId) {
        this.onCloseMenu();
      }
    },
    /**
     * set sheet selected is null and close menu
     */
    onCloseMenu() {
      this.selectedSheet = null;
    }
  }
};
