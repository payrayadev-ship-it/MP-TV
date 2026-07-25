import { getState } from '../lib/store';
import { RunningText } from '../types';

export const runningTextRepository = {
  getAll(): RunningText[] {
    return getState().runningTexts;
  },

  create(item: RunningText): RunningText {
    const store = getState();
    if (item.active) {
      store.runningTexts.forEach((rt) => (rt.active = false));
    }
    store.runningTexts.unshift(item);
    return item;
  },
};
