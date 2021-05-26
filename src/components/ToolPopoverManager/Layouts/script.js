import { mapGetters } from 'vuex';

import { GETTERS } from '@/store/modules/theme/const';
import { THEMES_LIST } from '@/mock/themesList';
import PpToolPopover from '@/components/ToolPopover';
import PpSelect from '@/components/Select';
import SelectLayout from './SelectLayout';
import SelectTheme from './SelectTheme';
import Item from './Item';
import { LAYOUT_TYPES_OPTIONs } from '@/mock/layoutTypes';

export default {
  components: {
    PpToolPopover,
    PpSelect,
    Item,
    SelectTheme,
    SelectLayout
  },
  computed: {
    ...mapGetters({
      themes: GETTERS.GET_THEMES
    })
  },
  data() {
    return {
      items: THEMES_LIST,
      layouts: LAYOUT_TYPES_OPTIONs
    };
  }
};
