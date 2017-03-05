var ProductTemplate = function (vimeoID) {
  product_request(vimeoID);
  return LoadingTemplate();
}

var product_request = function (vimeoID) {
  var headers = new Headers({
    'cacheHeaderValue' : 'no-cache',
    'Authorization' : 'Bearer 02245412487b0a5a5f71d3c05fb3f47f'
  });
  var url = 'https://api.vimeo.com//videos/' + vimeoID;
  var request = new Request(url,{headers:headers});
  fetch(request)
  .then((response)=>{
    return response.text(); //返回一个带有文本的对象
  })
  .then((responseText)=>{
    var dic = JSON.parse(responseText);
    var playURL = dic.files[0].link;
    var doc = Presenter.makeDocument(product_successTemplate(playURL));
    doc.addEventListener("select",Presenter.loadFilm.bind(Presenter));
    debugger
    var loadingTem = navigationDocument.documents[1];
    navigationDocument.replaceDocument(doc,loadingTem);
  })
  .catch((error)=>{
    console.log(error);
  })
}

var product_successTemplate = function (playURL) {
  return `<?xml version="1.0" encoding="UTF-8" ?>
  <document>
   <productTemplate theme="dark">
      <background>
      </background>
      <banner>
        <infoList>
            <info>
               <header>
                  <title>Director</title>
               </header>
               <text>John Appleseed</text>
            </info>
            <info>
               <header>
                  <title>Actors</title>
               </header>
               <text>Anne Johnson</text>
               <text>Tom Clark</text>
               <text>Maria Ruiz</text>
            </info>
         </infoList>
         <stack>
            <title>vimeoID : ${vimeoID}</title>
            <row>
               <text><badge src="resource://tomato-fresh"/> 99%</text>
               <text>1hr 54min</text>
               <text>Comedy</text>
               <text>2015</text>
               <badge src="resource://mpaa-pg" class="badge" />
               <badge src="resource://cc" class="badge" />
            </row>
            <text>Follow the crazy adventures of a determined developer</text>
            <description allowsZooming="true" moreLabel="more">The story of an aspiring developer who needs a ticket to WWDC, but can't afford one, so he hires on as a cook at the conference. Follow his trip across the country as he heads to WWDC.</description>
            <row>
               <buttonLockup id="product_playBtn" onselect="
                  var doc = Presenter.makeDocument(LoadingTemplate());
                  Presenter.pushDocument(doc);
                 ">
                  <badge src="resource://button-preview" />
                  <title>Preview</title>
               </buttonLockup>
               <buttonLockup type="buy">
                  <text>$9.99</text>
                  <title>Buy</title>
               </buttonLockup>

               <buttonLockup style="width:100">
                 <text>1</text>
                 <title>Title</title>
               </buttonLockup>

            </row>
         </stack>
         <heroImg src="http://localhost:9001/images/Rectangle.png"/>
      </banner>
      <shelf>
         <header>
            <title>3 Episodes</title>
         </header>
         <section>
           ${episodesTemplate(playURL)}
         </section>
      </shelf>
   </productTemplate>
</document>`
}

var episodesTemplate = function (playURL) {

  var ayy = [
    {
        "id": 1913,
        "name": "《兔兔吐吐吐》16：跑男学霸队长邓超 引领微博界顽童群体 】",
        "position": 1122416520,
        "source_url": "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
        "stream_url": null,
        "landscape_poster": null,
        "portrait_poster": "http://7xoboh.com1.z0.glb.clouddn.com/006.png",
        "free": false,
        "livestream": false,
        "description": "世纪优优（天津）文化传播股份有限公司 是一家全球数字娱乐视频供应商，是中国地区较早开发海外业务、也是目前中国影视推广海外、全球范围内渠道较大的海外全媒体发行运营商",
        "background_poster": null,
        "thumbnail": null,
        "blocked_channels": [],
        "blocked_countries": [],
        "thumbnail_interval": 10,
        "masked_background_poster": null
    },
    {
        "id": 1914,
        "name": "《兔兔吐吐吐》17：跑男学霸队长邓超 引领微博界顽童群体 】",
        "position": 1122416520,
        "source_url": "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
        "stream_url": null,
        "landscape_poster": null,
        "portrait_poster": "http://7xoboh.com1.z0.glb.clouddn.com/007.png",
        "free": false,
        "livestream": false,
        "description": "世纪优优（天津）文化传播股份有限公司 是一家全球数字娱乐视频供应商，是中国地区较早开发海外业务、也是目前中国影视推广海外、全球范围内渠道较大的海外全媒体发行运营商",
        "background_poster": null,
        "thumbnail": null,
        "blocked_channels": [],
        "blocked_countries": [],
        "thumbnail_interval": 10,
        "masked_background_poster": null
    }
];

  var episodesTemplateArray = [];
  ayy.map((productCellData,index)=>{
    episodesTemplateArray.push(`
      <lockup srcurl="${productCellData.source_url}">
         <img src="http://localhost:9001/images/product_episodes_bg.png" width="100" height="100" />
         <overlay>
          <title style="color:rgba(255,255,255,1.0);tv-align: center;tv-text-style: subtitle1;">${index}</title>
         </overlay>
      </lockup>
    `)
  });
  return episodesTemplateArray.join('');
}
