import { useGetters } from 'vuex-composition-helpers';

import { GETTERS as BOOK_GETTERS } from '@/store/modules/book/const';

export const useGanttChart = () => {
  const {
    eventDates,
    totalDayToShow,
    totalMonthToShow,
    saleDateFromBeginning,
    releaseDateFromBeginning,
    deliveryDateFromBeginning
  } = useGetters({
    eventDates: BOOK_GETTERS.BOOK_DATES,
    totalDayToShow: BOOK_GETTERS.TOTAL_DAYS_SHOW_ON_CHART,
    totalMonthToShow: BOOK_GETTERS.TOTAL_MONTH_SHOW_ON_CHART,
    saleDateFromBeginning: BOOK_GETTERS.SALE_DATE_FROM_BEGINNING,
    releaseDateFromBeginning: BOOK_GETTERS.RELEASE_DATE_FROM_BEGINNING,
    deliveryDateFromBeginning: BOOK_GETTERS.DELIVERY_DATE_FROM_BEGINNING
  });

  return {
    eventDates,
    totalDayToShow,
    totalMonthToShow,
    saleDateFromBeginning,
    releaseDateFromBeginning,
    deliveryDateFromBeginning
  };
};
