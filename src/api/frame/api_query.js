import { OBJECT_TYPE } from '@/common/constants';
import { transitionMapping } from '@/common/mapping';
import { frameMapping } from '@/common/mapping/frame';
import { FrameDetail, Transition } from '@/common/models';
import {
  isEmpty,
  isOk,
  sortByProperty,
  sortFrameByOrder
} from '@/common/utils';
import { get } from 'lodash';
import { graphqlRequest } from '../urql';
import { getFrameObjectQuery, getSheetFramesQuery } from './queries';

export const getFramesAndTransitionsApi = async sheetId => {
  const res = await graphqlRequest(getSheetFramesQuery, { sheetId });

  if (!isOk(res)) return [];

  const frames = get(res.data, 'sheet.digital_frames', []);
  const sortedFrames = sortFrameByOrder(frames);

  const transitions = get(res.data, 'sheet.digital_transitions', []);
  const sortedTransitions = sortByProperty(transitions, 'transition_order');

  return {
    frames: sortedFrames.map(f => new FrameDetail(frameMapping(f))),
    transitions: sortedTransitions.map(
      t => new Transition(transitionMapping(t))
    )
  };
};

export const getFrameBackgroundApi = async frameId => {
  const res = await graphqlRequest(getFrameObjectQuery, { frameId });

  if (!isOk(res)) return {};

  const objects = get(res.data, 'digital_frame.objects', []);

  if (isEmpty(objects)) return {};

  return objects[0].type === OBJECT_TYPE.BACKGROUND ? objects[0] : {};
};
