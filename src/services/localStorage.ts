import { ajax } from 'tools/request';
import { _warn } from 'tools/log';
import Store from 'stores';

type RecorderData = {
  recordList: any[];
  referer: string;
  prefix: any;
  storage:{
    localStorage_record:any,
    sessionStorage_record:any
  }
};
const formatUrl = url => {
  return url.split('/').slice(3).join('/');
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
        _id: '628b6d4f1fde64d672cf7769'
      })
    }).then(res => res.json());
    // debugger;

    const recordList = data[0].snapshot.data;
    const {storage,location,fetchRecord} = data[0]
    const {startUrl,originUrl} = location
    console.log(location)
    const referer = '';
    if (!recordList || recordList.length === 0) {
      throw new Error('RecordData is empty 🧐');
    }

    const firstRecord = recordList.shift();

    if (firstRecord.type !== 'snapshot') {
      throw new Error('Record list not start with a page snapshot');
    }

    // const initialPageSnapshot = firstRecord.snapshot;
    if(!fetchRecord[formatUrl(startUrl)]){
      alert('no fetchRecord[startLocation.url]')
    }
    const initialPageSnapshot = fetchRecord[formatUrl(startUrl)].shift().content;

    const { scroll, resize, t } = firstRecord;

    const initialScroll = { t, ...scroll, type: 'scroll' };
    const initialResize = { t, ...resize, type: 'resize' };

    recordList.unshift(initialScroll);
    recordList.unshift(initialResize);

    const resultData = {
      recordList,
      referer,
      initialPageSnapshot,
      prefix:'/',
      storage
    };

    Store.loadRecorderData(recordList, referer);

    return resultData;
  } catch (err) {
    _warn(err);

    Store.setError(true);

    return Promise.reject(err.toString());
  }
};
