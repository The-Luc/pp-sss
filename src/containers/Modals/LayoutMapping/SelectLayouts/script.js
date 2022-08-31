import Layouts from '@/components/ToolPopovers/Layout';
import PpButton from '@/components/Buttons/Button';
import CommonModal from '@/components/Modals/CommonModal';
import MappingPreview from './MappingPreview';
import ConfirmAction from '@/containers/Modals/ConfirmAction';

import {
  useModal,
  useGetterTheme,
  useCustomLayout,
  useActionLayout,
  useGetLayouts,
  useGetDigitalLayouts,
  useLayoutElements,
  useMappingTemplate
} from '@/hooks';
import { getThemesApi } from '@/api/theme';
import {
  ASSORTED_TYPE_VALUE,
  CUSTOM_LAYOUT_TYPE,
  DIGITAL_LAYOUT_TYPES,
  PRINT_LAYOUT_TYPES,
  SAVED_AND_FAVORITES_TYPE
} from '@/common/constants';
import { isEmpty, isHalfSheet } from '@/common/utils';
import { get } from 'lodash';

export default {
  components: { Layouts, CommonModal, PpButton, MappingPreview, ConfirmAction },
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
    const { getLayoutElements } = useLayoutElements();
    const { deleteTemplateMapping } = useMappingTemplate();

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
      getAssortedLayouts,
      getLayoutElements,
      deleteTemplateMapping
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
      digitalThemesOptions: [],
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
      assortedLayouts: [],
      waitingLayout: null,
      isDeleteMapModalDisplayed: false,
      isReassignModalDisplayed: false
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
    this.digitalThemeSelected = this.digitalThemesOptions.find(
      t => t.id === this.digitalDefaultTheme
    );

    await Promise.all([this.getPrintLayouts(), this.getDigitalLayouts()]);

    this.handleStepOne();
  },
  methods: {
    isSaveAndFavoriteType(type) {
      return (
        type.value === CUSTOM_LAYOUT_TYPE || type.value === ASSORTED_TYPE_VALUE
      );
    },
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
    /**
     *  Trigger when user hit confirm button
     *  switch to mapping element modal
     */
    onConfirm(print, digital, config) {
      const printLayout = print || this.printLayoutSelected;
      const digitalLayout = digital || this.digitalLayoutSelected;

      this.$emit('onConfirm', {
        printLayout,
        digitalLayout,
        config
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
      this.digitalThemesOptions = await getThemesApi(true);

      const theme = await this.getDefaultThemeId();
      this.digitalDefaultTheme = theme.digitalDefaultTheme;
      this.printDefaultTheme = theme.printDefaultTheme;

      this.customPrintLayouts = await this.getCustom();
      this.customDigitalLayouts = await this.getCustomDigitalLayout();

      this.favoritePrintLayouts = await this.getFavoriteLayouts();
    },
    /**
     * Get digital layouts
     */
    async getPrintLayouts() {
      const { value: typeValue, sub: subValue } = this.printLayoutTypeSelected;

      const isAssorted = typeValue === PRINT_LAYOUT_TYPES.ASSORTED.value;

      if (isAssorted) {
        this.assortedLayouts = await this.getAssortedLayouts();

        this.printLayouts =
          this.assortedLayouts.find(l => l.id === subValue)?.templates || [];
        return;
      }

      this.printLayouts = await this.fetchPrintLayouts(
        this.printThemeSelected?.id,
        this.printLayoutTypeSelected?.value
      );

      // if layout type is ALL => do not load  extra layouts of other themes
      if (typeValue === PRINT_LAYOUT_TYPES.ALL.value) return;

      this.extraPrintLayouts = await this.getPrintLayoutByType(
        this.printThemeSelected?.id,
        this.printLayoutTypeSelected?.value
      );
    },
    /**
     * Get digital layouts
     */
    async getDigitalLayouts() {
      const { value: typeValue } = this.digitalLayoutTypeSelected;

      const isAssorted = typeValue === DIGITAL_LAYOUT_TYPES.ASSORTED.value;

      if (isAssorted) {
        this.digitalLayouts = [];
        return;
      }

      this.digitalLayouts = await this.fetchDigitalLayouts(
        this.digitalThemeSelected?.id,
        this.digitalLayoutTypeSelected?.value
      );

      // if layout type is ALL => do not load  extra layouts of other themes
      if (typeValue === DIGITAL_LAYOUT_TYPES.ALL.value) return;

      this.extraDigitalLayouts = await this.getDigitalLayoutByType(
        this.digitalThemeSelected?.id,
        this.digitalLayoutTypeSelected?.value
      );
    },
    /**
     * Get assoreted layout from server
     */
    async getAssorted() {
      this.assortedLayouts = await this.getAssortedLayouts();
    },
    /**
     * Step: Select print layout
     */
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
    /**
     * Step: Select digital layout
     */
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
    /**
     * Show confirm button, and preview thumbnails of print and digital layouts
     */
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
    /**
     * Handle logic when user click on edit selection on Print layout
     */
    editPrintSelection() {
      this.handleStepOne();
      this.getPrintLayouts();
    },
    /**
     * Handle logic when user click on edit selection on Digital layout
     */
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
    },
    /**
     * Selecte print and digital layouts and
     * switch to mapping element modal
     *
     * @param {Object} layout layout data
     */
    async onEditMap(layout) {
      const printLayoutId = layout.id;
      const digitalLayoutId = get(layout, 'mappings.theOtherLayoutId');
      const config = layout.mappings;

      const printObjects = await this.getLayoutElements(printLayoutId);
      const printLayout = { ...layout, objects: printObjects };
      const digitalLayout = await this.getDigitalLayoutElements(
        digitalLayoutId
      );

      this.onConfirm(printLayout, digitalLayout, config);
    },
    async onReassignMap() {
      this.printLayoutSelected = this.waitingLayout;

      // delete mappings
      await this.onDeleteMap();

      this.onCloseReassignModal();
      this.handleStepTwo();
    },
    /**
     * Call api to delete mappings
     *
     * @param {Object} layout layout data
     */
    async onDeleteMap() {
      this.onCloseDeleteConfirmModal();

      await this.deleteTemplateMapping(this.waitingLayout.mappings);

      // remove overlay on UI of digital template
      const digitalLayout = [
        ...this.digitalLayouts,
        ...this.extraDigitalLayouts
      ].find(lo => lo.id === this.waitingLayout.mappings.theOtherLayoutId);

      if (digitalLayout?.mappings) digitalLayout.mappings = null;

      // remove overlay on UI of print template
      this.waitingLayout.mappings = null;
      this.waitingLayout = null;
    },
    /**
     * Show confirm model when use hit delete mapping button
     */
    showDeleteMapModal(layout) {
      this.waitingLayout = layout;

      this.isDeleteMapModalDisplayed = true;
    },
    /**
     * Hide delete confirm model
     */
    onCloseDeleteConfirmModal() {
      this.isDeleteMapModalDisplayed = false;
    },
    /**
     * Show reassign confirm model when use hit reassign mapping button
     */
    showReassignConfirmModal(layout) {
      this.waitingLayout = layout;

      this.isReassignModalDisplayed = true;
    },
    /**
     * Hide reassign confirm model
     */
    onCloseReassignModal() {
      this.isReassignModalDisplayed = false;
    }
  }
};
