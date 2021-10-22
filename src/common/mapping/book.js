import { mapObject, apiToBaseDate } from '@/common/utils';

import { COVER_TYPE, DELIVERY_OPTION } from '@/common/constants';

/**
 * Convert book data from API to data of Book Model
 *
 * @param   {Object}  book  book data from API
 * @returns {Object}        book data use by model
 */
export const bookMapping = book => {
  const mapRules = {
    data: {
      community_id: {
        name: 'communityId'
      },
      created_at: {
        name: 'createdDate',
        parse: value => apiToBaseDate(value)
      },
      total_pages: {
        name: 'totalPage'
      },
      number_max_pages: {
        name: 'numberMaxPages'
      },
      yearbook_spec: {
        data: {
          cover_option: {
            name: 'coverOption',
            parse: value => COVER_TYPE[value]
          },
          delivery_option: {
            name: 'deliveryOption',
            parse: value => DELIVERY_OPTION[value]
          },
          copies_sold: {
            name: 'booksSold'
          },
          fundraising_earned: {
            name: 'fundraisingEarned'
          },
          estimated_quantity_high: {
            name: 'estimatedQuantity',
            parse: value => ({ max: value })
          },
          estimated_quantity_low: {
            name: 'estimatedQuantity',
            parse: value => ({ min: value })
          },
          delivery_date: {
            name: 'deliveryDate',
            parse: value => apiToBaseDate(value)
          },
          release_date: {
            name: 'releaseDate',
            parse: value => apiToBaseDate(value)
          },
          sale_date: {
            name: 'saleDate',
            parse: value => apiToBaseDate(value)
          }
        }
      }
    },
    restrict: ['book_sections']
  };

  return mapObject(book, mapRules);
};
