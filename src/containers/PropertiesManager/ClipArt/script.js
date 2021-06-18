import Properties from '@/components/Properties';
import TabMenu from '@/components/TabMenu';
import Arrange from '@/components/Arrange';
import GeneralContent from './GeneralContent';

export default {
  components: {
    Properties,
    TabMenu,
    Arrange,
    GeneralContent
  },
  methods: {
    /**
     * Handle update rotate for ClipArt
     * @param {Number} val Value user entered
     */
    changeRotate(val) {
      console.log(val);
    }
  }
};
