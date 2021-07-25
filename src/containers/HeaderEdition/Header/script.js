import PpButton from '@/components/Buttons/Button';
import { GETTERS } from '@/store/modules/app/const';
import { mapGetters } from 'vuex';

export default {
  components: {
    PpButton
  },
  props: {
    nameEditor: {
      type: String,
      required: true
    }
  },
  computed: mapGetters({
    triggerAutosave: GETTERS.TRIGGER_AUTOSAVE
  }),
  watch: {
    triggerAutosave() {
      console.log(this.triggerAutoSave);
    }
  },
  methods: {
    /**
     * Click save and emit save button
     */
    onClickSave() {
      this.$emit('onClickSave');
    }
  }
};
