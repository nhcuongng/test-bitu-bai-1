export const KEY_CODE = {
  ENTER: 13,
  CTRL: 17,
  CMD: 91,
};

export const isCtrlOrCmdKey = (event) => event.metaKey || event.ctrlKey;

export const isEnterKey = (event) => event.keyCode === KEY_CODE.ENTER;

export const isCtrlEnterKey = (event) => isEnterKey(event) && isCtrlOrCmdKey(event);

export const TOPIC = "mytopic1"
export const LOCAL_STORAGE_KEY = 'userId'