export const UnFocus = {
  methods: {
    unFocus: function() {
      const tmp = document.createElement('input');
      document.body.appendChild(tmp);
      tmp.focus();
      document.body.removeChild(tmp);
    }
  }
};
