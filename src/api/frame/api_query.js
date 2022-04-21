import {
  convertObjectPxToInch,
  handleMappingFrameAndTransition,
  isEmpty,
  isOk
} from '@/common/utils';
import { get } from 'lodash';
import { graphqlRequest } from '../urql';
import { getFrameObjectQuery, getSheetFramesQuery } from './queries';

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
