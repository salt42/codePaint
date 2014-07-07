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
        var $childEl = $('<div class="visumlize-scope visumlize-'+scope.type+'">"'+scope.type+'", lines '+scope.loc.start.line+' to '+scope.loc.end.line+'</div>');
        $parentEl.append($childEl);
        for(var i = 0; i < scope.childs.length; i++){
            var l = {
                    start: {
                            line: scope.childs[i].loc.start.line,
                            ch: scope.childs[i].loc.start.column},
                    end: {
                            line: scope.childs[i].loc.end.line,
                            ch: scope.childs[i].loc.end.column}
            }
            $childEl.append('<div class="visumlize-content">'+getCodeFromDocument(l)+'</div>');
            console.log($childEl);
            makeDomEls(scope.childs[i], $childEl);
        }
    }

    var getCodeFromDocument = function(loc){
        var replaceQuotes = function(text){
            return text.replace(/["]/, '\"');
        }
        var currDoc = DocumentManager.getCurrentDocument();
        var range = currDoc.getRange(loc.start, loc.end);
        var result = replaceQuotes(range).trim().slice(0, 128)+'...';
        return result;
    }

    exports.init = init;
    exports.render = render;
});
