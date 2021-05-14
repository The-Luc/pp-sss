import { ref, onMounted, watch } from '@vue/composition-api';

import albumService from '@/api/album';

export const useYearBookInformation = yearbook => {
  const book = ref({});
  const fetchYearbook = async () => {
    book.value = 123;
  };
  onMounted(fetchYearbook);
  watch(yearbook, fetchYearbook);
  return {
    book,
    fetchYearbook
  };
};

export const useUpdateAlbum = () => {
  const updateAlbum = async (data, onSettled) => {
    if (!data.albumId) {
      return;
    }
    const { data: response, status } = await albumService.updateAlbum(data);
    onSettled(response, status !== 200);
  };

  return {
    updateAlbum
  };
};
