import { mapGetters } from 'vuex';

import { GETTERS } from '@/store/modules/app/const';
import { OBJECT_TYPE, PROPERTIES_TOOLS } from '@/common/constants';

// Object component
import TextProperties from '@/containers/PropertiesManager/Text';
import ImageProperties from '@/containers/PropertiesManager/Image';
import ClipArt from '@/containers/PropertiesManager/ClipArt';
import Background from '@/containers/PropertiesManager/Background';
import Shape from '@/containers/PropertiesManager/Shape';
import PageInfo from '@/containers/PropertiesManager/PageInfo';
import FrameInfo from '@/containers/PropertiesManager/FrameInfo';

const { TEXT, IMAGE, CLIP_ART, BACKGROUND, SHAPE } = OBJECT_TYPE;

const PAGE_INFO = PROPERTIES_TOOLS.PAGE_INFO.id;
const FRAME_INFO = PROPERTIES_TOOLS.FRAME_INFO.id;

const MenuList = {
  [TEXT]: TEXT,
  [IMAGE]: IMAGE,
  [CLIP_ART]: CLIP_ART,
  [BACKGROUND]: BACKGROUND,
  [SHAPE]: SHAPE,
  [PAGE_INFO]: PAGE_INFO,
  [FRAME_INFO]: FRAME_INFO
};

export default {
  props: {
    isDigital: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      renderObject: '',
      top: 0,
      right: 0
    };
  },
  components: {
    [OBJECT_TYPE.TEXT]: TextProperties,
    [OBJECT_TYPE.IMAGE]: ImageProperties,
    [OBJECT_TYPE.CLIP_ART]: ClipArt,
    [OBJECT_TYPE.BACKGROUND]: Background,
    [OBJECT_TYPE.SHAPE]: Shape,
    [PAGE_INFO]: PageInfo,
    [FRAME_INFO]: FrameInfo
  },
  computed: {
    ...mapGetters({
      propertiesObjectType: GETTERS.PROPERTIES_OBJECT_TYPE
    })
  },
  watch: {
    propertiesObjectType(objectType) {
      if (objectType) {
        this.setObjectComponent(objectType);
      }
    }
  },
  methods: {
    /**
     * Render properties component base on selected object type from store
     * @param  {String} objectType Object type when user click on object. Maybe text, image, ...
     */
    setObjectComponent(objectType) {
      const ObjectComponent = MenuList[objectType];
      if (ObjectComponent) {
        this.renderObject = ObjectComponent;
      }
    }
  }
};
