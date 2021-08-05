import Tags from '@/components/Tags';
import GotIt from '@/components/GotIt';
import { usePhotoSidebar } from '@/views/CreateBook/composables';
export default {
  components: {
    Tags,
    GotIt
  },
  setup() {
    const { isPhotoVisited, setPhotoVisited } = usePhotoSidebar();

    return {
      isPhotoVisited,
      setPhotoVisited
    };
  },
  data() {
    return {
      promptTitle: 'This is your Smartbox',
      promptMsg:
        'As a short cut to help you select the most relevant media, we pre-populate a “Smartbox” tab with photos that match your page/spread and/or section title. We even organize those results into ‘good’, ‘better’, and ‘best’ categories that are based on algorithms that analyze factors such as image quality, ranking,\n \n \n and use.'
    };
  },
  methods: {
    onClickGotIt() {
      this.setPhotoVisited({ isPhotoVisited: true });
    }
  }
};
