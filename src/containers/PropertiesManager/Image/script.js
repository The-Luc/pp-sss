import Properties from '@/components/Properties/BoxProperties';
import TabPropertiesMenu from '@/containers/TabPropertiesMenu';
import ArrangeContent from '@/components/Arrange';
import GeneralContent from './GeneralContent';
import Reset from './Reset';
import { DEFAULT_IMAGE } from '@/common/constants';
export default {
  components: {
    Properties,
    TabPropertiesMenu,
    ArrangeContent,
    GeneralContent,
    Reset
  },
  computed: {
    rotateValue() {
      return 0;
    },
    isConstrain() {
      return DEFAULT_IMAGE.IS_CONSTRAIN;
    },
    position() {
      return {
        x: 9.4,
        y: 7.12
      };
    },
    size() {
      return {
        width: 3.32,
        height: 4.51
      };
    },
    minSize() {
      return DEFAULT_IMAGE.MIN_SIZE;
    },
    maxSize() {
      return DEFAULT_IMAGE.MAX_SIZE;
    },
    minPosition() {
      return DEFAULT_IMAGE.MIN_POSITION;
    },
    maxPosition() {
      return DEFAULT_IMAGE.MAX_POSITION;
    }
  },
  methods: {
    /**
     * Close color picker (if opening) when change tab
     */
    onChangeTabMenu(data) {
      this.setColorPickerData({
        tabActive: data
      });
    },
    /**
     * Handle update flip for Image
     * @param {String} actionName action name
     */
    changeFlip(actionName) {
      console.log('changeFlip ', actionName);
      //TODO
    },
    /**
     * Handle update size, position or rotate for Image
     * @param {Object} object object containing the value of update size, position or rotate
     */
    onChange(object) {
      console.log('onChange ', object);
      //TODO
    },
    /**
     * Handle constrain proportions for Image
     * @param {Boolean} val
     */
    onChangeConstrain(val) {
      console.log('onChangeConstrain ', val);
      //TODO
    },
    /**
     * Handle click crop image for Image
     */
    onClickCropImage() {
      console.log('onClickCropImage');
      //TODO
    },
    /**
     * Handle click remove image for Image
     */
    onClickRemoveImage() {
      console.log('onClickRemoveImage');
      //TODO
    },
    /**
     * Handle click background image for Image
     */
    onClickBackgroundImage() {
      console.log('onClickBackgroundImage');
      //TODO
    }
  }
};
