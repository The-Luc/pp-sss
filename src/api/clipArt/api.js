import { isEmpty } from '@/common/utils';
import { graphqlRequest } from '../axios';
import { getClipArts, getClipartCategories } from './queries';

const loadClipArts = async id => {
  const clipArtList = await graphqlRequest(getClipArts, { id });
  return clipArtList.category.cliparts;
};

const loadClipArtCategories = async () => {
  const clipArtCategories = await graphqlRequest(getClipartCategories);
  return clipArtCategories.categories;
};

const searchClipArtApi = async input => {
  const clipArt = isEmpty(input) ? [] : [];
  return Promise.resolve(clipArt);
};

export const clipArtService = {
  loadClipArts,
  loadClipArtCategories,
  searchClipArtApi
};
