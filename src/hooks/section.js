import bookService from '@/api/book';

export const useMutationSection = () => {
  const updateSection = async (bookId, sectionId, body) => {
    const { data, isSuccess } = await bookService.updateSection(
      bookId,
      sectionId,
      body
    );
    return {
      data,
      isSuccess
    };
  };
  return {
    updateSection
  };
};
