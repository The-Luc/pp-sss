import { cloneDeep, differenceWith } from 'lodash';

import store from '@/store';

import { isEmpty, hasOwnProperty } from '@/common/utils';

import {
  GETTERS as PRINT_GETTERS,
  MUTATES as PRINT_MUTATES
} from '@/store/modules/print/const';
import {
  GETTERS as DIGITAL_GETTERS,
  MUTATES as DIGITAL_MUTATES
} from '@/store/modules/digital/const';

import { EDITION, STATUS } from '@/common/constants';

class StoreTracker {
  _trackList = [];
  _maxStep = 1;
  _currentIndex = -1;

  _edition = null;
  _unwatch = null;

  _isSwitching = false;

  /**
   * @param {Object} options  option of store tracker
   */
  constructor(options) {
    if (!hasOwnProperty(options, 'edition')) throw 'Edition must be set';

    this._edition = options.edition;

    if (hasOwnProperty(options, 'maxStep')) this._maxStep = options.maxStep;
  }

  _getStoreData = state => {
    return {
      objects: cloneDeep(state[this._edition].objects),
      objectIds: cloneDeep(state[this._edition].objectIds),
      background: cloneDeep(state[this._edition].background)
    };
  };

  _setDataToTrackList = dataToKeep => {
    if (this._currentIndex >= this._maxStep) {
      this._trackList.splice(0, 1);

      this._currentIndex--;
    }

    const data = [
      cloneDeep(dataToKeep.background.left),
      cloneDeep(dataToKeep.background.right),
      ...dataToKeep.objectIds.map(id => ({ ...dataToKeep.objects[id], id }))
    ];

    this._trackList.splice(
      ++this._currentIndex,
      this._trackList.length - this._currentIndex,
      data
    );
  };

  _setDataToStore = async () => {
    const MUTATES =
      this._edition === EDITION.PRINT ? PRINT_MUTATES : DIGITAL_MUTATES;

    const data = cloneDeep(this._trackList[this._currentIndex]);

    const backgrounds = { left: cloneDeep(data[0]), right: cloneDeep(data[1]) };

    data.splice(0, 2);

    await Promise.all([
      store.commit(MUTATES.SET_BACKGROUNDS, { backgrounds }),
      store.commit(MUTATES.SET_OBJECTS, { objectList: data })
    ]);
  };

  _switchData = async (isValid, nextIndex) => {
    if (!isValid) return { status: STATUS.NG };

    const GETTERS =
      this._edition === EDITION.PRINT ? PRINT_GETTERS : DIGITAL_GETTERS;

    this._isSwitching = true;

    const oldIndex = this._currentIndex;

    this._currentIndex += nextIndex;

    await this._setDataToStore();

    const objects = store.getters[GETTERS.SHEET_LAYOUT];

    const oldData = cloneDeep(this._trackList[oldIndex]);
    const currentData = cloneDeep(this._trackList[this._currentIndex]);

    oldData.splice(0, 2);
    currentData.splice(0, 2);

    const changedIds = differenceWith(
      oldData.length >= currentData.length ? oldData : currentData,
      oldData.length <= currentData.length ? oldData : currentData,
      (obj1, obj2) => obj1.id === obj2.id
    ).map(({ id }) => id);

    this._isSwitching = false;

    return { status: STATUS.OK, objects, changedIds };
  };

  startTracking = () => {
    this._unwatch = store.watch(
      state => {
        return this._getStoreData(state);
      },
      (newval, oldval) => {
        if (this._isSwitching) return;

        if (JSON.stringify(newval) === JSON.stringify(oldval)) return;

        this._setDataToTrackList(newval);
      },
      {
        deep: true
      }
    );
  };

  stopTracking = () => {
    if (!isEmpty(this._unwatch)) this._unwatch();

    this._trackList = [];
    this._currentIndex = -1;
  };

  restartTracking = () => {
    this.stopTracking();

    this.startTracking();

    this._setDataToTrackList(this._getStoreData(store.state));
  };

  backToPrevious = async () => {
    return await this._switchData(this._currentIndex > 0, -1);
  };

  moveToNext = async () => {
    return await this._switchData(
      this._currentIndex < this._trackList.length - 1,
      1
    );
  };
}

export default StoreTracker;
