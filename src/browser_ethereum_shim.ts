export {};

declare global {
  interface Window {
    ethereum: any;
    ReactNativeWebView: any;
  }
}
window.ethereum = {
  isMetaMask: false,
  isConnected,
  on,
  once,
  off,
  addListener: on,
  removeListener: off,
  removeAllListeners,
  request,
  _resolveRequest,
  _rejectRequest,
  emit,
};
function isConnected() {
  return true;
}

type Listener = (message: any) => void;

function on(event: string, listener: Listener) {
  _getEventHandler(event).on_list.push(listener);
  return window.ethereum;
}
function once(event: string, listener: Listener) {
  _getEventHandler(event).once_list.push(listener);
  return window.ethereum;
}
function off(event: string, listener: Listener) {
  const handler = _getEventHandler(event);
  _filterInPlace(handler.on_list, (callback) => callback === listener);
  _filterInPlace(handler.once_list, (callback) => callback === listener);
  return window.ethereum;
}
function removeAllListeners(event: string) {
  const handler = _getEventHandler(event);
  handler.on_list = [];
  handler.once_list = [];
  return window.ethereum;
}
function emit(event: string, message: any) {
  const handler = _getEventHandler(event);
  const { once_list, on_list } = handler;
  handler.once_list = [];
  on_list.forEach((callback) => callback(message));
  once_list.forEach((callback) => callback(message));
}

type Executor = {
  resolve: (result: any) => void;
  reject: (error: any) => void;
};
let g_requestId = 1;
const g_executorMap = new Map<number, Executor>();
function request(args: any) {
  return new Promise((resolve, reject) => {
    const requestId = g_requestId++;
    try {
      g_executorMap.set(requestId, {
        resolve,
        reject,
      });
      const obj = {
        requestId,
        args,
      };
      const obj_s = JSON.stringify(obj);
      window.ReactNativeWebView.postMessage(obj_s);
    } catch (e) {
      _rejectRequest(requestId, e);
    }
  });
}
function _resolveRequest(requestId: number, result: any) {
  const executor = g_executorMap.get(requestId);
  if (executor) {
    g_executorMap.delete(requestId);
    executor.resolve(result);
  }
}
function _rejectRequest(requestId: number, result: any) {
  const executor = g_executorMap.get(requestId);
  if (executor) {
    g_executorMap.delete(requestId);
    executor.reject(result);
  }
}
type Handler = {
  on_list: Listener[];
  once_list: Listener[];
};
const g_eventHandlerMap = new Map<string, Handler>();
function _getEventHandler(event: string): Handler {
  let ret = g_eventHandlerMap.get(event);
  if (!ret) {
    ret = {
      on_list: [],
      once_list: [],
    };
    g_eventHandlerMap.set(event, ret);
  }
  return ret;
}
function _filterInPlace(array: any[], callback: (a: any, b: any) => boolean) {
  for (let i = array.length - 1; i >= 0; i--) {
    if (!callback(array[i], i)) {
      array.splice(i, 1);
    }
  }
}
