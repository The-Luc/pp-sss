/* eslint-disable no-console, prefer-destructuring */
import { slackHook } from "./slack";

export const log = console.log;
export const info = console.info;
export const warn = data => {
  slackHook(data);
  return console.warn(data);
};
export const error = data => {
  slackHook(data);
  return console.error(data);
};
export const alertFnc = alert;
