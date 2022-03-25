import { h } from "vue";
import { ElNotification, ElMessage } from "element-plus";

function notification(title, message, isSuccess) {
  ElNotification({
    title,
    message: h("i", { style: "color: teal" }, message),
    type: isSuccess ? "success" : undefined
  });
}

function notificationError(title, message) {
  ElNotification({
    title,
    message: h("i", { style: "color: teal" }, message),
    type: "error"
  });
}

function errorPopup(message) {
  ElMessage.error(message);
}

function successPopup(message) {
  ElMessage.success(message);
}

export { notification, notificationError, successPopup, errorPopup };
