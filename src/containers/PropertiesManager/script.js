import { mapGetters } from 'vuex';

import { GETTERS } from '@/store/modules/app/const';
import { OBJECT_TYPE } from '@/common/constants';

// Object component
import TextProperties from '@/containers/PropertiesManager/Text';
import ImageProperties from '@/containers/PropertiesManager/Image';
import ClipArt from '@/containers/PropertiesManager/ClipArt';
import Background from '@/containers/PropertiesManager/Background';
import Shape from '@/containers/PropertiesManager/Shape';
import PickerPopup from '@/containers/PickerPopup';

const { TEXT, IMAGE, CLIP_ART, BACKGROUND, SHAPE } = OBJECT_TYPE;

const ObjectList = {
  [TEXT]: TEXT,
  [IMAGE]: IMAGE,
  [CLIP_ART]: CLIP_ART,
  [BACKGROUND]: BACKGROUND,
  [SHAPE]: SHAPE
};

export default {
  data() {
    return {
      renderObject: '',
      top: 0,
      right: 0
    };
  },
  components: {
    PickerPopup,
    [OBJECT_TYPE.TEXT]: TextProperties,
    [OBJECT_TYPE.IMAGE]: ImageProperties,
    [OBJECT_TYPE.CLIP_ART]: ClipArt,
    [OBJECT_TYPE.BACKGROUND]: Background,
    [OBJECT_TYPE.SHAPE]: Shape
  },
  computed: {
    ...mapGetters({
      selectedObjectType: GETTERS.SELECTED_OBJECT_TYPE,
      isOpenColorPicker: GETTERS.IS_OPEN_COLOR_PICKER,
      propsData: GETTERS.COLOR_PICKER_CUSTOM_PROPS
    })
  },
  watch: {
    selectedObjectType(objectType) {
      if (objectType) {
        this.setObjectComponent(objectType);
      }
    }
  },
  mounted() {
    this.$root.$on('pickerComponent', data => {
      const {
        clientWidth: widthColorPicker,
        clientHeight: heightColorPicker
      } = data;
      const {
        top: propertyTop,
        left: propertyLeft
      } = this.$refs.propertiesContainer.getBoundingClientRect();
      const { top: elementTop, left: elementLeft } = this.propsData;
      const diffTop = elementTop - propertyTop;
      const top = diffTop - heightColorPicker / 2;

      const diffLeft = elementLeft - propertyLeft;

      const right = Math.abs(diffLeft - widthColorPicker) + 5;
      this.top = top;
      this.right = right;
    });
  },
  methods: {
    /**
     * Render properties component base on selected object type from store
     * @param  {String} objectType Object type when user click on object. Maybe text, image, ...
     */
    setObjectComponent(objectType) {
      const ObjectComponent = ObjectList[objectType];
      if (ObjectComponent) {
        this.renderObject = ObjectComponent;
      }
    }
  }
};
