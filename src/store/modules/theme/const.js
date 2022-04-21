import { BaseObject } from '@/common/models';
import { prefixObjectValue } from '@/common/utils';

export const MODULE_NAME = 'theme';

class GetterClass extends BaseObject {
  GET_PRINT_THEMES = 'getPrintThemes';
  GET_PRINT_LAYOUTS_BY_THEME_ID = 'getPrintLayouts';
  GET_PRINT_LAYOUT_BY_TYPE = 'getPrintLayoutByType';
  GET_DIGITAL_LAYOUT_BY_TYPE = 'getDigitalLayoutByType';
  GET_DIGITAL_THEMES = 'getDigitalThemes';
  GET_DIGITAL_LAYOUTS_BY_THEME_ID = 'getDigitalLayouts';

  constructor(props) {
    super(props);
    this._set(props);
  }
}

const _GETTERS = new GetterClass();

export const GETTERS = new GetterClass(
  prefixObjectValue(_GETTERS, MODULE_NAME)
);

class ActionClass extends BaseObject {
  GET_PRINT_THEMES = 'getPrintThemes';

  constructor(props) {
    super(props);
    this._set(props);
  }
}
const _ACTIONS = new ActionClass();

export const ACTIONS = new ActionClass(
  prefixObjectValue(_ACTIONS, MODULE_NAME)
);

class MutationClass extends BaseObject {
  PRINT_THEMES = 'printThemes';
  PRINT_LAYOUTS = 'printLayouts';
  DIGITAL_THEMES = 'digitalThemes';
  DIGITAL_LAYOUTS = 'digitalLayouts';

  constructor(props) {
    super(props);
    this._set(props);
  }
}

const _MUTATES = new MutationClass();

export const MUTATES = new MutationClass(
  prefixObjectValue(_MUTATES, MODULE_NAME)
);

export default {
  _GETTERS,
  _ACTIONS,
  _MUTATES
};
