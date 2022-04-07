import Layouts from '@/components/ToolPopovers/Layout';
import PpButton from '@/components/Buttons/Button';
import CommonModal from '@/components/Modals/CommonModal';
import MappingPreview from './MappingPreview';

import {
  useModal,
  useGetterTheme,
  useCustomLayout,
  useActionLayout,
  useGetLayouts
} from '@/hooks';
import { getThemesApi } from '@/api/theme';
import {
  LAYOUT_TYPES,
  SAVED_AND_FAVORITES,
  SAVED_AND_FAVORITES_TYPE
} from '@/common/constants';
import { isEmpty } from '@/common/utils';

export default {
  components: { Layouts, CommonModal, PpButton, MappingPreview },
  setup() {
    const { toggleModal } = useModal();
    const { getDefaultThemeId } = useGetterTheme();
    const { getCustom, getCustomDigitalLayout } = useCustomLayout();
    const { getFavoriteLayouts } = useActionLayout();
    const {
      getPrintLayouts: fetchPrintLayouts,
      getDigitalLayouts: fetchDigitalLayouts
    } = useGetLayouts();

    return {
      toggleModal,
      getDefaultThemeId,
      getCustom,
      getCustomDigitalLayout,
      getFavoriteLayouts,
      fetchPrintLayouts,
      fetchDigitalLayouts
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
      isConfirmDisplayed: false
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
    }
  },
  async mounted() {
    const fetchData = [this.initData()];
    await Promise.all(fetchData);

    const layoutTypes = Object.values(LAYOUT_TYPES).map(lt => ({
      ...lt,
      subItems: []
    }));

    this.printLayoutTypes = layoutTypes;
    this.digitalLayoutTypes = layoutTypes;

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
      if (isEmpty(layout)) return;

      this.printLayoutSelected = layout;

      this.handleStepTwo();
    },
    onConfirmDigitalLayout(layout) {
      if (isEmpty(layout)) return;

      this.digitalLayoutSelected = layout;
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
        !isEmpty(this.customPrintLayouts) &&
        !isEmpty(this.favoritePrintLayouts)
      )
        this.printLayoutTypes.push(SAVED_AND_FAVORITES);

      if (!isEmpty(this.customDigitalLayouts))
        this.digitalLayoutTypes.push(SAVED_AND_FAVORITES_TYPE);
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
      const isFavorite = !isEmpty(this.printLayoutTypeSelected.sub);
      const layouts = await this.fetchPrintLayouts(
        this.printThemeSelected?.id,
        this.printLayoutTypeSelected?.value,
        isFavorite
      );

      if (isFavorite) {
        const pageType = this.printLayoutTypeSelected.sub;
        this.printLayouts = layouts.filter(
          layout => layout.pageType === pageType
        );

        return;
      }
      this.printLayouts = layouts;
    },
    async getDigitalLayouts() {
      this.digitalLayouts = await this.fetchDigitalLayouts(
        this.digitalThemeSelected?.id,
        this.digitalLayoutTypeSelected?.value,
        false
      );
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
    },
    editDigitalSelection() {
      this.isDigitalPreviewDisplayed = false;
      this.handleStepTwo();
    }
  }
};
