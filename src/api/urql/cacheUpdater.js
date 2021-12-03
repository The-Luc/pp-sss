import { EDITION } from '@/common/constants';
import { get } from 'lodash';
import {
  getPrintSettingsQuery,
  getDigitalSettingsQuery
} from '../portrait/queries';
import { digitalWorkspaceQuery } from '../sheet/queries';
import { getFavoriteLayoutsQuery } from '../user/queries';

import { isEmpty } from '@/common/utils';

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
  const digitalWorkspace = get(args, 'sheet_params.digital_workspace', {});

  if (!isEmpty(digitalWorkspace)) {
    const assets = get(JSON.parse(digitalWorkspace), 'digital_assets', []);

    cache.updateQuery(
      {
        query: digitalWorkspaceQuery,
        variables: { id: args.sheet_id }
      },
      data => {
        if (!data) return {};

        data.sheet.digital_workspace.digital_assets = assets;

        return data;
      }
    );
  }
};
