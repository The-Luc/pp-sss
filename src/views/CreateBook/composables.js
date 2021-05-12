import { ref, onMounted, watch } from '@vue/composition-api';

// import bookService from "@/api/book";

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
