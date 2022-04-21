import { BORDER_STYLES, HTML_BORDER_STYLE } from '@/common/constants';
import { isEmpty, mapObject } from '@/common/utils';
import { useImageStyle } from '@/hooks/style';
import SavedImageStylePopover from './SavedImageStylePopover';

export default {
  components: {
    SavedImageStylePopover
  },
  setup() {
    const { userImageStyles } = useImageStyle();
    return { userImageStyles };
  },
  data() {
    return {
      isShowDropdown: false,
      showSavedStylePopup: false
    };
  },
  props: {
    options: {
      type: Array,
      require: true
    },
    styleSelected: {
      type: Number | String,
      default: null
    }
  },
  computed: {
    imageStyleOptions() {
      return this.options.slice(0, 4);
    },
    customOptions() {
      return [...this.options, ...this.userImageStyles];
    }
  },
  methods: {
    /**
     * Open dropdown image style
     */
    onOpenDropdown() {
      if (this.userImageStyles?.length) {
        this.showSavedStylePopup = true;
        return;
      }
      this.isShowDropdown = true;
    },
    /**
     * Close dropdown image style
     */
    onCloseDropdown() {
      this.showSavedStylePopup = false;
      this.isShowDropdown = false;
    },
    /**
     * Emit change image style to parent component
     * @param {Number} item - image style
     */
    onSelect(item) {
      if (+item?.id !== +this.styleSelected) {
        this.$emit('onSelectImageStyle', item);
      }
      this.onCloseDropdown();
    },
    /**
     * Get css style of item base on its style
     *
     * @param   {Object} style  style of item
     * @returns {Object}        css style of item
     */
    getStyle(cssStyle) {
      if (isEmpty(cssStyle)) return {};

      const mapRules = {
        data: {
          stroke: {
            name: 'border-color'
          },
          strokeWidth: {
            name: 'border-width',
            parse: value => `${Math.min(Math.ceil(value / 2), 20)}px`
          },
          strokeLineType: {
            name: 'border-style',
            parse: value => HTML_BORDER_STYLE[value] || value
          }
        },
        restrict: []
      };

      const styles = mapObject(cssStyle, mapRules);

      const { dropShadow, shadowAngle, shadowBlur, shadowColor, shadowOffset } =
        cssStyle?.shadow || {};

      const rad = (-Math.PI * (shadowAngle % 360)) / 180;

      const offsetX = parseInt(shadowOffset * Math.sin(rad), 10) / 3;
      const offsetY = parseInt(shadowOffset * Math.cos(rad), 10) / 3;
      const shadowStyle = dropShadow
        ? {
            'box-shadow': `${offsetX}px ${offsetY}px ${shadowBlur}px ${shadowColor}`
          }
        : 'none';

      const { strokeLineType, strokeWidth } = cssStyle?.border || {};

      const customBorder = {
        '--display': strokeLineType === BORDER_STYLES.DOUBLE ? 'block' : 'none',
        '--width': `${Math.max(Math.floor(strokeWidth / 8), 1)}px`
      };
      return { ...styles, ...shadowStyle, ...customBorder };
    }
  },
  mounted() {
    window.addEventListener('keydown', e => {
      if (
        (!e.origin || e.origin === window.location.origin) &&
        e.key === 'Escape'
      ) {
        this.onCloseDropdown();
      }
    });
  }
};
