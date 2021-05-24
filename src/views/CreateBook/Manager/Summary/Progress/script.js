import { mapMutations } from 'vuex';

import { MUTATES } from '@/store/modules/app/const';
import { MODAL_TYPES } from '@/common/constants';

export default {
  methods: {
    ...mapMutations({
      toggleChartModel: MUTATES.TOGGLE_MODAL
    }),
    /**
     * openChart - open the chart by trigger mutation
     */
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
