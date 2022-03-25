import { OBJECT_TYPE, IMAGE_LOCAL } from '@/common/constants';
import { ImageElementObject } from '@/common/models/element';
import { cloneDeep } from 'lodash';

export const modifyUrl = originalUrl => {
  if (originalUrl.includes('data:image')) return originalUrl;

  return `${originalUrl.split('?')[0]}?`;
};

export const convertToHttp = url => {
  const encodingUrlPrefix = 'https://fms.production.s3.amazonaws.com';
  if (!url.includes(encodingUrlPrefix)) return url;

  return 'http' + url.substring(5);
};

export const removeMediaContentWhenCreateThumbnail = objects => {
  const clonedObjects = cloneDeep(objects);

  clonedObjects.forEach((o, idx) => {
    if (!o) return;

    // if it's a video => convert it to Image Object
    if (o.type === OBJECT_TYPE.VIDEO) {
      const newObject = new ImageElementObject(o);
      newObject.imageUrl = IMAGE_LOCAL.PLACE_HOLDER;
      newObject.type = OBJECT_TYPE.IMAGE;
      newObject.zoomLevel = null;
      newObject.hasImage = false;
      clonedObjects[idx] = newObject;
      return;
    }
    if (o.type === OBJECT_TYPE.IMAGE || o.type === OBJECT_TYPE.PORTRAIT_IMAGE) {
      o.imageUrl = IMAGE_LOCAL.PLACE_HOLDER;
      o.hasImage = false;
      o.zoomLevel = null;
      o.originalUrl = '';
    }
  });

  return clonedObjects;
};
