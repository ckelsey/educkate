(function(walKthru) {
    /*
        TODO:
        - animate window;
        - publish
        - put on cklsylabs
        - readme

        MODULE NAME: 'walKthru'

        MARKUP:
        <walkthru steps="walkthru" blur=false index=2><walkthru>
    */
    walKthru.directive('walkthru', function($timeout, $sce, $compile){
        return {
            restrict: 'E',
            scope: {
                steps:'=steps', // OBJECT: Required - Data
                index:'=?index', // NUMBER: Optional - Which index to start on
                blur:'@blur' // BOOL: Optional - Use CSS blur filter, defaults to true
            },
            templateUrl: '../html/walkthru-directive.html',
            link: function(scope,element,attributes){
                /* proxy to scope.index */
                scope.proxyIndex = scope.index ? angular.copy(scope.index) : 0;
                /* proxy to scope.steps */
                scope.steps2Do = null;
                scope.text = null;
                scope.defaultBlockStyles = {
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

                scope.blockStyles = angular.copy(scope.defaultBlockStyles);


                /* Keys that cause scrolling */
                var keys = {37: 1, 38: 1, 39: 1, 40: 1};

                var preventDefault = function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    e.returnValue = false;
                };

                var preventDefaultForScrollKeys = function(e){
                    if (keys[e.keyCode]) {
                        preventDefault(e);
                        return false;
                    }
                };

                var disableScroll = function(){
                    window.addEventListener("mousewheel", preventDefault, true);
                    window.addEventListener("wheel", preventDefault, true);
                    window.addEventListener("touchmove", preventDefault, true);
                    window.addEventListener("keydown", preventDefaultForScrollKeys, true);
                };

                var enableScroll = function(){
                    window.removeEventListener("mousewheel", preventDefault, true);
                    window.removeEventListener("wheel", preventDefault, true);
                    window.removeEventListener("touchmove", preventDefault, true);
                    window.removeEventListener("keydown", preventDefaultForScrollKeys, true);
                };


                /* Cycle up the focused element's parents and add a class that disables blur */
                var cycleParents = function(el){
                    if(el.parentNode && el.parentNode.tagName !== 'BODY'){
                        var $element = angular.element(el.parentNode);
                        $element.addClass('walkthru_item_parent');
                        cycleParents($element[0]);
                    }
                }

                /* Set the positioning of the message box and blockers */
                var setPositioning = function(el, messageBox){
                    $timeout(function(){
                        scope.blockStyles = angular.copy(scope.defaultBlockStyles);
                        if(el){
                            window.scrollTo(el.offsetLeft - 14, el.offsetTop - 14);
                            var dimensions = el.getBoundingClientRect();
                            var messageDimensions = messageBox.getBoundingClientRect();
                            scope.blockStyles.top.height = dimensions.top + 'px';
                            scope.blockStyles.bottom.top = dimensions.bottom + 'px';
                            scope.blockStyles.bottom.height = (window.innerHeight - dimensions.bottom) + 'px';
                            scope.blockStyles.left.top = dimensions.top + 'px';
                            scope.blockStyles.left.width = dimensions.left + 'px';
                            scope.blockStyles.left.height = (dimensions.bottom - dimensions.top) + 'px';
                            scope.blockStyles.right.top = dimensions.top + 'px';
                            scope.blockStyles.right.left = (dimensions.left + dimensions.width) + 'px';
                            scope.blockStyles.right.width = (window.innerWidth - (dimensions.left + dimensions.width)) + 'px';
                            scope.blockStyles.right.height = (dimensions.bottom - dimensions.top) + 'px';

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
                            var messageDimensions = messageBox.getBoundingClientRect();
                            scope.blockStyles.message.top = ((window.innerHeight - messageDimensions.height) / 2) + 'px';
                            scope.blockStyles.message.left = ((window.innerWidth - messageDimensions.width) / 2) + 'px';
                        }
                    });
                };

                /* Sets the next and previous buttons disabled state */
                var setBtns = function(){
                    var nextBtn = element[0].querySelector(".c-walkthru__button__next");
                    var prevBtn = element[0].querySelector(".c-walkthru__button__previous");
                    if(!scope.steps2Do.steps[scope.proxyIndex + 1]){
                        nextBtn.className = 'c-walkthru__button__next disabled';
                    }else{
                        nextBtn.className = 'c-walkthru__button__next';
                    }
                    if(!scope.steps2Do.steps[scope.proxyIndex - 1]){
                        prevBtn.className = 'c-walkthru__button__previous disabled';
                    }else{
                        prevBtn.className = 'c-walkthru__button__previous';
                    }
                };

                /* Removes blur classes */
                var removeBlurries = function(){
                    var $blurries = angular.element(document.querySelectorAll('.walkthru_item_parent'));
                    $blurries.removeClass('walkthru_item_parent');
                    $blurries = angular.element(document.querySelectorAll('.walkthru_item'));
                    $blurries.removeClass('walkthru_item');
                };

                /* Allows HTML to be used in scope.text */
                scope.makeSafe = function(html){
                    return $sce.trustAsHtml(html);
                },

                /* If next step, increment index, otherwise set to 0. Perform onNext function if exists */
                scope.doNext = function(){
                    /* If next step, increment index, otherwise set to 0 */
                    scope.proxyIndex = scope.steps2Do.steps[scope.proxyIndex + 1] ? scope.proxyIndex + 1 : 0;
                    if(scope.steps2Do.hasOwnProperty('onNext') && typeof scope.steps2Do.onNext === 'function'){ scope.steps2Do.onNext(); }
                    doStepTimeoutMax = 40;
                    scope.doStep();
                };

                /* If previous step, decrement index, otherwise set to 0. Perform onPrevious function if exists */
                scope.doPrevious = function(){
                    scope.proxyIndex = scope.steps2Do.steps[scope.proxyIndex - 1] ? scope.proxyIndex - 1 : 0;
                    if(scope.steps2Do.hasOwnProperty('onPrevious') && typeof scope.steps2Do.onPrevious === 'function'){ scope.steps2Do.onPrevious(); }
                    doStepTimeoutMax = 40;
                    scope.doStep();
                };

                /* Remove walKthru classes, perform onDone function if exists, enable scrolling, clear out steps */
                scope.doDone = function(){
                    /* $timeout needed because external onDone may be called outside of scope.digest */
                    $timeout(function(){
                        if(scope.steps2Do.hasOwnProperty('onDone') && typeof scope.steps2Do.onDone === 'function'){ scope.steps2Do.onDone(); }
                        enableScroll();
                        scope.steps2Do = null;
                        angular.element(document.body).removeClass('c-walkthru__body');
                        angular.element(document.body).removeClass('c-walkthru__body_blur');
                        removeBlurries();
                        element.removeClass('active');
                        scope.steps = null;
                    });
                };

                /* Get styles for directive elements */
                scope.getBlockerStyle = function(key){
                    return scope.blockStyles[key];
                };

                /* If element property but element isn't present, set timeout to wait with a max wait of 2 seconds */
                var doStepTimeout = null;
                var doStepTimeoutMax = 40;
                scope.doStep = function(){
                    $timeout.cancel(doStepTimeout);
                    if(scope.steps2Do){
                        removeBlurries();
                        /* add disable blur classes to the walkthru directive */
                        if(scope.blur === true || scope.blur === 'true') cycleParents(element[0]);

                        var el = scope.steps2Do.steps[scope.proxyIndex].element ? document.querySelector(scope.steps2Do.steps[scope.proxyIndex].element) : null;
                        var messageBox = element[0].querySelector('.c-walkthru__box');

                        /* If message box is present and if element property and element exists, or no element property */
                        if((scope.steps2Do.steps[scope.proxyIndex].element && el || !scope.steps2Do.steps[scope.proxyIndex].element) && messageBox){
                            /* If step has a function, call it */
                            if(scope.steps2Do.steps[scope.proxyIndex].hasOwnProperty('fn') && typeof scope.steps2Do.steps[scope.proxyIndex].fn === 'function'){ scope.steps2Do.steps[scope.proxyIndex].fn(); }
                            /* Set message text/html */
                            scope.text = scope.steps2Do.steps[scope.proxyIndex].text;
                            setBtns();

                            if(scope.steps2Do.steps[scope.proxyIndex].element){
                                var max = 11;
                                /* If element exists, but no height(probably cause scope hasn't kicked in?) wait a second */
                                var setStyles = function(){
                                    var dimensions = el.getBoundingClientRect();
                                    if(!dimensions.height && max){
                                        setTimeout(function(){
                                            max--;
                                            setStyles();
                                        }, 100);
                                    }else{
                                        /* add disable blur classes to element and element parents */
                                        angular.element(el).addClass('walkthru_item');
                                        if(scope.blur === true || scope.blur === 'true') cycleParents(el);
                                        setPositioning(el, messageBox);
                                    }
                                };
                                setStyles();
                            }else{
                                setPositioning(null, messageBox);
                            }

                            $compile(element.contents())(scope);
                        }else if(doStepTimeoutMax){
                            /* no element found, try again */
                            doStepTimeout = $timeout(function(){
                                doStepTimeoutMax--;
                                scope.doStep();
                            }, 50);
                        }
                    }
                };

                /* Run the walkthru */
                scope.run = function(n){
                    if(scope.steps && scope.steps.steps && scope.steps.steps.length){
                        $timeout(function(){
                            disableScroll();
                            scope.steps2Do = angular.copy(scope.steps);
                            element.addClass('active');
                            scope.doStep();
                        });
                    }
                };

                /* Initialize walkthru, add active/blur classes and perform onInitialize if exists */
                scope.init = function(){
                    if(scope.steps && scope.steps.steps && scope.steps.steps.length){
                        /* $timeout needed because external onInitialize may be called outside of scope.digest */
                        $timeout(function(){
                            doStepTimeoutMax = 40;
                            if(scope.blur === true || scope.blur === 'true') angular.element(document.body).addClass('c-walkthru__body_blur');
                            angular.element(document.body).addClass('c-walkthru__body');
                            scope.proxyIndex = scope.index ? angular.copy(scope.index) : 0;
                            if(scope.steps.hasOwnProperty('onInitialize') && typeof scope.steps.onInitialize === 'function'){ scope.steps.onInitialize(); }
                            scope.run();
                        });
                    }
                };

                /* Start if steps already exist */
                if(scope.steps){ scope.init(); }

                /* Resize the message box and blockers if window is resized */
                var winResizeTimer = null;
                var doWindowResize = function(){
                    clearTimeout(winResizeTimer);
                    if(scope.steps){
                        /* Prevent too too many calls to scope.run(), goal to call when done resizing */
                        winResizeTimer = setTimeout(function(){ scope.run(); },20);
                    }
                };
                window.addEventListener('resize', doWindowResize, true);

                /* Watch for new steps */
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
