(function(walKthru) {
    /*
        TODO:
        - animate window;
        - comment
        - publish
        - put on cklsylabs
        - readme

        MODULE NAME: 'walKthru'

        MARKUP:
        <walkthru><walkthru>
    */
    walKthru.directive('walkthru', function($timeout, $sce){
        return {
            restrict: 'E',
            scope: {
                steps:'=steps',
                index:'=?index',
                blur:'@blur'
            },
            templateUrl: '../html/walkthru-directive.html',
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
                        height: '50%'
                    },
                    bottom: {
                        top: '50%',
                        left: '0px',
                        width: '100%',
                        height: '50%'
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

                var scrollTo = function(el, messageBox, cb){
                    // var doc = document.documentElement;
                    // var currentScrollY = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
                    // var prevScrollY = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
                    // var currentScrollX = (window.pageXOffset || doc.scrollLeft)  - (doc.clientLeft || 0);
                    //
                    // var scrollYIncrements = ((el.offsetTop - 14) - currentScrollY) / 13;
                    //
                    // var timerID = setInterval(function() {
                    //     currentScrollY = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
                    //     currentScrollX = (window.pageXOffset || doc.scrollLeft)  - (doc.clientLeft || 0);
                    //     window.scrollTo(0, currentScrollY + scrollYIncrements);
                    //     currentScrollY = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
                    //     if( currentScrollY === prevScrollY ){
                    //         clearInterval(timerID);
                    //         cb(el, messageBox);
                    //     }else{
                    //         prevScrollY = currentScrollY;
                    //     }
                    // }, 13);
                    // console.log(el)
                };

                var cycleParents = function(el){
                    if(el.parentNode && el.parentNode.tagName !== 'BODY'){
                        var $element = angular.element(el.parentNode);
                        $element.addClass('walkthru_item_parent');
                        cycleParents($element[0]);
                    }
                }

                var setBlockStyles = function(el, messageBox){
                    $timeout(function(){
                        window.scrollTo(el.offsetLeft - 14, el.offsetTop - 14);
                        var dimensions = el.getBoundingClientRect();
                        var messageDimensions = messageBox.getBoundingClientRect();
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
                    });
                };

                var setEmptyElementBlockStyles = function(messageBox){
                    var messageDimensions = messageBox.getBoundingClientRect();
                    scope.blockStyles = {
                        top: {
                            top: '0px',
                            left: '0px',
                            width: '100%',
                            height: '50%'
                        },
                        bottom: {
                            top: '50%',
                            left: '0px',
                            width: '100%',
                            height: '50%'
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
                            top: ((window.innerHeight - messageDimensions.height) / 2) + 'px',
                            left: ((window.innerWidth - messageDimensions.width) / 2) + 'px'
                        }
                    };
                };

                var doStepFn = function(){
                    if(scope.steps2Do.steps[scope.index].hasOwnProperty('fn') && typeof scope.steps2Do.steps[scope.index].fn === 'function'){
                        scope.steps2Do.steps[scope.index].fn();
                    }
                };

                var setBtns = function(){
                    var nextBtn = element[0].querySelector(".c-walkthru__button__next");
                    var prevBtn = element[0].querySelector(".c-walkthru__button__previous");
                    if(!scope.steps2Do.steps[scope.index + 1]){
                        nextBtn.className = 'c-walkthru__button__next disabled';
                    }else{
                        nextBtn.className = 'c-walkthru__button__next';
                    }
                    if(!scope.steps2Do.steps[scope.index - 1]){
                        prevBtn.className = 'c-walkthru__button__previous disabled';
                    }else{
                        prevBtn.className = 'c-walkthru__button__previous';
                    }
                };

                scope.makeSafe = function(html){
                    return $sce.trustAsHtml(html);
                },

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
                        var body = angular.element(document.body);
                        body.removeClass('c-walkthru__body');
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

                var doStepTimeout = null;

                scope.doStep = function(){
                    $timeout.cancel(doStepTimeout);

                    if(scope.steps2Do){

                        var $blurries = angular.element(document.querySelectorAll('.walkthru_item_parent'));
                        $blurries.removeClass('walkthru_item_parent');
                        $blurries = angular.element(document.querySelectorAll('.walkthru_item'));
                        $blurries.removeClass('walkthru_item');

                        cycleParents(element[0]);

                        var el = scope.steps2Do.steps[scope.index].element ? document.querySelector(scope.steps2Do.steps[scope.index].element) : null;
                        var messageBox = element[0].querySelector('.c-walkthru__box');

                        if((scope.steps2Do.steps[scope.index].element && el || !scope.steps2Do.steps[scope.index].element) && messageBox){
                            scope.text = scope.steps2Do.steps[scope.index].text;
                            doStepFn();
                            setBtns();

                            if(scope.steps2Do.steps[scope.index].element){
                                var max = 21;
                                var setStyles = function(){
                                    var dimensions = el.getBoundingClientRect();
                                    if(!dimensions.height && max){
                                        setTimeout(function(){
                                            max--;
                                            setStyles();
                                        }, 100);
                                    }else{
                                        $el = angular.element(el);
                                        $el.addClass('walkthru_item');
                                        cycleParents(el);
                                        setBlockStyles(el, messageBox);
                                    }
                                };
                                setStyles();
                            }else{
                                setEmptyElementBlockStyles(messageBox);
                            }
                        }else{
                            doStepTimeout = $timeout(function(){
                                scope.doStep();
                            }, 50);
                        }
                    }
                };

                scope.run = function(n){
                    if(scope.steps && scope.steps.steps && scope.steps.steps.length){
                        $timeout(function(){
                            disableScroll();
                            scope.steps2Do = angular.copy(scope.steps);
                            scope.index = scope.index ? scope.index : 0;
                            element.addClass('active');
                            scope.doStep();
                        });
                    }
                };

                scope.init = function(){
                    if(scope.steps && scope.steps.steps && scope.steps.steps.length){
                        $timeout(function(){
                            var body = angular.element(document.body);
                            body.addClass('c-walkthru__body');
                            if(scope.steps.hasOwnProperty('onInitialize') && typeof scope.steps.onInitialize === 'function'){
                                scope.steps.onInitialize();
                            }
                            scope.run();
                        });
                    }
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
})(angular.module('walKthru', []));
