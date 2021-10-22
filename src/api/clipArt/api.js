import { isEmpty } from '@/common/utils';
import { graphqlRequest } from '../axios';
import { getClipArts, getClipartCategories } from './queries';

const loadClipArts = async id => {
  const res = await graphqlRequest(getClipArts, { id });
  return res.data.category.cliparts;
};

const loadClipArtCategories = async () => {
  const res = await graphqlRequest(getClipartCategories);
  return res.data.categories;
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
