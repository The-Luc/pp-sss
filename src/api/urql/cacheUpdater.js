import { EDITION } from '@/common/constants';
import { get } from 'lodash';
import { managerQuery } from '../book/queries';
import { getSheetFramesQuery } from '../frame/queries';
import {
  getPrintSettingsQuery,
  getDigitalSettingsQuery
} from '../portrait/queries';
import { digitalWorkspaceQuery, printWorkspaceQuery } from '../sheet/queries';
import { getFavoriteLayoutsQuery } from '../user/queries';
import { portraitFoldersSelectedQuery } from '../portrait/queries';

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

export const updateTemplateUserCache = (result, args, cache) => {
  const template = get(result, 'create_template_user.template', {});

  cache.updateQuery(
    {
      query: getFavoriteLayoutsQuery
    },
    data => {
      if (!data) return null;

      data.template_favourites.push(template);
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
      if (!data) return null;

      data.books_portrait_collections_by_book.push({
        portrait_collection: { id: collectionId }
      });
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
        if (!data) return {};

        data.sheet[`${prefix}workspace`][`${prefix}assets`] = assets;

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
      if (!data) return data;

      data.sheet.digital_frames.push({ ...frame, __typename: 'DigitalFrame' });
      return data;
    }
  );
};

export const updateDeleteFrame = (results, args, cache) => {
  const frameId = args.digital_frame_id;
  const sheetId = get(results, 'delete_digital_frame.sheets[0].id', null);

  if (!frameId || !sheetId) return;

  cache.updateQuery(
    {
      query: getSheetFramesQuery,
      variables: { sheetId }
    },
    data => {
      if (!data) return data;

      data.sheet.digital_frames = data.sheet.digital_frames.filter(
        f => f.id !== frameId
      );
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
      if (!data) return data;
      const sectionIndex = data.book.book_sections.findIndex(
        section => section.id === book_section_id
      );
      data.book.book_sections[sectionIndex].sheets.push({
        ...sheet_params,
        id: sheetId,
        __typename: 'Sheet'
      });

      return data;
    }
  );
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
      if (!data) return data;

      const sections = data.book.book_sections;

      let sheetIndex = null;
      const sectionIndex = sections.findIndex(section =>
        section.sheets.some((sheet, idx) => {
          if (sheet.id === sheetId) {
            sheetIndex = idx;
            return true;
          }
        })
      );
      sections[sectionIndex].sheets.splice(sheetIndex, 1);
      return data;
    }
  );
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
      if (!data) return data;
      const sections = data.book.book_sections;

      const sectionIndex = sections.findIndex(
        section => section.id === sectionId
      );

      sections.splice(sectionIndex, 1);
      return data;
    }
  );
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
      if (!data) return data;

      data.book.book_sections.push({
        ...sectionParams
      });

      return data;
    }
  );
};

export const updateSectionCache = (results, args, cache) => {
  const defaultAssignee = { id: -1, __typename: 'User' };
  const assignedUser = get(results, 'update_book_section.assigned_user', null);

  const sectionId = get(results, 'update_book_section.id', null);
  const bookId = get(results, 'update_book_section.book.id', null);

  if (!sectionId || !bookId) return;

  cache.updateQuery(
    {
      query: managerQuery,
      variables: { bookId }
    },
    data => {
      // handle assigned_user
      if (
        Object.prototype.hasOwnProperty.call(
          args.book_section_params,
          'assigned_user_id'
        )
      ) {
        const index = data.book.book_sections.findIndex(
          s => s.id === sectionId
        );
        data.book.book_sections[index].assigned_user =
          assignedUser || defaultAssignee;
      }
      return data;
    }
  );
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

      let sheetIndex = null;
      const sectionIndex = sections.findIndex(section =>
        section.sheets.some((sheet, idx) => {
          if (sheet.id === sheetId) {
            sheetIndex = idx;
            return true;
          }
        })
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
