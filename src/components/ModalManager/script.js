import { mapState, mapMutations } from 'vuex';
import Modal from '@/components/Modal';
import { MUTATES } from '../../store/modules/app/const';

export default {
  data() {
    return {
      ModalComponent: '',
      modalData: {
        title: 'ahihi'
      }
    };
  },
  mounted() {
    this.ModalComponent = Modal;
    console.log('ModalManager');
  },
  computed: mapState({
    dialog: state => state.app.isDialog
  }),
  methods: {
    ...mapMutations({
      handleIsDialog: MUTATES.HANDLEISDIALOG
    })
  }
};
