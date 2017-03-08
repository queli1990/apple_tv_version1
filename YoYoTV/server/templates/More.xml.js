var More = {
  five : function (categoryID,albumArray) {
    return `<document>
       <stackTemplate>
          <banner>
             <title>${categoryID}</title>
          </banner>
          <collectionList>
             <grid>
                <section>
                   ${catelog_cells(albumArray)}
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


var catelog_cells = function (array) {
  let cellTemplate = [];
  array.map((cellData,index)=>{
    cellTemplate.push(`
        <lockup vimeoID="206381096">
           <img src="${cellData.portrait_poster}" width="255" height="363" />
           <title>${cellData.description}</title>
        </lockup>
      `)
  });
  return cellTemplate.join('');
}
