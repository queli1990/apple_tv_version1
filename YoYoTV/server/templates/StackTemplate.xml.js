var StackTemplate = function (array) {
  return Presenter.requestHomeTemplate();
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
  var scrollArray = json.data.recommend.carousel_episodes;
  var array = [];
  scrollArray.map((cellData,index)=>{
    array.push(`
      <lockup vimeoID="206381096">
        <img src="${cellData.apple_poster}" width="888" height="500" />
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
  for (key in bigJson.data) {
debugger;
    if (key != 'recommend') {
      genreListItemsArray.push(`
        <shelf>
          <header>
            <title>${bigJson.data[key].name}</title>
          </header>
          <section>
            ${sections(bigJson.data[key].carousel_episodes)}
          </section>
        </shelf>
      `);
    }
  }

  // bigJson.data.map((categoryDataArray,index)=>{
  //   genreListItemsArray.push(`
  //     <shelf>
  //       <header>
  //         <title>${categoryDataArray.name}</title>
  //       </header>
  //       <section>
  //         ${sections(categoryDataArray.genreListItems)}
  //       </section>
  //     </shelf>
  //   `);
  // });
  return genreListItemsArray.join('');
}

var sections = function (categoryDataArray) {
  var sectionsItemArray = [];
debugger
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

var moreImg = BASEURL + '/images/More.png';
console.log('moreImg:' + moreImg);

  return `
    <lockup isHaveMore="more" album="episodes">
       <img src="${moreImg}" width="255" height="363" style="tv-placeholder: http://localhost:9001/images/home_up_0.png"/>
       <title>More</title>
    </lockup>
  `
}
