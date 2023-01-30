const { iwa, iwaId, iwaIdUrl, Peking404 } = require('instagram-without-api-node')
const axios = require('axios');
const imageToBase64 = require('image-to-base64');
const Downloader = require('nodejs-file-downloader');

const _cookie = 'ig_nrcb=1; ig_did=E06BD913-6F52-4B19-B1AE-626C660F72C7; mid=Y1bXngALAAE3C4zu3kjvKZrdSd2T; fbm_124024574287414=base_domain=.instagram.com; datr=bIhvYxGqmuDHCwXIwV45MuW6; ds_user_id=55179289331; csrftoken=uqQgT51IiumCtJ8ElAAEVqHMkSwKft2a; shbid="2211\05455179289331\0541706423541:01f72136bafe4a11d5d0f2f32985e429d75937c399376059cbcae2e13332b134ba0b53ca"; shbts="1674887541\05455179289331\0541706423541:01f79f63fdfbb0c0f2c1dc94c7e77c8213b8d5ba5e7264f7c323f108a66e0da9171300bf"; sessionid=55179289331%3A6XvtnnjNUsF7E1%3A6%3AAYeyc6UdYHbv-R6wfGrYbvh91nmfqjLMaQ13ZgW9Dg; rur="CCO\05455179289331\0541706501622:01f772cefeb6a9ea60761835eca505d84dbc34edaf9e99607aaa9ad25c63205378748929"; dpr=2.0000000298023224'      // <!-- required!! please get your cookie from your browser console (6)
const _userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'      // <!-- required!! please get your user-agent from your browser console (7)
const _xIgAppId = '1217981644879628'                 // <!-- required!! please get your x-ig-app-id from your browser console (8)

const GetMediaId = (url) => new Promise(async(resolve, reject)=>{
try{
    const response = await axios.get(url, {
        headers: {
            'cookie': _cookie,
            'user-agent': _userAgent,
            'x-ig-app-id': _xIgAppId,
            'sec-fetch-site': 'same-origin'
        }
    })
        const bodyArray = response.data.split('instagram://media?id=')[1];
        if(bodyArray){
            const realId = bodyArray.split('"')[0];
            resolve(realId);
        }else{
            resolve("ERROR")
        }
}catch (error) {
    resolve("ERROR")
  }

})

const MediaUrl = (url) => new Promise(async(resolve, reject)=>{
        const id = await GetMediaId(url);
        console.log(id)
        if(id === "ERROR"){
            resolve("ERROR")
        }else{
        const response = await axios.get(`https://i.instagram.com/api/v1/media/${id}/info/`, {
        headers: {
            'cookie': _cookie,
            'user-agent': _userAgent,
            'x-ig-app-id': _xIgAppId
        }
})
        const hasil = response.data.items[0].carousel_media
        let usu = [];
        if(hasil){
            for (let i = 0; i < hasil.length; i++) {
                if(hasil[i].video_versions){
                    const imageL = hasil[i].image_versions2.candidates[0].url
                    const video = hasil[i].video_versions[0].url
                    const base64V = await imageToBase64(imageL);
                    usu.push({
                        id: i,
                        imageURL: imageL,
                        links: video,
                        images64: base64V,
                        type: "video"
                    })
                }else{
                    const Mlink = hasil[i].image_versions2.candidates[0].url
                    const convert64 = await imageToBase64(Mlink);
                        usu.push({
                            id: i,
                            links: Mlink,
                            base64: convert64,
                            type: "image"
                        })
                }
            }
            resolve({linkmedia: usu})
}else{
    const frist = response.data.items[0]
    if(frist.video_versions){
        const imageL = frist.image_versions2.candidates[0].url
        const video = frist.video_versions[0].url
        const base64V = await imageToBase64(imageL);
        usu.push({
            id: 1,
            imageURL: imageL,
            links: video,
            images64: base64V,
            type: "video"
        })
    }else{
        const Mlink = frist.image_versions2.candidates[0].url
        const convert64 = await imageToBase64(Mlink);
            usu.push({
                id: 1,
                links: Mlink,
                base64: convert64,
                type: "image"
            })
    }
    resolve({linkmedia: usu})
}
        // let result = [];
        // result.push({hasil})
        // resolve(result);
    }
})

    const UserUrl = (url) => new Promise(async(resolve, reject)=>{
            const id = await GetMediaId(url);
            console.log(id)
            if(id === "ERROR"){
                resolve("ERROR")
            }else{
            const response = await axios.get(`https://i.instagram.com/api/v1/media/${id}/info/`, {
            headers: {
                'cookie': _cookie,
                'user-agent': _userAgent,
                'x-ig-app-id': _xIgAppId
            }
        })
        const Hasil = response.data.items[0]
        let User = [];
        const likes = Hasil.like_count
        const commentCount = Hasil.comment_count
        const user = Hasil.caption.user.username
        const imageUrlr = Hasil.caption.user.profile_pic_url
        const text = Hasil.caption.text
            resolve({
                likes: likes,
                commentCount: commentCount,
                text: text,
                user: {
                    username: user,
                    imageUrlr: imageUrlr
                }
            })

    }
    
})

function GetInfoUser(code_url) {
    return new Promise(async (resolve, reject) => {

        const responseIwaIdUrl = await iwaIdUrl({
            headers: {
                'cookie': _cookie,
                'user-agent': _userAgent,
                'x-ig-app-id': _xIgAppId
            },

            base64images: false,

            // file: "instagram-cache-byidurl.json",   // <!-- optional, instagram-cache.json is by default
            pretty: true,
            time: 3600,

            id: `${code_url}` // <!-- id is required
        });
        resolve(responseIwaIdUrl);
    });
}

const InstagramVideo = (url, res) => new Promise(async(resolve, reject)=>{
    const utup = url;
    console.log(utup)
    const downloader = await new Downloader({
        url: ""+utup,
        directory: "./",
        fileName: "somename.mp4", //Sub directories will also be automatically created if they do not exist.
        onProgress: function (percentage, chunk, remainingSize) {
          //Gets called with each chunk.
          console.log("% ", percentage);
        },
      });
    
      try {
        await downloader.download(url);
        res.send("sukes")
      } catch (error) {
        console.log(error);
      }

})

module.exports = {
    GetInfoUser,
    MediaUrl,
    GetMediaId,
    InstagramVideo,
    UserUrl
}
