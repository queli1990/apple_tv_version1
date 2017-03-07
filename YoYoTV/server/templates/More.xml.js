var More = {
  five : function (categoryID) {
    return `<document>
       <stackTemplate>
          <banner>
             <title>${categoryID}</title>
          </banner>
          <collectionList>
             <grid>
                <section>
                   ${catelog_cells()}
                </section>
             </grid>
          </collectionList>
       </stackTemplate>
    </document>`
  },

  six : function () {
    return `<document>
       <stackTemplate>
          <banner>
             <title>More</title>
          </banner>

          <collectionList>

            <shelf>
              <header>
                <title>title</title>
              </header>
              <section>
                ${catelog_cells()}
              </section>
            </shelf>
          </collectionList>
       </stackTemplate>
    </document>`
  }
}


var catelog_cells = function () {
  let cellTemplate = [];
  for (var i = 0; i < 10; i++) {
    let imgStr = "http://localhost:9001/images/home_down_3.png";
    cellTemplate.push(`
        <lockup tagValue="homepage_up_scrollview" vimeoID="206381096">
           <img src="${imgStr}" width="281" height="400" />
           <title>Movie ${i}</title>
        </lockup>
      `)
  }
  return cellTemplate.join('');
}
