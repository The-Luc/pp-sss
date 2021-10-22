import { STATUS } from '@/common/constants';
import { FrameDetail } from '@/common/models';
import { mapObject } from '@/common/utils';
import { get } from 'lodash';
import { graphqlRequest } from '../axios';
import { getSheetFramesQuery } from './queries';

export const getSheetFrames = async sheetId => {
  const res = await graphqlRequest(getSheetFramesQuery, { sheetId });

  if (res.status === STATUS.NG) return [];

  const frames = get(res.data, 'sheet.digital_frames', []);

  const mapRules = {
    data: {
      id: {
        name: 'id',
        parse: value => value
      },
      frame_delay: {
        name: 'delay'
      },
      from_layout: {
        name: 'fromLayout'
      },
      is_visited: {
        name: 'isVisited'
      },
      preview_image_url: {
        name: 'previewImageUrl'
      }
    },
    restrict: []
  };

  return frames.map(f => new FrameDetail(mapObject(f, mapRules)));
};
