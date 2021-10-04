import { OBJECT_TYPE, PROPERTIES_TOOLS } from '@/common/constants';

// Object component
import TextProperties from '@/containers/PropertiesManager/Text';
import ImageProperties from '@/containers/PropertiesManager/Image';
import ClipArt from '@/containers/PropertiesManager/ClipArt';
import Background from '@/containers/PropertiesManager/Background';
import Shape from '@/containers/PropertiesManager/Shape';
import Video from '@/containers/PropertiesManager/Video';
import Animation from '@/containers/PropertiesManager/Animation';
import PageInfo from '@/containers/PropertiesManager/PageInfo';
import FrameInfo from '@/containers/PropertiesManager/FrameInfo';
import Transition from '@/views/CreateBook/DigitalEdition/EditScreen/PropertiesMenu/Transition';
import Playback from '@/views/CreateBook/DigitalEdition/EditScreen/PropertiesMenu/Playback';

import { isEmpty } from '@/common/utils';
import { useToolBar } from '@/hooks';

const {
  TEXT,
  IMAGE,
  PORTRAIT_IMAGE,
  CLIP_ART,
  BACKGROUND,
  SHAPE,
  VIDEO
} = OBJECT_TYPE;

const PAGE_INFO = PROPERTIES_TOOLS.PAGE_INFO.name;
const FRAME_INFO = PROPERTIES_TOOLS.FRAME_INFO.name;
const TRANSITION = PROPERTIES_TOOLS.TRANSITION.name;
const ANIMATION = PROPERTIES_TOOLS.ANIMATION.name;
const PLAYBACK = PROPERTIES_TOOLS.PLAYBACK.name;

const MenuList = {
  [TEXT]: TEXT,
  [IMAGE]: IMAGE,
  [PORTRAIT_IMAGE]: PORTRAIT_IMAGE,
  [CLIP_ART]: CLIP_ART,
  [BACKGROUND]: BACKGROUND,
  [SHAPE]: SHAPE,
  [VIDEO]: VIDEO,
  [PAGE_INFO]: PAGE_INFO,
  [FRAME_INFO]: FRAME_INFO,
  [TRANSITION]: TRANSITION,
  [ANIMATION]: ANIMATION,
  [PLAYBACK]: PLAYBACK
};

export default {
  props: {
    isDigital: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const { propertiesType, selectedObjectType } = useToolBar();

    return { propertiesType, selectedObjectType };
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
    [OBJECT_TYPE.PORTRAIT_IMAGE]: ImageProperties,
    [OBJECT_TYPE.CLIP_ART]: ClipArt,
    [OBJECT_TYPE.BACKGROUND]: Background,
    [OBJECT_TYPE.SHAPE]: Shape,
    [OBJECT_TYPE.VIDEO]: Video,
    [PAGE_INFO]: PageInfo,
    [FRAME_INFO]: FrameInfo,
    [TRANSITION]: Transition,
    [ANIMATION]: Animation,
    [PLAYBACK]: Playback
  },
  watch: {
    propertiesType(val) {
      if (isEmpty(val)) {
        this.renderObject = null;

        return;
      }

      if (val === PROPERTIES_TOOLS.PROPERTIES.name) {
        this.setObjectComponent(this.selectedObjectType);

        return;
      }

      this.setObjectComponent(val);
    },
    selectedObjectType(val) {
      if (isEmpty(val) && isEmpty(this.propertiesType)) {
        this.renderObject = null;

        return;
      }

      this.setObjectComponent(val);
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
