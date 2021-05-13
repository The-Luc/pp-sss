import Frames from '@/components/Frames'
import Thumbnail from '@/components//Thumbnail'
import project from '@/mock/project'
export default {
  components: {
    Frames, 
    Thumbnail
  },
  data(){
    return {
      project: project
    }
  },
};