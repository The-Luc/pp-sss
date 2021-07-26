import ThumbnailItem from '@/components/Thumbnail/ThumbnailItem';

import { mapGetters, mapMutations, mapActions } from 'vuex';

import { useUser } from '@/hooks';

import { getSectionsWithAccessible } from '@/common/utils';

import {
  GETTERS as DIGITAL_GETTERS,
  MUTATES as DIGITAL_MUTATES,
  ACTIONS as DIGITAL_ACTIONS
} from '@/store/modules/digital/const';
import { MUTATES as APP_MUTATES } from '@/store/modules/app/const';

import digitalService from '@/api/digital';

export default {
  components: {
    ThumbnailItem
  },
  setup() {
    const { currentUser } = useUser();

    return { currentUser };
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
  created() {
    this.setBookId({ bookId: this.$route.params.bookId });

    // temporary code, will remove soon
    const info = digitalService.getGeneralInfo();

    this.setInfo({ ...info, bookId: this.$route.params.bookId });

    this.getDataPageEdit();
  },
  methods: {
    ...mapActions({
      getDataPageEdit: DIGITAL_ACTIONS.GET_DATA_MAIN
    }),
    ...mapMutations({
      setBookId: DIGITAL_MUTATES.SET_BOOK_ID,
      setInfo: APP_MUTATES.SET_GENERAL_INFO
    }),
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
