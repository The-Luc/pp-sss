import Layouts from '@/components/ToolPopovers/Layout';
import PpButton from '@/components/Buttons/Button';
import CommonModal from '@/components/Modals/CommonModal';
import MappingPreview from './MappingPreview';

import {
  useModal,
  useGetterTheme,
  useCustomLayout,
  useActionLayout,
  useGetLayouts,
  useGetDigitalLayouts
} from '@/hooks';
import { getThemesApi } from '@/api/theme';
import {
  DIGITAL_LAYOUT_TYPES,
  PRINT_LAYOUT_TYPES,
  SAVED_AND_FAVORITES_TYPE
} from '@/common/constants';
import { isEmpty, isHalfSheet } from '@/common/utils';

export default {
  components: { Layouts, CommonModal, PpButton, MappingPreview },
  setup() {
    const { toggleModal } = useModal();
    const { getDefaultThemeId } = useGetterTheme();
    const { getCustom, getCustomDigitalLayout } = useCustomLayout();
    const { getFavoriteLayouts } = useActionLayout();
    const {
      getPrintLayouts: fetchPrintLayouts,
      getDigitalLayouts: fetchDigitalLayouts,
      getPrintLayoutByType,
      getDigitalLayoutByType,
      getAssortedLayouts
    } = useGetLayouts();

    const { getDigitalLayoutElements } = useGetDigitalLayouts();
    return {
      toggleModal,
      getDefaultThemeId,
      getCustom,
      getCustomDigitalLayout,
      getFavoriteLayouts,
      fetchPrintLayouts,
      fetchDigitalLayouts,
      getDigitalLayoutElements,
      getPrintLayoutByType,
      getDigitalLayoutByType,
      getAssortedLayouts
    };
  },
  data() {
    const printText = {
      title: 'Step 1: Select a Print Layout',
      optionTitle: 'Layout Type:'
    };
    const digitalText = {
      title: 'Step 2: Select a Digital Layout',
      optionTitle: 'Screen Type:'
    };
    return {
      printText,
      digitalText,
      printLayoutSelected: null,
      digitalLayoutSelected: null,
      printLayouts: [],
      digitalLayouts: [],
      extraPrintLayouts: [],
      extraDigitalLayouts: [],
      customPrintLayouts: [],
      customDigitalLayouts: [],
      favoritePrintLayouts: [],
      favoriteDigitalLayouts: [],
      themesOptions: [],
      printLayoutTypes: [],
      printThemeSelected: {},
      printDefaultTheme: null,
      printLayoutTypeSelected: {},
      digitalLayoutTypes: [],
      digitalThemeSelected: {},
      digitalDefaultTheme: null,
      digitalLayoutTypeSelected: {},
      isDigitalOpaque: true,
      isPrintFooterHidden: false,
      isDigitalFooterHidden: false,
      isPrintPreviewDisplayed: false,
      isDigitalPreviewDisplayed: false,
      isStepThreeDisplayed: false,
      isConfirmDisplayed: false,
      assortedLayouts: []
    };
  },
  computed: {
    isDisablePrintTheme() {
      return this.isSaveAndFavoriteType(this.printLayoutTypeSelected);
    },
    isDisableDigitalTheme() {
      return this.isSaveAndFavoriteType(this.digitalLayoutTypeSelected);
    },
    printLayoutId() {
      return this.printLayoutSelected?.id || null;
    },
    digitalLayoutId() {
      return this.digitalLayoutSelected?.id || null;
    },
    activeTab() {
      return isHalfSheet ? 1 : 0;
    }
  },
  async mounted() {
    const fetchData = [this.initData(), this.getAssorted()];
    await Promise.all(fetchData);

    this.printLayoutTypes = this.handleLayoutTypes();
    this.digitalLayoutTypes = this.handleLayoutTypes();

    this.updateLayoutTypes();

    this.printLayoutTypeSelected = this.printLayoutTypes[0];
    this.digitalLayoutTypeSelected = this.digitalLayoutTypes[0];

    this.printThemeSelected = this.themesOptions.find(
      t => t.id === this.printDefaultTheme
    );
    this.digitalThemeSelected = this.themesOptions.find(
      t => t.id === this.digitalDefaultTheme
    );

    await Promise.all([this.getPrintLayouts(), this.getDigitalLayouts()]);

    this.handleStepOne();
  },
  methods: {
    onConfirmPrintLayout(layout) {
      if (isEmpty(layout) || layout.mappings) return;

      this.printLayoutSelected = layout;

      this.handleStepTwo();
    },
    async onConfirmDigitalLayout(layout) {
      if (isEmpty(layout) || layout.mappings) return;

      const layoutEle = await this.getDigitalLayoutElements(layout.id);

      this.digitalLayoutSelected = layoutEle;
      this.handleStepThree();
    },
    async onChangePrintTheme(theme) {
      this.printThemeSelected = theme;
      this.printLayoutTypeSelected = this.printLayoutTypes[0];
      this.getPrintLayouts();
    },
    async onChangeDigitalTheme(theme) {
      this.digitalThemeSelected = theme;
      this.digitalLayoutTypeSelected = this.digitalLayoutTypes[0];
      this.getDigitalLayouts();
    },
    onChangePrintLayoutType(type) {
      this.printLayoutTypeSelected = isEmpty(type)
        ? { sub: '' }
        : { value: type.value, sub: type.sub?.value };

      this.getPrintLayouts();
    },
    onChangeDigitalLayoutType(type) {
      this.digitalLayoutTypeSelected = type;
      this.getDigitalLayouts();
    },
    onConfirm() {
      this.$emit('onConfirm', {
        printLayout: this.printLayoutSelected,
        digitalLayout: this.digitalLayoutSelected
      });
    },
    onCancel() {
      this.$emit('onCancel');
    },
    updateLayoutTypes() {
      if (
        !isEmpty(this.customPrintLayouts) ||
        !isEmpty(this.favoritePrintLayouts)
      )
        this.printLayoutTypes.splice(
          this.printLayoutTypes.length - 1,
          0,
          SAVED_AND_FAVORITES_TYPE
        );

      if (!isEmpty(this.customDigitalLayouts))
        this.digitalLayoutTypes.splice(
          this.digitalLayoutTypes.length - 1,
          0,
          SAVED_AND_FAVORITES_TYPE
        );
    },
    async initData() {
      this.themesOptions = await getThemesApi();

      const theme = await this.getDefaultThemeId();
      this.digitalDefaultTheme = theme.digitalDefaultTheme;
      this.printDefaultTheme = theme.printDefaultTheme;

      this.customPrintLayouts = await this.getCustom();
      this.customDigitalLayouts = await this.getCustomDigitalLayout();

      this.favoritePrintLayouts = await this.getFavoriteLayouts();
    },
    async getPrintLayouts() {
      const { value: typeValue, sub: subValue } = this.printLayoutTypeSelected;

      const isAssorted = typeValue === PRINT_LAYOUT_TYPES.ASSORTED.value;

      if (isAssorted) {
        this.printLayouts =
          this.assortedLayouts.find(l => l.id === subValue)?.templates || [];
        return;
      }

      this.printLayouts = await this.fetchPrintLayouts(
        this.printThemeSelected?.id,
        this.printLayoutTypeSelected?.value
      );

      this.extraPrintLayouts = await this.getPrintLayoutByType(
        this.printThemeSelected?.id,
        this.printLayoutTypeSelected?.value
      );
    },
    async getDigitalLayouts() {
      const { value: typeValue } = this.digitalLayoutTypeSelected;

      const isAssorted = typeValue === DIGITAL_LAYOUT_TYPES.ASSORTED.value;

      if (isAssorted) {
        this.digitalLayouts = [];
        return;
      }

      this.digitalLayouts = await this.fetchDigitalLayouts(
        this.digitalThemeSelected?.id,
        this.digitalLayoutTypeSelected?.value,
        false
      );

      this.extraDigitalLayouts = await this.getDigitalLayoutByType(
        this.digitalThemeSelected?.id,
        this.digitalLayoutTypeSelected?.value
      );
    },
    /**
     * Get assoreted layout
     */
    async getAssorted() {
      this.assortedLayouts = await this.getAssortedLayouts();
    },
    handleStepOne() {
      this.isDigitalOpaque = true;
      this.isDigitalFooterHidden = true;
      this.isPrintFooterHidden = false;
      this.isPrintPreviewDisplayed = false;
      this.isDigitalPreviewDisplayed = false;
      this.isStepThreeDisplayed = false;

      if (this.isConfirmDisplayed) {
        this.handleEditPrint();
      }

      this.isConfirmDisplayed = false;
    },
    handleStepTwo() {
      this.isDigitalOpaque = false;
      this.isPrintFooterHidden = true;
      this.isPrintPreviewDisplayed = true;

      if (this.isDigitalPreviewDisplayed) {
        this.handleStepThree();
        return;
      }
      this.isDigitalFooterHidden = false;
      this.isStepThreeDisplayed = false;
      this.isConfirmDisplayed = false;
    },
    handleStepThree() {
      this.isPrintFooterHidden = true;
      this.isConfirmDisplayed = true;
      this.isDigitalFooterHidden = true;
      this.isDigitalPreviewDisplayed = true;
      this.isStepThreeDisplayed = true;
    },
    handleEditPrint() {
      this.isDigitalPreviewDisplayed = true;
    },
    isSaveAndFavoriteType(type) {
      return type.value === SAVED_AND_FAVORITES_TYPE.value;
    },
    editPrintSelection() {
      this.handleStepOne();
      this.getPrintLayouts();
    },
    editDigitalSelection() {
      this.isDigitalPreviewDisplayed = false;
      this.handleStepTwo();
      this.getDigitalLayouts();
    },
    handleLayoutTypes() {
      const types = Object.values(PRINT_LAYOUT_TYPES).map(lt => ({
        ...lt,
        subItems: []
      }));

      const assortedType = types.filter(
        l => l.value === PRINT_LAYOUT_TYPES.ASSORTED.value
      )[0];

      assortedType.subItems = this.assortedLayouts.map(({ id, name }) => ({
        id,
        name,
        value: id,
        shortName: `Assorted: ${name}`
      }));

      return types;
    }
  }
};
