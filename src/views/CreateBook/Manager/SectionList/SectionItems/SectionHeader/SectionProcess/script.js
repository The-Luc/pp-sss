import ICON_LOCAL from '@/common/constants/icon';
import Menu from '@/components/Menu';
import { mapGetters, mapMutations } from 'vuex';

export default {
  props: ['color', 'releaseDate', 'sectionId'],
  components: {
    Menu
  },
  data() {
    return {
      items: [
        { title: 'Status', value: 'Not Started' },
        { title: 'Due Date', value: 'Due Date' },
        { title: 'Assigned To', value: 'Unassigned' }
      ],

    };
  },
  created() {
    this.moreIcon = ICON_LOCAL.MORE_ICON;
  },
  computed: {
    ...mapGetters('project',['getSection']),
    isAddSheet(){
      let index = this.getSection.findIndex( item => item.id === this.sectionId );
      return !!index;
    }
  },
  methods: {
    ...mapMutations('project', ['addSheet']),
    onAddSheet(sectionId) {
      this.addSheet({
        sectionId
      });
    }
  }
};
