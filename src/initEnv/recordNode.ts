export const RECORDER_ID: string = 'recorder-id'
export const element2recorderId = new Map();
export const recorderId2element = new Map();
let id:number = 0
const mark = (ele, id): void =>{
    ele.setAttribute(RECORDER_ID, id)
}
const newId = (): number => {
    id += 1
    return id
  }
const buffer = (ele): void => {
    // inject dom no buffer
    if(ele.id&&ele.id.startsWith('y-record')){
      return;
    }
    let recorderId = element2recorderId.get(ele) || newId()
    element2recorderId.set(ele, recorderId)
    recorderId2element.set(recorderId,ele)
    mark(ele, recorderId)
    return;
  }
const bufferNewElement = (ele): void => {
    buffer(ele);
    if (ele.childElementCount) {
      // element.children retun childElements without textNodes
      Array.prototype.slice.call(ele.children).forEach(chEle => bufferNewElement(chEle))
    }
  }
const observer = (document)=>{
    const mutationObserver = (window as any).MutationObserver || (window as any).WebKitMutationObserver
      // filter out comment and script
  const nodesFilter = (nodeList): HTMLElement[] =>{
    return Array.prototype.slice.call(nodeList).filter(node => {
      const { nodeName, tagName } = node as HTMLElement
      return nodeName !== '#comment' && tagName !== 'SCRIPT'
    }) as HTMLElement[]
  }

    const getNodesRecord = ({
        addedNodes,
        removedNodes,
      }) =>{
        /** ------------------------------ Add or Remove nodes --------------------------------- */
        const { length: isAdd } = addedNodes
        const { length: isRemove } = removedNodes
    
        if (!isAdd && !isRemove) return
    
        // add and remove node could happen in the same record
        // record.type = DOMMutationTypes.node
    
        // Add element or textNode
        nodesFilter(addedNodes).forEach((node): void => {
          // let nodeData = {} as NodeMutationData
          switch (node.nodeName) {
            case '#text': {
              break
            }
            default: {
              bufferNewElement(node)
            }
          }
        })
      }
    const process = (mutationRecord):void =>{
        try {
          const { target } = mutationRecord
    
          // ignore script tag's mutation
          if (target && target.tagName === 'SCRIPT') return
    
          switch (mutationRecord.type) {
            // case 'attributes': {
            //   // ignore recorderId mutate
            //   if (attributeName === RECORDER_ID) return
    
            //   return this.getAttrReocrd(mutationRecord)
            // }
    
            // case 'characterData': {
            //   return this.getTextRecord(mutationRecord)
            // }
    
            case 'childList': {
              return getNodesRecord(mutationRecord)
            }
    
            default: {
              return
            }
          }
        } catch (error) {
            console.error(error)
        //   _warn(error)
        }
      }
    const observer = new mutationObserver((records: MutationRecord[]) => {
      // const { $emit } = this
    
      for (let record of records) {
        // const DOMMutationRecord = this.process(record as MutationRecordX)
        process(record)
    
        // if (DOMMutationRecord) {
        //   $emit('observed', DOMMutationRecord)
        // }
      }
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true
    })
}

export const recordNodeId = (document)=>{
    Array.prototype.slice.call(document.querySelectorAll('*')).forEach(buffer)
    observer(document)
}



