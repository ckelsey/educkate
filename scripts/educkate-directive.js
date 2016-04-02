(function(eduCKate) {
    /*
        TODO:
        - blur out unwanted

        MODULE NAME: 'eduCKate'

        MARKUP:
        <educkate><educkate>
    */
    eduCKate.directive('educkate', function($timeout){
        return {
            restrict: 'E',
            scope: {
                steps:'=steps',
                index:'=?index',
                blur:'@blur'
            },
            templateUrl: '../html/educkate-directive.html',
            link: function(scope,element,attributes){

                var keys = {37: 1, 38: 1, 39: 1, 40: 1};
                function preventDefault(e) {
                    e = e || window.event;
                    if (e.preventDefault) e.preventDefault();
                    e.returnValue = false;
                }

                function preventDefaultForScrollKeys(e) {
                    if (keys[e.keyCode]) {
                        preventDefault(e);
                        return false;
                    }
                }

                function disableScroll() {
                    window.onwheel = preventDefault; // modern standard
                    window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
                    window.ontouchmove = preventDefault; // mobile
                    document.onkeydown = preventDefaultForScrollKeys;
                }

                function enableScroll() {
                    window.onmousewheel = document.onmousewheel = null;
                    window.onwheel = null;
                    window.ontouchmove = null;
                    document.onkeydown = null;
                }

                scope.index = scope.index ? scope.index : 0;
                scope.text = null;
                scope.blockStyles = {
                    top: {
                        top: '0px',
                        left: '0px',
                        width: '100%',
                        height: '0px'
                    },
                    bottom: {
                        top: '0px',
                        left: '0px',
                        width: '100%',
                        height: '0px'
                    },
                    left: {
                        top: '0px',
                        left: '0px',
                        width: '0px',
                        height: '0px'
                    },
                    right: {
                        top: '0px',
                        left: '0px',
                        width: '0px',
                        height: '0px'
                    },
                    message: {
                        top: '0px',
                        left: '0px'
                    }
                };

                scope.doNext = function(){
                    scope.index = scope.steps2Do.steps[scope.index + 1] ? scope.index + 1 : 0;
                    if(scope.index){
                        if(scope.steps2Do.hasOwnProperty('onNext') && typeof scope.steps2Do.onNext === 'function'){
                            scope.steps2Do.onNext();
                        }
                        scope.doStep();
                    }
                };

                scope.doPrevious = function(){
                    scope.index = scope.steps2Do.steps[scope.index - 1] ? scope.index - 1 : scope.steps2Do.steps.length - 1;
                    if(scope.steps2Do.hasOwnProperty('onPrevious') && typeof scope.steps2Do.onPrevious === 'function'){
                        scope.steps2Do.onPrevious();
                    }
                    scope.doStep();
                };

                scope.doDone = function(){
                    $timeout(function(){
                        if(scope.steps2Do.hasOwnProperty('onDone') && typeof scope.steps2Do.onDone === 'function'){
                            scope.steps2Do.onDone();
                        }
                        enableScroll();
                        scope.index = 0;
                        scope.steps2Do = null;
                        element.removeClass('active');
                        scope.steps = null;
                    });
                };

                scope.getBlockerStyle = function(key){
                    return scope.blockStyles[key];
                };

                scope.doStep = function(){
                    scope.text = scope.steps2Do.steps[scope.index].text;
                    var el = document.querySelector(scope.steps2Do.steps[scope.index].element);
                    var messageBox = element[0].querySelector('.c-educkate__box');
                    if(el && messageBox){
                        if(scope.steps2Do.steps[scope.index].hasOwnProperty('fn') && typeof scope.steps2Do.steps[scope.index].fn === 'function'){
                            scope.steps2Do.steps[scope.index].fn();
                        }
                        var nextBtn = element[0].querySelector(".c-educkate__button__next");
                        var prevBtn = element[0].querySelector(".c-educkate__button__previous");
                        if(!scope.steps2Do.steps[scope.index + 1]){
                            nextBtn.className = 'c-educkate__button__next disabled';
                        }else{
                            nextBtn.className = 'c-educkate__button__next';
                        }
                        if(!scope.steps2Do.steps[scope.index - 1]){
                            prevBtn.className = 'c-educkate__button__previous disabled';
                        }else{
                            prevBtn.className = 'c-educkate__button__previous';
                        }
                        var dimensions = el.getBoundingClientRect();
                        var messageDimensions = element[0].querySelector('.c-educkate__box').getBoundingClientRect();
                        var x = dimensions.right > (window.innerWidth - window.scrollX) ? dimensions.left : 0;
                        var y = el.offsetTop < (window.innerHeight) ? el.offsetTop - messageDimensions.height : el.offsetTop + dimensions.height;
                        window.scrollTo(x, y);
                        dimensions = el.getBoundingClientRect();
                        messageDimensions = element[0].querySelector('.c-educkate__box').getBoundingClientRect();
                        scope.blockStyles = {
                            top: {
                                top: '0px',
                                left: '0px',
                                width: '100%',
                                height: dimensions.top + 'px'
                            },
                            bottom: {
                                top: dimensions.bottom + 'px',
                                left: '0px',
                                width: '100%',
                                height: (window.innerHeight - dimensions.bottom) + 'px'
                            },
                            left: {
                                top: dimensions.top + 'px',
                                left: '0px',
                                width: dimensions.left + 'px',
                                height: (dimensions.bottom - dimensions.top) + 'px'
                            },
                            right: {
                                top: dimensions.top + 'px',
                                left: (dimensions.left + dimensions.width) + 'px',
                                width: (window.innerWidth - (dimensions.left + dimensions.width)) + 'px',
                                height: (dimensions.bottom - dimensions.top) + 'px'
                            },
                            message: {
                                top: '0px',
                                left: '0px'
                            }
                        };

                        if(parseInt(scope.blockStyles.top.height) > parseInt(scope.blockStyles.bottom.height)){
                            scope.blockStyles.message.top = (parseInt(scope.blockStyles.top.height) - messageDimensions.height) - 7 < 0 ? '0px' : ((parseInt(scope.blockStyles.top.height) - messageDimensions.height) - 7) + 'px';
                        }else{
                            if(messageDimensions.height + 7 > parseInt(scope.blockStyles.bottom.height)){
                                scope.blockStyles.message.top = (parseInt(scope.blockStyles.bottom.top) - (messageDimensions.height - parseInt(scope.blockStyles.bottom.height))) + 'px';
                            }else{
                                scope.blockStyles.message.top = (parseInt(scope.blockStyles.bottom.top) + 7) + 'px';
                            }
                        }
                        scope.blockStyles.message.left = ((window.innerWidth - messageDimensions.width) / 2) + 'px';
                    }else{
                        $timeout(function(){
                            scope.doStep();
                        }, 200);
                    }
                };

                scope.run = function(n){
                    $timeout(function(){
                        disableScroll();
                        scope.steps2Do = angular.copy(scope.steps);
                        scope.index = scope.index ? scope.index : 0;
                        element.addClass('active');
                        scope.doStep();
                    });
                };

                scope.init = function(){
                    $timeout(function(){
                        if(scope.steps.hasOwnProperty('initialize') && typeof scope.steps.initialize === 'function'){
                            scope.steps.initialize();
                        }
                        scope.run();
                    });
                };

                if(scope.steps){
                    scope.init();
                }

                var winResizeTimer = null;
                var doWindowResize = function(){
                    clearTimeout(winResizeTimer);
                    if(scope.steps){
                        winResizeTimer = setTimeout(function(){
                            scope.run();
                        },20);
                    }
                };
                window.addEventListener('resize', doWindowResize, true);

                scope.$watchCollection(function(){
                    return scope.steps;
                }, function(n,o){
                    if(n !== o && n && n.hasOwnProperty('steps') && n.steps.length){
                        scope.init();
                    }
                });
            }
        };
    });
})(angular.module('eduCKate', []));
