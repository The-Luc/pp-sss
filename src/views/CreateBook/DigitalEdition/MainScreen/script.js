import { mapGetters, mapMutations, mapActions } from 'vuex';

import ListThumbContainer from '@/components/Thumbnail/ListThumbContainer';
import Thumbnail from '@/components/Thumbnail/ThumbnailDigital';
import {
  GETTERS as DIGITAL_GETTERS,
  MUTATES as DIGITAL_MUTATES,
  ACTIONS as DIGITAL_ACTIONS
} from '@/store/modules/digital/const';
import { MUTATES as APP_MUTATES } from '@/store/modules/app/const';

import digitalService from '@/api/digital';

export default {
  components: {
    ListThumbContainer,
    Thumbnail
  },
  computed: {
    ...mapGetters({
      sections: DIGITAL_GETTERS.SECTIONS_SHEETS
    }),
    bookId() {
      return this.$route.params.bookId;
    },
    orderScreen() {
      return (sectionIndex, sheetIndex) => {
        let indexInSections = 0;
        for (let i = 0; i < sectionIndex; i++) {
          indexInSections += this.sections[i].sheetIds.length;
        }
        indexInSections += sheetIndex + 1;
        if (indexInSections < 10) {
          return '0' + indexInSections;
        } else {
          return '' + indexInSections;
        }
      };
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
    })
  }
};
