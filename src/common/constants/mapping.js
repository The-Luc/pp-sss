export const MAPPING_OBJECT_STATE_UNASSIGNED = 'UNASSIGNED';
export const MAPPING_OBJECT_STATE_MAPPING = 'MAPPING';
export const MAPPING_OBJECT_STATE_MAPPED = 'MAPPED';

export const OVERLAY_BACKGROUND_COLOR = 'rgba(88,89,91,0.4)';
export const CUSTOM_MAPPING_ICON_COLOR = '#58595B';

export const PRIMARY_FORMAT_TYPES = {
  PRINT: {
    name: 'Print',
    value: 'PRINT'
  },
  DIGITAL: {
    name: 'Digital',
    value: 'DIGITAL'
  }
};

export const MAPPING_TYPES = {
  LAYOUT: {
    name: 'Layout Mapping',
    value: 'LAYOUT'
  },
  CUSTOM: {
    name: 'Custom Mapping',
    value: 'CUSTOM'
  },
  PORTRAIT: {
    name: 'Portrait Mapping',
    value: 'PORTRAIT'
  }
};

export const CUSTOM_CHANGE_MODAL = 'custom_change_modal';
export const CONTENT_CHANGE_MODAL = 'content_change_modal';
export const CONTENT_VIDEO_CHANGE_MODAL = 'content_video_change_modal';
export const CUSTOM_MAPPING_MODAL = 'custom_mapping_modal'; // for editing or adding or deleting new object on secondary editor in custom mapping mode
export const CONTENT_MAPPING_MODAL = 'content_mapping_modal_';
// this value is calculated based on prototype
// element dimensions growth 1.8 when they are synced from print => digital
// element dimensions reduce 1.8 when they are synced from digital => print
export const CUSTOM_MAPPING_CONVERT_RATIO = 1.8;
