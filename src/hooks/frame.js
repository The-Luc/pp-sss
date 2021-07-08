import { useMutations, useGetters, useActions } from 'vuex-composition-helpers';
// TODO: delete if dont use
import { GETTERS } from '@/store/modules/digital/const';
import { isEmpty } from '@/common/utils';

/**
 * Return data to render frame thumbnail
 */

export const useFrameThumbnail = () => {
  // frames is an array containing all the frames of current screen
  const { frames } = useGetters({
    frames: GETTERS.GET_FRAMES_WIDTH_IDS
  });

  console.log('hook');
  console.log(frames);
  // currently the previewUrls are used as thumnbnail images
  const frameThumbnail = frames.map
    ? frames.map((f, idx) => {
        return {
          images: f.previewImageUr, // use preview image for new, revise later
          id: idx,
          fromLayout: f.fromLayout
        };
      })
    : [];

  return { frames, frameThumbnail };
};
