// import Properties from '@/components/Properties/BoxProperties';
// import TabPropertiesMenu from '@/containers/TabPropertiesMenu';
// import ArrangeContent from '@/components/Arrange';
// export default {
//   components: {
//     Properties,
//     TabPropertiesMenu,
//     ArrangeContent
//   },
//   computed: {
//     rotateValue() {
//       return 0;
//     },
//     isConstrain() {
//       return true;
//     },
//     position() {
//       return {
//         x: 9.4,
//         y: 7.12
//       };
//     },
//     size() {
//       return {
//         width: 3.32,
//         height: 4.51
//       };
//     },
//     minSize() {
//       return 0;
//     },
//     maxSize() {
//       return 60;
//     },
//     minPosition() {
//       return -100;
//     },
//     maxPosition() {
//       return 100;
//     }
//   },
//   methods: {
//     /**
//      * Close color picker (if opening) when change tab
//      */
//     onChangeTabMenu(data) {
//       this.setColorPickerData({
//         tabActive: data
//       });
//     },
//     /**
//      * Handle update flip for Image
//      * @param {String} actionName action name
//      */
//     changeFlip(actionName) {},
//     /**
//      * Handle update size, position or rotate for Image
//      * @param {Object} object object containing the value of update size, position or rotate
//      */
//     onChange(object) {},
//     /**
//      * Handle constrain proportions for Image
//      * @param {Boolean} val
//      */
//     onChangeConstrain(val) {}
//   }
// };
