import { cloneDeep } from 'lodash';

import store from '@/store';

import {
  isEmpty,
  hasOwnProperty,
  getDiffBetweenArray,
  mergeArray
} from '@/common/utils';

import { GETTERS as APP_GETTERS } from '@/store/modules/app/const';

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

  _updateDataCallback = null;

  /**
   * @param {Object} options  option of store tracker
   */
  constructor(options) {
    this._edition = store.getters[APP_GETTERS.ACTIVE_EDITION];

    if (hasOwnProperty(options, 'maxStep')) this._maxStep = options.maxStep;

    if (hasOwnProperty(options, 'updateDataCallback')) {
      this._updateDataCallback = options.updateDataCallback;
    }
  }

  _getStoreData = state => {
    return {
      objects: cloneDeep(state[this._edition].objects),
      objectIds: cloneDeep(state[this._edition].objectIds),
      background: cloneDeep(state[this._edition].background),
      playInIds: cloneDeep(state[this._edition].playInIds),
      playOutIds: cloneDeep(state[this._edition].playOutIds)
    };
  };

  _setDataToTrackList = dataToKeep => {
    if (this._currentIndex >= this._maxStep) {
      this._trackList.splice(0, 1);

      this._currentIndex--;
    }

    const data = {
      objects: [
        cloneDeep(dataToKeep.background.left),
        cloneDeep(dataToKeep.background.right),
        ...dataToKeep.objectIds.map(id => ({ ...dataToKeep.objects[id], id }))
      ],
      playInIds: cloneDeep(dataToKeep.playInIds),
      playOutIds: cloneDeep(dataToKeep.playOutIds)
    };

    this._trackList.splice(
      ++this._currentIndex,
      this._trackList.length - this._currentIndex,
      data
    );

    if (this._updateDataCallback) this._updateDataCallback();
  };

  _setDataToStore = async () => {
    const MUTATES =
      this._edition === EDITION.PRINT ? PRINT_MUTATES : DIGITAL_MUTATES;

    const { objects: data, playInIds, playOutIds } = cloneDeep(
      this._trackList[this._currentIndex]
    );

    const backgrounds = { left: cloneDeep(data[0]), right: cloneDeep(data[1]) };

    data.splice(0, 2);

    const promises = [
      store.commit(MUTATES.SET_BACKGROUNDS, { backgrounds }),
      store.commit(MUTATES.SET_OBJECTS, { objectList: data })
    ];

    if (this._edition === EDITION.DIGITAL) {
      promises.push(
        ...[
          store.commit(DIGITAL_MUTATES.SET_PLAY_IN_IDS, { playInIds }),
          store.commit(DIGITAL_MUTATES.SET_PLAY_OUT_IDS, { playOutIds })
        ]
      );
    }
    await Promise.all(promises);
  };

  _compareObject = (obj1, obj2) => obj1.id === obj2.id;

  _getPreCurrentData = (currentData, isPrevious) => {
    if (this._currentIndex <= 0 || !isPrevious) return [];

    const { objects: data } = cloneDeep(
      this._trackList[this._currentIndex - 1]
    );

    data.splice(0, 2);

    return getDiffBetweenArray(currentData, data, this._compareObject).map(
      ({ id }) => id
    );
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

    const { objects: oldData } = cloneDeep(this._trackList[oldIndex]);
    const { objects: currentData } = cloneDeep(
      this._trackList[this._currentIndex]
    );

    oldData.splice(0, 2);
    currentData.splice(0, 2);

    const currentChangeIds = getDiffBetweenArray(
      oldData,
      currentData,
      this._compareObject
    ).map(({ id }) => id);

    const preChangeIds = this._getPreCurrentData(currentData, nextIndex < 0);

    const changedIds = mergeArray(currentChangeIds, preChangeIds);

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
    return this._switchData(this._currentIndex > 0, -1);
  };

  moveToNext = async () => {
    return this._switchData(this._currentIndex < this._trackList.length - 1, 1);
  };

  isBackAvailable = () => {
    return this._currentIndex > 0;
  };

  isNextAvailable = () => {
    return this._currentIndex < this._trackList.length - 1;
  };
}

export default StoreTracker;
