import { EDITION } from '@/common/constants';
import { get } from 'lodash';
import { getSheetFramesQuery } from '../frame/queries';
import {
  getPrintSettingsQuery,
  getDigitalSettingsQuery
} from '../portrait/queries';
import { digitalWorkspaceQuery, printWorkspaceQuery } from '../sheet/queries';
import { getFavoriteLayoutsQuery } from '../user/queries';

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
      if (!data) return;

      data.sheet.digital_frames = data.sheet.digital_frames.filter(
        f => f.id !== frameId
      );
      return data;
    }
  );
};
