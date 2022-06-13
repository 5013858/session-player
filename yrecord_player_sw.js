const y_record_server_host = 'http://localhost:7001'
const whiteList = ['http://localhost:8080/','https://fonts.googleapis.com/icon?family=Material+Icons','http://localhost:8080/main.js','https://fonts.gstatic.com/s/materialicons/v128/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2','']
const formatUrl = url => {
    return url.split('/').slice(3).join('/');
  };
const fetchEvent = ({ url, method = 'POST', body = {} }) => {
    return fetch(url, {
      method,
      headers: {
        'user-agent': 'vscode-restclient',
        'content-type': 'application/json',
        authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.dGVzdA.GfxRk-CtH6rXPrQstXkm8pkjEhPFO1h5kFEBciCZN48',
      },
      body: JSON.stringify({ _id: '628b6d4f1fde64d672cf7769', ...body }),
    });
};
  
let fetchRecordMap = {};
self.addEventListener('install',  (event) => {
    event.waitUntil((async()=>{
        fetchRecordMap = (await (await fetchEvent({url:'http://localhost:7001/records/getFetchRecord'})).json()).data
        console.log('install',fetchRecordMap)
    })())
});
self.onfetch = async function (event) {
    // console.log(event.request.url)
        console.log(fetchRecordMap)
        event.respondWith((async () => {
        const response = await fetch(event.request);
        const headersJson = Object.fromEntries(response.headers.entries());
        const contentType = headersJson['content-type']||'';
        const requestUrl = formatUrl(event.request.url)
        if(event.request.url.startsWith(y_record_server_host)){
            return response;
        }

        if (!(contentType.includes('application/json'))){
            return response;
        }
        try {
            console.log('first',requestUrl)
            if (requestUrl in fetchRecordMap && fetchRecordMap[requestUrl].length>0) {
                const record = fetchRecordMap[requestUrl].shift();
                console.log(record)
                const newHeader = new Headers(record.headers);
                const initResponse = { headers: newHeader };
                const temp = new Response(record.content, initResponse);
                console.log('temp yes')
                return temp;
            }else{
                throw new Error(`未被识别的网络请求: ${requestUrl}`)
                // return response;
            }
        } catch (e) {
        console.log(e);
    }})())
  };