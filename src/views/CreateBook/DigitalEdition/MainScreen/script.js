import ThumbnailItem from '@/components/Thumbnail/ThumbnailItem';

import { mapGetters } from 'vuex';

import { useUser } from '@/hooks';

import { getSectionsWithAccessible } from '@/common/utils';

import { GETTERS as DIGITAL_GETTERS } from '@/store/modules/digital/const';

import { useBookDigitalInfo } from './composables';

export default {
  components: {
    ThumbnailItem
  },
  setup() {
    const { currentUser } = useUser();
    const { getBookDigitalInfo } = useBookDigitalInfo();

    return { currentUser, getBookDigitalInfo };
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
    }
  },
  async created() {
    await this.getBookDigitalInfo(this.$route.params.bookId);
  },
  methods: {
    /**
     * Get name of page of selected sheet
     *
     * @param   {String}  pageName  name of page of selected sheet
     * @returns {Object}            name of page
     */
    getPageName({ pageName }) {
      return { middle: pageName };
    }
  }
};
