export const recoverStorage = ({localStorage_record,sessionStorage_record})=>{
    for(const k in localStorage_record){
        localStorage.setItem(k,localStorage_record[k])
    }
    for(const k in sessionStorage_record){
        localStorage.setItem(k,sessionStorage_record[k])
    }
}