var StackTemplate = function (array) {
  requestTabData();
  return LoadingTemplate();
}

var requestTabData = function () {
  var opts = {
    method: 'GET'
  }
  fetch('http://192.168.199.200:3000/genreLists', opts)
  .then((response) => {
    return response.text(); //返回一个带有文本的对象
  })
  .then((responseText)=>{
    let array = JSON.parse(responseText);
    var doc = Presenter.makeDocument(requestSuccess(array));
    doc.addEventListener("select",Presenter.homeCellClick.bind(Presenter));  //点击事件
    // Presenter.replaceDocument(doc,loadingDoc);
debugger
    navigationDocument.clear();
    Presenter.pushDocument(doc);
  })
  .catch((error)=>{
    let doc = Presenter.makeDocument(ErrorAlertTemplate(error,'errxxx'));
    Presenter.pushDocument(doc);
    // Presenter.replaceDocument(doc,loadingDoc);
  })
}

var requestSuccess = function (bigJson) {
  return `<document>
    <stackTemplate>
        <banner>
           <title>YoYo Movies</title>
        </banner>

        <collectionList>
          <carousel>
           <section>
            ${topScroll(bigJson)}
           </section>
          </carousel>

           ${shelfs(bigJson)}
        </collectionList>
     </stackTemplate>
  </document>`
}

var topScroll = function (json) {
  // var jsstr = localStorage.getItem('homePage_bigStr')
  // var json = JSON.parse(jsstr);
  var scrollArray = json[0].carousel_episodes;
  var array = [];
  scrollArray.map((cellData,index)=>{
    array.push(`
      <lockup vimeoID="206381096">
        <img src="${cellData.portrait_poster}" width="888" height="500" />
        <overlay class="carouselOverlay">
          <title>${cellData.name}</title>
          <subtitle>${cellData.description}</subtitle>
        </overlay>
      </lockup>
    `);
  });
  return array.join('');
}

var shelfs = function (bigJson) {
  var genreListItemsArray = [];
  bigJson.map((categoryDataArray,index)=>{
    genreListItemsArray.push(`
      <shelf>
        <header>
          <title>${categoryDataArray.name}</title>
        </header>
        <section>
          ${sections(categoryDataArray.genreListItems)}
        </section>
      </shelf>
    `);
  });
  return genreListItemsArray.join('');
}

var sections = function (categoryDataArray) {
  var sectionsItemArray = [];

  categoryDataArray.map((cellItem,index)=>{
    sectionsItemArray.push(`
       ${items(cellItem)}
    `)
  });

//判断个数是否多余，多则添加 MORE 选项
  if (categoryDataArray.length >= 2) {
    var itemdoc = more();
    sectionsItemArray.push(itemdoc);
  }

  return sectionsItemArray.join('');
}

var items = function (cellItemDic) {
  return `
    <lockup vimeoID="206381096" srcurl="${cellItemDic.source_url}">
       <img src="${cellItemDic.portrait_poster}" width="255" height="363" style="tv-placeholder: movie"/>
       <title>Movie ${cellItemDic.name}</title>
    </lockup>
  `
}

var more = function () {
  return `
    <lockup isHaveMore="more">
       <img src="http://localhost:9001/images/More.png" width="255" height="363" style="tv-placeholder: http://localhost:9001/images/home_up_0.png"/>
       <title>More</title>
    </lockup>
  `
}
