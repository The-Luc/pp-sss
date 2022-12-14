import { mapObject, apiToBaseDate } from '@/common/utils';

import { COVER_TYPE, DELIVERY_OPTION, DEFAULT_COLOR } from '@/common/constants';

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
        name: 'totalPages',
        parse: value => value - 2 // this is because BE return pages including cover pages
      },
      number_max_pages: {
        name: 'numberMaxPages'
      },
      book_user: {
        data: {
          id: {
            name: 'bookUserId'
          },
          is_print_photo_visited: {
            name: 'isPhotoVisited'
          },
          is_digital_photo_visited: {
            name: 'isPhotoVisited'
          }
        }
      },
      print_page_numbers: {
        name: 'isNumberingOn',
        parse: value => Boolean(value)
      },
      page_number_position: {
        name: 'position'
      },
      print_theme_id: {
        name: 'themeId'
      },
      digital_theme_id: {
        name: 'themeId'
      },
      properties: {
        data: {
          font_family: {
            name: 'fontFamily'
          },
          font_size: {
            name: 'fontSize'
          },
          color: {
            name: 'color',
            parse: val => (val ? val : DEFAULT_COLOR.COLOR),
            isForce: true
          }
        }
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
          phase_one_start_date: {
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

/**
 * To convert pageInfo to a object that can save to DB
 * @param {Object} pageInfo FE pageInfo object
 * @param {Number} communityId Community id
 * @returns converted object
 */
export const pageInfoMappingToApi = (pageInfo, communityId, themeId) => {
  const { isNumberingOn, position, color, fontFamily, fontSize } = pageInfo;

  const bookParams = {
    print_page_numbers: isNumberingOn,
    page_number_position: position,
    print_theme_id: parseInt(themeId)
  };
  const properties = {
    community_id: communityId,
    color,
    font_family: fontFamily,
    font_size: fontSize
  };

  return { bookParams, properties };
};
