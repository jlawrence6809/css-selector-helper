chrome.devtools.panels.elements.createSidebarPane(
    "CSS Selector2",
    function(sidebar) {
	  	sidebar.setPage("index.html");
	  	//resize
  		sidebar.onShown.addListener(function(panelWindow){
  			var resizeFunc = function(){
		    	var newh = (this.document.body.getBoundingClientRect().height + 60) + "px";
		    	sidebar.setHeight(newh);
			}
			var resizeListener = function(event){
				if(event.data === "resize panel"){
					resizeFunc();
				}
			}
			resizeFunc();
  			panelWindow.onresize = resizeFunc;
  			panelWindow.addEventListener("message", resizeListener, false);
  		});
	}
);
