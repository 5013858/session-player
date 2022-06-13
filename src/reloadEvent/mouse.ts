// export function sendClick(x:number|undefined, y:number|undefined,domLayer):void{
//     const {contentWindow, contentDocument} = domLayer;
//     var el = contentDocument.elementFromPoint(x, y);
//     const event = new MouseEvent('click', {
//         'view': contentWindow,
//         'bubbles': true,
//         'cancelable': true
//     })
//     el.dispatchEvent(event);
// }

export function sendMouseEvents(el:HTMLElement|null, contentWindow:Window, types:string[]):void{
    if(el){
        types.forEach(type=>{
            const event = new MouseEvent(type, {
                'view': contentWindow,
                'bubbles': true,
                'cancelable': true
            })
            el.dispatchEvent(event);
        })
    }
}
