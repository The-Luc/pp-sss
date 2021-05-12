export const getters = {
    getSections: state => {
        return state.book.sections.sort((firstEl, secondEl) => {
            return firstEl.order - secondEl.order;
        })
    }
};
