import App from "./const";

export const mutations = {
  [App._MUTATES.HANDLEISDIALOG](state) {
    state.isDialog = !state.isDialog;
  }
};
