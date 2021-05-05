import SectionList from './SectionList';
import Summary from './Summary';

import project from '@/mock/project';

export default {
  components: {
    SectionList,
    Summary
  },
  data() {
    return {
      project: project
    };
  }
};