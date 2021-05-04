import Vue from "vue";

export const Notification = ({
  group = "foo",
  type = "success",
  duration = 1000,
  animation = "top right",
  title = "Success Data",
  text = "Success!!!"
}) => {
  return Vue.notify({
    group,
    title,
    text,
    type,
    duration,
    animation
  });
};
