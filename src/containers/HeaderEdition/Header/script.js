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
      componentKey: false,
      overlay: false
    };
  },
  computed: mapGetters({
    triggerAutosave: GETTERS.TRIGGER_AUTOSAVE
  }),
  watch: {
    triggerAutosave() {
      this.message = 'Autosaving...';
      this.forceRenderComponent();
    },
    overlay(val) {
      val &&
        setTimeout(() => {
          this.overlay = false;
        }, 2000);
    }
  },
  methods: {
    /**
     * Click save and emit save button
     */
    onClickSave() {
      this.message = 'Saving....';
      this.forceRenderComponent();
      this.overlay = true;
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
