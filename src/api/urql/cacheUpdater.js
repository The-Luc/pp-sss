import { EDITION } from '@/common/constants';
import { get } from 'lodash';
import { managerQuery } from '../book/queries';
import { getSheetFramesQuery } from '../frame/queries';
import {
  getPrintSettingsQuery,
  getDigitalSettingsQuery,
  portraitFoldersSelectedQuery,
  sheetPortraitQuery
} from '../portrait/queries';
import { digitalWorkspaceQuery, printWorkspaceQuery } from '../sheet/queries';
import { getFavoriteLayoutsQuery } from '../user/queries';
import { getPresetColorPickerQuery } from '../util/queries';
import {
  getUserDigitalLayoutsQuery,
  getUserLayoutsQuery
} from '../layout/queries';
import { getUserTextStyleQuery } from '../text/queries';
import { getUserImageStyleQuery } from '../image/queries';
import {
  getAlbumCategoryQuery,
  getCommunityAlbumsQuery,
  getInProjectAssetsQuery,
  getUserAlbumsQuery
} from '../media/queries';

import { getMappingSettingsQuery } from '../mapping/queries';

export const updatePortraitSettingCache = (result, args, cache) => {
  const layoutType = get(args, 'portrait_layout_setting_params.layout_type');
  const isDigital = layoutType === EDITION.PRINT.toUpperCase();
  const layout = isDigital
    ? 'print_portrait_layout_settings'
    : 'digital_portrait_layout_settings';

  const query = isDigital ? getPrintSettingsQuery : getDigitalSettingsQuery;

  cache.updateQuery(
    {
      query,
      variables: { bookId: args.book_id }
    },
    data => {
      data.book[layout].push(result.create_portrait_layout_setting);

      return data;
    }
  );
};

export const updateTemplateUserCache = (result, _, cache) => {
  const template = get(result, 'create_template_user.template', {});

  cache.updateQuery(
    {
      query: getFavoriteLayoutsQuery
    },
    data => {
      if (data) data.template_favourites.push(template);

      return data;
    }
  );
};

export const updateDeleteTemplateUser = (result, _, cache) => {
  const templateId = get(result, 'delete_template_user.template.id', null);

  cache.updateQuery(
    {
      query: getFavoriteLayoutsQuery
    },
    data => {
      if (data) {
        data.template_favourites = data.template_favourites.filter(
          template => template.id !== templateId
        );
      }
      return data;
    }
  );
};

export const updateBookCollectionCache = (result, args, cache) => {
  const collectionId = get(
    result,
    'create_books_portrait_collections.id',
    null
  );

  const bookId = args.books_portrait_collections_params.book_id;

  cache.updateQuery(
    {
      query: portraitFoldersSelectedQuery,
      variables: { bookId }
    },
    data => {
      if (data) {
        data.books_portrait_collections_by_book.push({
          portrait_collection: { id: collectionId }
        });
      }

      return data;
    }
  );
};

export const updateSheetCache = (_, args, cache) => {
  const digitalWorkspace = get(args, 'sheet_params.digital_workspace', null);
  const printWorkspace = get(args, 'sheet_params.workspace', null);

  const updateCache = (query, prefix, assets) => {
    cache.updateQuery(
      {
        query,
        variables: { id: args.sheet_id }
      },
      data => {
        if (data) data.sheet[`${prefix}workspace`][`${prefix}assets`] = assets;

        return data;
      }
    );
  };
  if (digitalWorkspace) {
    const assets = get(JSON.parse(digitalWorkspace), 'digital_assets', []);
    updateCache(digitalWorkspaceQuery, 'digital_', assets);
  }
  if (printWorkspace) {
    const assets = get(JSON.parse(printWorkspace), 'assets', []);
    updateCache(printWorkspaceQuery, '', assets);
  }
};

export const updateCreateFrame = (results, args, cache) => {
  const frame = get(results, 'create_digital_frame', null);
  const { sheet_id: sheetId } = args;

  if (!sheetId) return;

  cache.updateQuery(
    {
      query: getSheetFramesQuery,
      variables: { sheetId }
    },
    data => {
      if (data)
        data.sheet.digital_frames.push({
          ...frame,
          __typename: 'DigitalFrame'
        });

      return data;
    }
  );
};

export const updateDeleteFrame = (_, args, cache) => {
  const frameId = args.digital_frame_id;

  const sheetIds = cache
    .inspectFields({ __typename: 'Query' })
    .filter(cacheInfo => cacheInfo.fieldName === 'sheet')
    .map(cacheInfo => String(cacheInfo.arguments.id));

  const bookId = cache
    .inspectFields({ __typename: 'Query' })
    .filter(cacheInfo => cacheInfo.fieldName === 'book')
    .map(cacheInfo => String(cacheInfo.arguments.id));

  cache.invalidate({ __typename: 'Query' }, 'book', { id: bookId[0] });

  let sheetId;
  let counter = 0;

  // getting sheet id
  while (!sheetId && counter < sheetIds.length) {
    const queryData = cache.readQuery({
      query: getSheetFramesQuery,
      variables: { sheetId: sheetIds[counter] }
    });
    if (!queryData) return;

    const sheet = queryData.sheet;

    const isIncludedTheFrame = sheet.digital_frames.some(
      frame => frame.id === frameId
    );
    if (isIncludedTheFrame) sheetId = sheet.id;
    counter++;
  }

  if (!frameId || !sheetId) return;

  cache.updateQuery(
    {
      query: getSheetFramesQuery,
      variables: { sheetId: sheetId }
    },
    data => {
      if (data) {
        // remove deleted frames
        data.sheet.digital_frames = data.sheet.digital_frames.filter(
          f => f.id !== frameId
        );

        // remove the last transition
        data.sheet.digital_transitions.pop();
      }
      return data;
    }
  );
};

export const updateCreateSheet = (results, args, cache) => {
  const sheetId = get(results, 'create_sheet.id', null);
  const bookId = get(results, 'create_sheet.book.id', null);
  const { book_section_id, sheet_params } = args;

  if (!sheetId || !bookId || !book_section_id) return;

  cache.updateQuery(
    {
      query: managerQuery,
      variables: { bookId }
    },
    data => {
      if (data) {
        const sectionIndex = data.book.book_sections.findIndex(
          section => section.id === book_section_id
        );
        data.book.book_sections[sectionIndex].sheets.push({
          ...sheet_params,
          id: sheetId,
          __typename: 'Sheet'
        });
      }

      return data;
    }
  );
};

const getIndexOfSheetSection = (sections, sheetId) => {
  let sheetIndex = null;
  const sectionIndex = sections.findIndex(section =>
    section.sheets.some((sheet, idx) => {
      if (sheet.id === sheetId) {
        sheetIndex = idx;
        return true;
      }
    })
  );

  return { sheetIndex, sectionIndex };
};

export const updateDeleteSheet = (results, _, cache) => {
  const sheetId = get(results, 'delete_sheet.id', null);
  const bookId = get(results, 'delete_sheet.book.id', null);

  if (!sheetId || !bookId) return;

  cache.updateQuery(
    {
      query: managerQuery,
      variables: { bookId }
    },
    data => {
      if (data) {
        const sections = data.book.book_sections;

        const { sheetIndex, sectionIndex } = getIndexOfSheetSection(
          sections,
          sheetId
        );

        sections[sectionIndex].sheets.splice(sheetIndex, 1);
      }

      return data;
    }
  );
  // reset in project mark
  cache.invalidate({ __typename: 'Query' }, 'book', { id: bookId });
};

export const updateDeleteSection = (results, _, cache) => {
  const sectionId = get(results, 'delete_book_section.id', null);
  const bookId = get(results, 'delete_book_section.book.id', null);

  if (!sectionId || !bookId) return;

  cache.updateQuery(
    {
      query: managerQuery,
      variables: { bookId }
    },
    data => {
      if (data) {
        const sections = data.book.book_sections;

        const sectionIndex = sections.findIndex(
          section => section.id === sectionId
        );

        sections.splice(sectionIndex, 1);
      }
      return data;
    }
  );

  // reset in project mark
  cache.invalidate({ __typename: 'Query' }, 'book', { id: bookId });
};

export const updateCreateSection = (results, args, cache) => {
  const sectionParams = get(results, 'create_book_section', null);
  const { book_id: bookId } = args;

  if (!bookId) return;

  cache.updateQuery(
    {
      query: managerQuery,
      variables: { bookId }
    },
    data => {
      if (data) {
        data.book.book_sections.push({
          ...sectionParams
        });
      }
      return data;
    }
  );
};

export const updateSectionCache = (results, args, cache) => {
  const sectionId = get(results, 'update_book_section.id', null);
  const bookId = get(results, 'update_book_section.book.id', null);

  const isUpdateAssignee = Object.prototype.hasOwnProperty.call(
    args.book_section_params,
    'assigned_user_id'
  );

  if (!sectionId || !bookId || !isUpdateAssignee) return;

  cache.invalidate({ __typename: 'Query' }, 'book', { id: bookId });
};

export const moveSheetCache = (results, args, cache) => {
  const bookId = get(results, 'move_sheet[0].book.id');
  const {
    target_book_section_id: sectionId,
    target_placement: targetIndex,
    sheet_id: sheetId
  } = args;

  if (!bookId || !sheetId) return;
  cache.updateQuery(
    {
      query: managerQuery,
      variables: { bookId }
    },
    data => {
      // remove sheet from its original section
      const sections = data.book.book_sections;

      const { sheetIndex, sectionIndex } = getIndexOfSheetSection(
        sections,
        sheetId
      );

      const targetSheet = sections[sectionIndex].sheets.splice(
        sheetIndex,
        1
      )[0];

      // insert sheet to target section
      const targetSectionIndex = sections.findIndex(
        section => section.id === sectionId
      );
      sections[targetSectionIndex].sheets.splice(targetIndex, 0, targetSheet);

      return data;
    }
  );
};

export const updatePresentColorPickerCache = (_, args, cache) => {
  const colors = args.colors;

  cache.updateQuery({ query: getPresetColorPickerQuery }, data => {
    data.user_favourite_colors = colors;
    return data;
  });
};

export const createUserCustomPrintTemplate = (results, args, cache) => {
  const layout = get(results, 'create_user_custom_print_template', null);
  const saveType = args?.save_type;
  const saveTypeMapping = {
    PAGE: 'single_page',
    SHEET: 'double_page'
  };

  const category = saveTypeMapping[saveType];
  cache.updateQuery({ query: getUserLayoutsQuery }, data => {
    if (data && layout) data[category].push(layout);

    return data;
  });
};

export const createUserCustomDigitalTemplateCache = (results, _, cache) => {
  const layout = get(results, 'create_user_custom_digital_template');

  cache.updateQuery({ query: getUserDigitalLayoutsQuery }, data => {
    if (data && layout) data.user_saved_digital_layouts.push(layout);

    return data;
  });
};

export const updateTextStyle = (results, _, cache) => {
  const style = get(results, 'create_text_style');
  cache.updateQuery({ query: getUserTextStyleQuery }, data => {
    if (data && style) data.user_text_styles.push(style);

    return data;
  });
};

export const updateImageStyle = (res, _, cache) => {
  const style = get(res, 'create_image_style');
  cache.updateQuery({ query: getUserImageStyleQuery }, data => {
    if (data && style) data.user_image_styles.push(style);

    return data;
  });
};

export const createContainerCache = (res, args, cache) => {
  const album = res.create_container;
  const communityId = get(args, 'container_params.community_id');

  if (!album) return;

  // update user containers query
  cache.updateQuery({ query: getUserAlbumsQuery }, data => {
    if (data) {
      data.user_containers.push(album);
    }

    return data;
  });

  // update category
  cache.updateQuery(
    { query: getAlbumCategoryQuery, variables: { communityId } },
    data => {
      if (data) {
        const category = {
          id: album.id,
          body: album.body,
          __typename: album.__typename
        };
        data.community_containers?.unshift(category);
      }

      return data;
    }
  );

  // update community containers query
  cache.updateQuery(
    {
      query: getCommunityAlbumsQuery,
      variables: { communityId, page: 1 }
    },
    data => {
      if (data) data.community_containers?.unshift(album);

      return data;
    }
  );
};

export const updateProjectMappingConfig = (res, args, cache) => {
  const config = res.update_project_mapping_configuration;
  const bookId = args.book_id;

  cache.updateQuery(
    { query: getMappingSettingsQuery, variables: { bookId } },
    data => {
      if (data && !data.book.project_mapping_configuration) {
        data.book.project_mapping_configuration = config;
      }
      return data;
    }
  );
};

/**
 * To delete all cache relate to layout
 */
export const invalidateLayoutMapping = (_, __, cache) => {
  cache.invalidate({ __typename: 'Query' }, 'themes');
  cache.invalidate({ __typename: 'Query' }, 'template_favourites');
  cache.invalidate({ __typename: 'Query' }, 'user_saved_digital_layouts');
  cache.invalidate({ __typename: 'Query' }, 'user_saved_print_layouts', {
    layout_type: 'SINGLE_PAGE'
  });
  cache.invalidate({ __typename: 'Query' }, 'user_saved_print_layouts', {
    layout_type: 'DOUBLE_PAGE'
  });

  const themeIds = cache
    .inspectFields({ __typename: 'Query' })
    .filter(cacheInfo => cacheInfo.fieldName === 'theme')
    .map(cacheInfo => String(cacheInfo.arguments.id));

  const pairIds = cache
    .inspectFields({ __typename: 'Query' })
    .filter(cacheInfo => cacheInfo.fieldName === 'template_book_pair')
    .map(cacheInfo => String(cacheInfo.arguments.id));

  themeIds.forEach(id =>
    cache.invalidate({ __typename: 'Query' }, 'theme', { id })
  );

  pairIds.forEach(id =>
    cache.invalidate({ __typename: 'Query' }, 'template_book_pair', { id })
  );
};

export const deletePortraitSheet = (res, _, cache) => {
  const sheetId = get(res, 'delete_portrait_sheet_setting.sheet.id');

  if (!sheetId) return;

  cache.updateQuery(
    {
      query: sheetPortraitQuery,
      variables: { sheetId }
    },
    data => {
      if (data) {
        data.sheet.portrait_sheet_setting = null;
      }
      return data;
    }
  );
};

export const createPortraitSheet = (res, args, cache) => {
  const sheetId = get(args, 'sheet_id');
  const setting = get(res, 'create_portrait_sheet_setting', null);

  cache.updateQuery(
    {
      query: sheetPortraitQuery,
      variables: { sheetId }
    },
    data => {
      if (data) {
        data.sheet.portrait_sheet_setting = setting;
      }
      return data;
    }
  );
};

export const createAssetCache = (res, args, cache) => {
  const projectId = get(args, 'designable_id');
  const type = get(args, 'designable_type');
  const assetParams = get(res, 'create_asset_designable');
  const bookId = cache
    .inspectFields({ __typename: 'Query' })
    .filter(cacheInfo => cacheInfo.fieldName === 'book')
    .map(cacheInfo => String(cacheInfo.arguments.id));
  cache.updateQuery(
    {
      query: getInProjectAssetsQuery,
      variables: { bookId: bookId[0], projectId, type }
    },
    data => {
      if (data) {
        data.book.in_project_assets.push({ ...assetParams });
      }
      return data;
    }
  );
};

export const deleteAssetCache = (_, args, cache) => {
  const projectId = get(args, 'designable_id');
  const type = get(args, 'designable_type');
  const bookId = cache
    .inspectFields({ __typename: 'Query' })
    .filter(cacheInfo => cacheInfo.fieldName === 'book')
    .map(cacheInfo => String(cacheInfo.arguments.id));
  const asset_id = get(args, 'asset_id');
  cache.updateQuery(
    {
      query: getInProjectAssetsQuery,
      variables: { bookId: bookId[0], projectId: +projectId, type }
    },
    data => {
      if (data) {
        const in_project_assets = data.book.in_project_assets;

        const assetIndex = in_project_assets.findIndex(
          asset => asset.id === asset_id
        );

        in_project_assets.splice(assetIndex, 1);
      }
      return data;
    }
  );
};
