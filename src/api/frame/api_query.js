import { transitionMapping } from '@/common/mapping';
import {
  convertObjectPxToInch,
  handleMappingFrameAndTransition,
  isEmpty,
  isOk,
  sortByProperty
} from '@/common/utils';
import { get } from 'lodash';
import { sheetTransitionQuery } from '../playback/queries';
import { graphqlRequest } from '../urql';
import { getFrameObjectQuery, getSheetFramesQuery } from './queries';
import { Transition } from '@/common/models';

export const getFramesAndTransitionsApi = async sheetId => {
  const res = await graphqlRequest(getSheetFramesQuery, {
    sheetId: String(sheetId)
  });

  if (!isOk(res)) return [];

  return handleMappingFrameAndTransition(res.data.sheet);
};

export const getFrameObjectsApi = async frameId => {
  const res = await graphqlRequest(getFrameObjectQuery, { frameId });

  if (!isOk(res)) return {};

  const objects = get(res.data, 'digital_frame.objects', []);

  convertObjectPxToInch(objects);

  return isEmpty(objects) ? {} : objects;
};

export const sheetTransitionApi = async (sheetId, ignoreCache) => {
  const res = await graphqlRequest(
    sheetTransitionQuery,
    { sheetId },
    false,
    ignoreCache
  );

  if (!isOk(res)) return;

  const transitions = res.data.sheet.digital_transitions;

  const sortedTransitions = sortByProperty(transitions, 'transition_order');

  return sortedTransitions.map(t => new Transition(transitionMapping(t)));
};
