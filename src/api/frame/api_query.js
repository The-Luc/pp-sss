import { OBJECT_TYPE } from '@/common/constants';
import { frameMapping } from '@/common/mapping/frame';
import { FrameDetail } from '@/common/models';
import { isEmpty, isOk } from '@/common/utils';
import { get } from 'lodash';
import { graphqlRequest } from '../urql';
import { getFrameObjectQuery, getSheetFramesQuery } from './queries';

export const getSheetFramesApi = async sheetId => {
  const res = await graphqlRequest(getSheetFramesQuery, { sheetId });

  if (!isOk(res)) return [];

  const frames = get(res.data, 'sheet.digital_frames', []);

  return frames
    .sort((ff, sf) => ff.frame_order - sf.frame_order)
    .map(f => new FrameDetail(frameMapping(f)));
};

export const getFrameBackgroundApi = async frameId => {
  const res = await graphqlRequest(getFrameObjectQuery, { frameId });

  if (!isOk(res)) return {};

  const objects = get(res.data, 'digital_frame.objects', []);

  if (isEmpty(objects)) return {};

  return objects[0].type === OBJECT_TYPE.BACKGROUND ? objects[0] : {};
};
