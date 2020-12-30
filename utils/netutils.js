let network = require('../utils/network.js');
export default {
  postCollectUrl(collect, id, header){
    const result = network.postRequest("https://www.wanandroid.com/lg/" + collect + '/' + id + "/json", header, {})
    return result
  },
  getCollectList(header,index){
    const result=network.getRequest("https://www.wanandroid.com/lg/collect/list/"+index+"/json",header,{})
    return result
  }
}