import { ajax } from 'tools/request';
import { _warn } from 'tools/log';
import Store from 'stores';

type RecorderData = {
  recordList: any[];
  referer: string;
};

export const getRecorderData = async (): Promise<RecorderData> => {
  try {
    // const { recordList, referer } = JSON.parse(localStorage.getItem('recorderData')! || '{}') as RecorderData;
    const { data } = await fetch('http://localhost:7001/records/get', {
      method: 'POST',
      headers: {
        'user-agent': 'vscode-restclient',
        'content-type': 'application/json',
        authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.dGVzdA.GfxRk-CtH6rXPrQstXkm8pkjEhPFO1h5kFEBciCZN48'
      },
      body: JSON.stringify({
        _id: '6262688b3b2c6b11db9752ec'
      })
    }).then(res => res.json());
    const recordList = data[0].snapshot.data;
    const referer = '';
    if (!recordList || recordList.length === 0) {
      throw new Error('RecordData is empty 🧐');
    }

    const firstRecord = recordList.shift();

    if (firstRecord.type !== 'snapshot') {
      throw new Error('Record list not start with a page snapshot');
    }

    const initialPageSnapshot = firstRecord.snapshot;

    const { scroll, resize, t } = firstRecord;

    const initialScroll = { t, ...scroll, type: 'scroll' };
    const initialResize = { t, ...resize, type: 'resize' };

    recordList.unshift(initialScroll);
    recordList.unshift(initialResize);

    const resultData = {
      recordList,
      referer,
      initialPageSnapshot
    };

    Store.loadRecorderData(recordList, referer);

    return resultData;
  } catch (err) {
    _warn(err);

    Store.setError(true);

    return Promise.reject(err.toString());
  }
};
