import { mapMutations } from 'vuex';

import { MUTATES } from '@/store/modules/app/const';
import { MODAL_TYPES } from '@/common/constants';

export default {
  setup() {
    return {
      ...mapMutations({
        toggleChartModel: MUTATES.TOGGLE_MODAL
      })
    };
  },
  methods: {
    openChart: function() {
      this.toggleChartModel({
        isOpenModal: true,
        modalData: {
          type: MODAL_TYPES.GANTT_CHART,
          props: {}
        }
      });
    }
  }
};
