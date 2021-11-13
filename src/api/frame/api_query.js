import { FrameDetail } from '@/common/models';
import { mapObject, isOk } from '@/common/utils';
import { get } from 'lodash';
import { graphqlRequest } from '../urql';
import { getSheetFramesQuery } from './queries';

export const getSheetFramesApi = async sheetId => {
  const res = await graphqlRequest(getSheetFramesQuery, { sheetId });

  if (!isOk(res)) return [];

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
