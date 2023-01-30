const instagramGetUrl = require('instagram-url-direct');
const fs = require('fs');
const axios = require('axios')
const { GetInfoUser, MediaUrl, GetMediaId, UserUrl } = require('./api');

const InstagramGet = (url, res) => new Promise(async(resolve, reject)=>{
    let code_url = url.split("/")[4];
    let links = await MediaUrl(url);
    if(links === "ERROR"){
        res.json({error: false})
    }else{
    let GetUser = await UserUrl(url)
    let mergedResponse = {result: {...links, ...GetUser}};
    res.json(mergedResponse)
    }
    // res.json(links)
    // resolve(links);
    // if(links){
    //     res.json(links)
    //     resolve(links);
    //     console.log(links)
    // }else{
    //     res.send('Gagal')
    //     reject(links)
    //     console.log(links)
    // }
})

const InstagramDownVideo = (url, res) => new Promise(async(resolve, reject)=>{
  const response = await axios.get(url);
  res.json(response.data)

})


module.exports = {
  InstagramGet,
  InstagramDownVideo
}
