export const IMAGE_TYPES = ['.png', '.jpg', '.jpeg', '.gif'];

export const VIDEO_TYPES = ['.mp4', '.mpeg-4', '.mov'];

export const MEDIA_TYPES = [...IMAGE_TYPES, ...VIDEO_TYPES];

export const IMAGE_NOTIFICATION =
  'Invalid file type detected. Only files with the following extensions are allowed: PNG, JPG/JPEG, and GIF';

export const MEDIA_NOTIFICATION =
  'Invalid file type detected. Only files with the following extensions are allowed: PNG, JPG/JPEG, GIF, MP4, MPEG-4 and MOV';
