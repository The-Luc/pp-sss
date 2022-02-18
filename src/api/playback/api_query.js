import { get } from 'lodash';
import {
  getPlaybackDataFromFrames,
  handleMappingFrameAndTransition,
  isOk,
  sortByProperty
} from '@/common/utils';
import { graphqlRequest } from '../urql';
import { getPlaybackDataQuery } from './queries';
import { getSuccessWithData } from '@/common/models';

export const getPlaybackDataApi = async bookId => {
  const res = await graphqlRequest(getPlaybackDataQuery, { bookId });
  if (!isOk(res)) return [];

  const sections = get(res, 'data.book.book_sections', []);
  const framePlayback = [];

  const sortedSections = sortByProperty(sections, 'section_order');

  sortedSections.forEach(section => {
    const sortedSheets = sortByProperty(section.sheets, 'sheet_order');

    sortedSheets.forEach(sheet => {
      const { frames, transitions } = handleMappingFrameAndTransition(sheet);
      framePlayback.push({
        screenId: sheet.id,
        data: getPlaybackDataFromFrames(frames, transitions)
      });
    });
  });
  return getSuccessWithData(framePlayback);
};
