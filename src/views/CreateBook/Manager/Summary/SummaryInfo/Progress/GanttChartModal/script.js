import { mapGetters, mapMutations } from 'vuex';

import Timeline from './Timeline';
import Content from './Content';

import { GETTERS, MUTATES } from '@/store/modules/app/const';

import Modal from '@/containers/Modal';

export default {
  components: {
    Modal,
    Timeline,
    Content
  },
  mounted() {
    this.calculateHeight();
  },
  computed: {
    ...mapGetters({
      isOpenModal: GETTERS.IS_OPEN_MODAL
    })
  },
  watch: {
    isOpenModal: {
      deep: true,
      handler(value) {
        if (!value) return;

        setTimeout(this.calculateHeight, 100);
      }
    }
  },
  methods: {
    ...mapMutations({
      toggleModal: MUTATES.TOGGLE_MODAL
    }),
    /**
     * onCloseModal - Close modal by trigger the mutation with payload
     */
    onCloseModal() {
      this.toggleModal({
        isOpenModal: false
      });
    },
    /**
     * Calculate the height of chart when open
     */
    calculateHeight() {
      const merchandisingHeight = document.querySelector('.merchandising')
        .offsetHeight;
      const sectionsHeight = document.querySelector('.sections').offsetHeight;
      const productionHeight = document.querySelector('.production')
        .offsetHeight;

      const chartContentHeight =
        merchandisingHeight + sectionsHeight + productionHeight + 5;

      const chartContent = document.querySelector('.chart-content');

      chartContent.style.height = `${chartContentHeight}px`;
      chartContent.style.minHeight = `${chartContentHeight}px`;

      document.querySelector(
        '.v-dialog--active'
      ).style.minHeight = `${chartContentHeight + 226}px`;
    }
  }
};
