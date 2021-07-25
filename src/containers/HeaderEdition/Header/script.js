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
  data() {
    return {
      message: '',
      componentKey: false
    };
  },
  computed: mapGetters({
    triggerAutosave: GETTERS.TRIGGER_AUTOSAVE
  }),
  watch: {
    triggerAutosave() {
      this.message = 'Autosaving...';
      this.forceRenderComponent();
    }
  },
  methods: {
    /**
     * Click save and emit save button
     */
    onClickSave() {
      this.message = 'Saving....';
      this.forceRenderComponent();
      this.$emit('onClickSave');
    },

    /**
     * Trigger to re-render the component
     */
    forceRenderComponent() {
      this.componentKey = !this.componentKey;
    }
  }
};
