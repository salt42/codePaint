define(function (require, exports, module){

    var ExtensionUtils  = brackets.getModule("utils/ExtensionUtils"),
        PanelManager    = brackets.getModule('view/PanelManager'),
        DocumentManager = brackets.getModule('document/DocumentManager'),
        $panelDom       = $('<div class="visumlize-render" id="visumlize-renderPanel"></div>');

    var init = function(){
        ExtensionUtils.loadStyleSheet(module, 'renderer.css');
        var renderPanel = PanelManager.createBottomPanel("visumlize.renderPanel", $panelDom);
        renderPanel.show();

    }

    var render = function(scope){
        return makeDomEls(scope, $panelDom);
    }

    var makeDomEls = function(scope, $parentEl){
        var $childEl = $('<div class="visumlize-scope visumlize-'+scope.type+'">"'+scope.type+'", lines '+scope.loc.start.line+' to '+scope.loc.end.line+'</div>'),
            l = {
                    start: {line: scope.loc.start.line-1,
                              ch: scope.loc.start.column},
                      end: {line: scope.loc.end.line-1,
                              ch: scope.loc.end.column}
            };
        if(l.end.line>0 || l.end.ch>0)
            $childEl.append('<div class="visumlize-content">'+getCodeFromDocument(l)+'</div>');

        $parentEl.append($childEl);
        for(var i = 0; i < scope.childs.length; i++){
            makeDomEls(scope.childs[i], $childEl);
        }
    }

    var getCodeFromDocument = function(loc){
        var replaceQuotes = function(text){
            return text.replace(/["]/, '\"');
        }
        var currDoc = DocumentManager.getCurrentDocument();
        var range = currDoc.getRange(loc.start, loc.end);
        var result = replaceQuotes(range).trim().slice(0, 32)+'...';
        return result;
    }

    exports.init = init;
    exports.render = render;
});
