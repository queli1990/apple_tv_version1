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
                   ${More.catelog_cells(albumArray)}
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
                ${More.catelog_cells()}
              </section>
            </shelf>
          </collectionList>
       </stackTemplate>
    </document>`
  },

  catelog_cells : function (array) {
    let more_cellTemplate = [];
    array.map((cellData,index)=>{
      if (cellData.portrait_poster_m.indexOf("default") == -1) {
        more_cellTemplate.push(`
          <lockup vimeoID="${cellData.vimeo_id}" albumID="${cellData.id}" vimeo_token="${cellData.vimeo_token}" name="${cellData.name}" director="${cellData.director}" cast1="${cellData.cast1}" cast2="${cellData.cast2}" cast3="${cellData.cast3}" cast4="${cellData.cast4}" release_date="${cellData.release_date}" launchImg="${cellData.portrait_poster_b}" genre_id="${cellData.genre_id}">
            <img src="${cellData.portrait_poster_m}" width="255" height="363" />
            <title>${cellData.name}</title>
          </lockup>
        `)
      }
    });
    return more_cellTemplate.join('');
  }
}
