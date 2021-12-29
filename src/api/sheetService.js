import { getSuccessWithData } from '@/common/models';
import { getPlaybackDataFromFrames, isEmpty } from '@/common/utils';

export const getPlaybackDataApi = bookId => {
  bookId; // TODO: will use with API

  return new Promise(resolve => {
    const bookSectionsFrames = [];

    window.data.book.sections.forEach(section => {
      section.sheets.forEach(({ digitalData, id }) => {
        const { frames, transitions } = digitalData;

        if (isEmpty(frames)) return;

        bookSectionsFrames.push({
          screenId: `${id}`,
          data: getPlaybackDataFromFrames(frames, transitions)
        });
      });
    });

    resolve(getSuccessWithData(bookSectionsFrames));
  });
};

export default {
  getPlaybackData: getPlaybackDataApi
};
