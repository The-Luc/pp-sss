const textStyleDefault = {
  name: 'Default',
  id: 'default',
  style: {
    fontFamily: 'Arial',
    fontSize: 60,
    isBold: false,
    isItalic: false,
    isUnderline: false,
    color: '#000000',
    alignment: {
      horizontal: 'left',
      vertical: 'top'
    },
    textCase: 'capitalize',
    letterSpacing: 0,
    lineSpacing: 0,
    lineHeight: 1.2,
    flip: {
      horizontal: false,
      vertical: false
    },
    border: {
      showBorder: false,
      stroke: '#000000',
      strokeDashArray: [],
      strokeLineType: 'solid',
      strokeWidth: 0
    },
    shadow: {
      dropShadow: false,
      shadowAngle: 270,
      shadowBlur: 5,
      shadowColor: '#000000',
      shadowOffset: 2,
      shadowOpacity: 0.5
    }
  }
};

const textStyles = [
  {
    name: 'Default',
    id: 'default',
    style: {
      fontFamily: 'Arial',
      fontSize: 60,
      isBold: false,
      isItalic: false,
      isUnderline: false,
      color: '#000000',
      alignment: {
        horizontal: 'left',
        vertical: 'top'
      },
      textCase: 'capitalize',
      letterSpacing: 0,
      lineSpacing: 0,
      lineHeight: 1.2,
      flip: {
        horizontal: false,
        vertical: false
      },
      border: {
        showBorder: false,
        stroke: '#000000',
        strokeDashArray: [],
        strokeLineType: 'solid',
        strokeWidth: 0
      },
      shadow: {
        dropShadow: false,
        shadowAngle: 270,
        shadowBlur: 5,
        shadowColor: 'rgba(0, 0, 0, 0.5',
        shadowOffset: 2,
        shadowOpacity: 0.5
      }
    }
  },
  {
    name: 'Cover Headline',
    id: 'coverHeadline',
    style: {
      fontFamily: 'Time News Roman',
      fontSize: 90,
      isBold: true,
      isItalic: true,
      isUnderline: false,
      color: '#00FF00',
      alignment: {
        horizontal: 'left',
        vertical: 'top'
      },
      textCase: 'capitalize',
      letterSpacing: 0,
      lineSpacing: 0,
      lineHeight: 1.2,
      flip: {
        horizontal: false,
        vertical: false
      },
      border: {
        showBorder: false,
        stroke: '#000000',
        strokeDashArray: [],
        strokeLineType: 'solid',
        strokeWidth: 0
      },
      shadow: {
        dropShadow: false,
        shadowAngle: 270,
        shadowBlur: 5,
        shadowColor: 'rgba(0, 0, 0, 0.5',
        shadowOffset: 2,
        shadowOpacity: 0.5
      }
    }
  },
  {
    name: 'Page Headline',
    id: 'pageHeadline',
    style: {
      fontFamily: 'Arial',
      fontSize: 35,
      isBold: false,
      isItalic: false,
      isUnderline: true,
      color: '#FF0000',
      alignment: {
        horizontal: 'left',
        vertical: 'top'
      },
      textCase: 'capitalize',
      letterSpacing: 0,
      lineHeight: 1.2,
      flip: {
        horizontal: false,
        vertical: false
      },
      border: {
        showBorder: false,
        stroke: '#000000',
        strokeDashArray: [],
        strokeLineType: 'solid',
        strokeWidth: 0
      },
      shadow: {
        dropShadow: false,
        shadowAngle: 270,
        shadowBlur: 5,
        shadowColor: 'rgba(0, 0, 0, 0.5',
        shadowOffset: 2,
        shadowOpacity: 0.5
      }
    }
  }
];

export default [...textStyleDefault, ...textStyles];
