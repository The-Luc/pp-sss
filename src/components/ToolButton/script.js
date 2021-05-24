import { GETTERS } from '@/store/modules/app/const';
import { mapGetters } from 'vuex';

export default {
  props: {
    iconName: {
      type: String
    },
    title: {
      type: String
    },
    name: {
      type: String
    },
    textName: {
      type: String
    },
    width: {
      type: Number,
      default: 38
    }
  },
  computed: {
    ...mapGetters({
      selectedToolTheme: GETTERS.SELECTED_TOOL_NAME
    })
  },
  methods: {
    onClick() {
      this.$emit('click');
    }
  }
};
