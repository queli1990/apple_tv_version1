var ErrorAlertTemplate = function (title,description) {
  return `<?xml version="1.0" encoding="UTF-8" ?>
      <document>
        <head>
          <style>
            .bg { background-color: rgba(230,230,230);}
            .collects {
              margin: -120 0 80 0;
            }
            .btns {
              margin: 130 0 0 0;
            }
            .titleStyle {
              text-align:left
            }
            .title{
              text-align:right
            }
          </style>
        </head>

        <alertTemplate>
          <title class='titleStyle'>${title}</title>
          <description>${description}</description>
          <button onselect="
              Presenter.popDocument();
            ">
            <title>OK</title>
          </button>
        </alertTemplate>
      </document>`
}
