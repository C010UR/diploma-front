import { h } from "vue";
import { ElNotification, ElMessage } from "element-plus";
import errorSfx from "./assets/pack 2/error.ogg";
import notificationSfx from "./assets/pack 2/notification.ogg";

function notification(title, message, isSuccess) {
  ElNotification({
    title,
    message: h("i", { style: "color: teal" }, message),
    type: isSuccess ? "success" : undefined
  });
  const sound = new Audio(notificationSfx);
  sound.play();
}

function notificationError(title, message) {
  ElNotification({
    title,
    message: h("i", { style: "color: teal" }, message),
    type: "error"
  });
  const sound = new Audio(errorSfx);
  sound.play();
}

function errorPopup(message) {
  ElMessage({
    message,
    grouping: true,
    type: "error"
  });
  const sound = new Audio(errorSfx);
  sound.play();
}

function successPopup(message) {
  ElMessage({
    message,
    grouping: true,
    type: "success"
  });
  const sound = new Audio(notificationSfx);
  sound.play();
}

export { notification, notificationError, successPopup, errorPopup };
