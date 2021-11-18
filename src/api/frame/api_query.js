import { frameMapping } from '@/common/mapping/frame';
import { FrameDetail } from '@/common/models';
import { isOk } from '@/common/utils';
import { get } from 'lodash';
import { graphqlRequest } from '../urql';
import { getSheetFramesQuery } from './queries';

export const getSheetFramesApi = async sheetId => {
  const res = await graphqlRequest(getSheetFramesQuery, { sheetId });

  if (!isOk(res)) return [];

  const frames = get(res.data, 'sheet.digital_frames', []);

  return frames.map(f => new FrameDetail(frameMapping(f)));
};
