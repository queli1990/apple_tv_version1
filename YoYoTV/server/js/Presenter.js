
var Presenter = {
  //1
  makeDocument: function (resource) {
    if (!Presenter.parser) {
      Presenter.parser = new DOMParser();
    }
    var doc = Presenter.parser.parseFromString(resource, "application/xml");

//判断是否为search模板，如果是，注入keyboard.onTextChange方法
    var xx = Presenter.parser.parseFromString(doc.lastChild.innerHTML, "application/xml");
    var searchField = doc.getElementById("searchField"); //get the searchField element
    if (searchField) {
      var keyboard = searchField.getFeature("Keyboard");  // get the keyboard of the searchField
      keyboard.onTextChange = function () {    // register listener on event onTextChange
        console.log(keyboard.text);// do something with the current text
      };
    }
    return doc
  },

  //2
  modalDialogPresenter: function(xml){
    navigationDocument.presentModal(xml);
  },

  //3
  pushDocument: function(xml) {
    navigationDocument.pushDocument(xml);
  },

  //4
  popDocument: function() {
    navigationDocument.popDocument();
  },

  loadFilm: function(event) {
    //1
    debugger
    videoURL = event.target.getAttribute("srcurl")
    // videoURL = "http://player.vimeo.com/external/206381096.sd.mp4?s=62c6a1038f82d5b44fe65ab26a779e2747770084&profile_id=165&oauth2_token_id=948927208";
    if(videoURL) {
      //2
      var player = new Player();
      var playlist = new Playlist();
      var mediaItem = new MediaItem("video", videoURL);

      player.playlist = playlist;
      player.playlist.push(mediaItem);
      player.present();
    }
  },

  loadProductPage: function(event){
    var self = this,
    ele = event.target,
    title = ele.textContent;

    var doc = Presenter.makeDocument(ProductTemplate(title));
    doc.addEventListener("select",Presenter.loadFilm.bind(Presenter));
    Presenter.pushDocument(doc);
  },

  loadMenuItem(event) {
    const menuItemId = event.target.getAttribute('id');
    let doc;

    var jsstr = localStorage.getItem('homePage_bigStr')
    var json = JSON.parse(jsstr);
    switch (menuItemId) {
      case 'navigation_0':
        doc = Presenter.makeDocument(StackTemplate(json[0]));
        doc.addEventListener("select",Presenter.loadFilm.bind(Presenter));
        break;
      case 'navigation_1':
        doc = Presenter.makeDocument(StackTemplate(json[1]));
        doc.addEventListener("select",Presenter.loadFilm.bind(Presenter));
        break;
      case 'navigation_2':
        doc = Presenter.makeDocument(StackTemplate(json[2]));
        doc.addEventListener("select",Presenter.loadFilm.bind(Presenter));
        break;
      case 'navigation_3':
        doc = Presenter.makeDocument(CatalogTemplate());
        doc.addEventListener("select",Presenter.loadProductPage.bind(Presenter));
        // doc.addEventListener('select',Presenter.getRequest.bind(Presenter));
        break;
      case 'navigation_4':
        doc = Presenter.makeDocument(SearchTemplate());
        doc.addEventListener("select",Presenter.searchPresenter.bind(Presenter));
        break;
    }
    let menuItemDocument = event.target.parentNode.getFeature("MenuBarDocument");
    menuItemDocument.setDocument(doc, event.target);
  },

  //搜索
  searchPresenter(event){
    debugger
    var searchField = event.getElementsByTagName("searchField").item(0);
    var keyboard = searchField.getFeature("Keyboard");

    keyboard.onTextChange = function() {
      var searchText = keyboard.text;
      searchResults(document, searchText);
    }
  },

  getRequest(){
    var opts = {
      method: 'GET'
    }

    fetch('http://192.168.199.131:3000/genreLists', opts)
    .then((response) => {
      return response.text(); //返回一个带有文本的对象
    })
    .then((responseText)=>{
      let dataArr = JSON.parse(responseText);
      let doc = Presenter.makeDocument(ErrorAlertTemplate(dataArr[2].name ,'succ'));
      navigationDocument.pushDocument(doc);
    })
    .catch((error)=>{
      let doc = Presenter.makeDocument(ErrorAlertTemplate(error,'err'));
      navigationDocument.pushDocument(doc);
    })
  },

//more页面进入产品页时的cell点击事件
  toProductFromMore : function (event) {
    var vimeoIDFromMorePage = event.target.getAttribute('vimeoID');
    var doc = Presenter.makeDocument(ProductTemplate(vimeoIDFromMorePage));
    Presenter.pushDocument(doc);
  },

  homeCellClick :function(event) {
    isMore = event.target.getAttribute('isHaveMore');
    if (isMore) {
      var doc = Presenter.makeDocument(More.five('传过来的当前更多的category'));
      doc.addEventListener("select",Presenter.toProductFromMore.bind(Presenter));
      Presenter.pushDocument(doc);
    }else {
      vimeoID = event.target.getAttribute('vimeoID');
      var doc = Presenter.makeDocument(ProductTemplate(vimeoID));
      Presenter.pushDocument(doc);
    }
  },

//付费的
  getURLForVimeo (vimeoID){
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
      debugger
    })
    .catch((error)=>{
      console.log(error);
    })
  },

//免费的
  getVimeoUrl (event) {
    var loading = Presenter.makeDocument(LoadingTemplate());
    Presenter.pushDocument(loading);

    ele = event.target,
    videoURL = ele.getAttribute("vimeoID")

    var videoUrl = 'https://player.vimeo.com/video/';
    var requestUrl = videoUrl + videoURL + '/config';

    var opts = {
      method: 'GET'
    }
    fetch(requestUrl, opts)
    .then((response) => {
      return response.text(); //返回一个带有文本的对象
    })
    .then((responseText)=>{
      var dic = JSON.parse(responseText);
      var playURL = dic.request.files.progressive[0].url;
      console.log('success' + playURL);
//获取url，进入播放页
      var player = new Player();
      var playlist = new Playlist();
      var mediaItem = new MediaItem("video", playURL);

      player.playlist = playlist;
      player.playlist.push(mediaItem);
      player.present();
      var currentNavIndex = navigationDocument.documents.length - 1;
      navigationDocument.removeDocument(navigationDocument.documents[currentNavIndex]);
    })
    .catch((error)=>{
      console.log('fail' + error);
    })
  },

}
