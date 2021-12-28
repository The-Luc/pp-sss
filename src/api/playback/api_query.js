import { get } from 'lodash';
import {
  getPlaybackDataFromFrames,
  handleMappingFrameAndTransition,
  isOk
} from '@/common/utils';
import { graphqlRequest } from '../urql';
import { getPlaybackDataQuery } from './queries';
import { getSuccessWithData } from '@/common/models';

export const getPlaybackDataApi = async bookId => {
  const res = await graphqlRequest(getPlaybackDataQuery, { bookId });
  if (!isOk(res)) return [];

  const sections = get(res, 'data.book.book_sections', []);

  const framePlayback = [];
  sections.forEach(section => {
    section.sheets.forEach(sheet => {
      const { frames, transitions } = handleMappingFrameAndTransition(sheet);
      framePlayback.push({
        screenId: sheet.id,
        data: getPlaybackDataFromFrames(frames, transitions)
      });
    });
  });
  return getSuccessWithData(framePlayback);
};
