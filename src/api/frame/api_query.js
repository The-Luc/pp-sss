import { OBJECT_TYPE } from '@/common/constants';
import { handleMappingFrameAndTransition, isEmpty, isOk } from '@/common/utils';
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

export const getFrameBackgroundApi = async frameId => {
  const res = await graphqlRequest(getFrameObjectQuery, { frameId });

  if (!isOk(res)) return {};

  const objects = get(res.data, 'digital_frame.objects', []);

  if (isEmpty(objects)) return {};

  return objects[0].type === OBJECT_TYPE.BACKGROUND ? objects[0] : {};
};
