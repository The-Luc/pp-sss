import { mapMutations } from 'vuex';

import Timeline from './Timeline';
import Content from './Content';

import { MUTATES } from '@/store/modules/app/const';

import Modal from '@/components/Modal';

export default {
  components: {
    Modal,
    Timeline,
    Content
  },
  mounted() {
    let merchandisingHeight = document.querySelector('.merchandising')
      .offsetHeight;
    let sectionsHeight = document.querySelector('.sections').offsetHeight;
    let productionHeight = document.querySelector('.production').offsetHeight;

    const chartContentHeight =
      merchandisingHeight + sectionsHeight + productionHeight;

    const chartContent = document.querySelector('.chart-content');

    chartContent.style.height = `${chartContentHeight}px`;
    chartContent.style.minHeight = `${chartContentHeight}px`;

    document.querySelector(
      '.v-dialog--active'
    ).style.minHeight = `${chartContentHeight + 226}px`;
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
    }
  }
};
