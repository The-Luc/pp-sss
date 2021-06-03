import { mapGetters } from 'vuex';

import { GETTERS } from '@/store/modules/app/const';
import { OBJECT_TYPE } from '@/common/constants';

// Object component
import TextProperties from '@/containers/PropertiesManager/Text';
import ImageProperties from '@/containers/PropertiesManager/Image';

const { TEXT, IMAGE } = OBJECT_TYPE;

const ObjectList = {
  [TEXT]: TEXT,
  [IMAGE]: IMAGE
};

export default {
  data() {
    return {
      renderObject: ''
    };
  },
  components: {
    [OBJECT_TYPE.TEXT]: TextProperties,
    [OBJECT_TYPE.IMAGE]: ImageProperties
  },
  computed: {
    ...mapGetters({
      selectedObjectType: GETTERS.SELECTED_OBJECT_TYPE
    })
  },
  watch: {
    selectedObjectType(objectType) {
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
      const ObjectComponent = ObjectList[objectType];
      if (ObjectComponent) {
        this.renderObject = ObjectComponent;
      }
    }
  }
};
