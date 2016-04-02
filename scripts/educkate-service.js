(function(eduCKate) {
    eduCKate.service("eduCKateService", function ($q, $timeout, $location) {
        var make_id = function(len){
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            for( var i=0; i < len; i++ ) text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        };

        var self = {
            active: false,
            _wrapper: null,
            _styles: null,
            _box: null,
            _top: null,
            _right: null,
            _bottom: null,
            _left: null,
            _text: null,
            _doneBtn: null,
            _prevBtn: null,
            _nextBtn: null,
            doneFunc: null,

            index: 0,
            steps: null,

            dom_it: function(){
                var defer = $q.defer();
                self._wrapper = document.getElementById('walkthru_wrapper');
                if(self._wrapper){ self._wrapper.parentNode.removeChild(self._wrapper);}

                var html = ''+
                '<div id="walkthru_wrapper">'+
                    '<div id="walkthru_styles"></div>'+
                    '<div id="walkthru_blockout_top"></div>'+
                    '<div id="walkthru_blockout_right"></div>'+
                    '<div id="walkthru_blockout_bottom"></div>'+
                    '<div id="walkthru_blockout_left"></div>'+
                    '<div id="walkthru_inner">'+
                        '<div id="walkthru_box">'+
                            '<div id="walkthru_box_inner">'+
                                '<div id="walkthru_box_text"></div>'+
                                '<div id="walkthru_box_buttons">'+
                                    '<button id="walkthru_box_done">done</button>'+
                                    '<button id="walkthru_box_prev">previous</button>'+
                                    '<button id="walkthru_box_next">next</button>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>';
                angular.element(document.body).append(html);


                self['_wrapper'] = angular.element(document.getElementById('walkthru_wrapper'));
                self['_styles'] = angular.element(document.getElementById('walkthru_styles'));
                self['_box'] = angular.element(document.getElementById('walkthru_inner'));
                self['_top'] = angular.element(document.getElementById('walkthru_blockout_top'));
                self['_right'] = angular.element(document.getElementById('walkthru_blockout_right'));
                self['_bottom'] = angular.element(document.getElementById('walkthru_blockout_bottom'));
                self['_left'] = angular.element(document.getElementById('walkthru_blockout_left'));
                self['_text'] = angular.element(document.getElementById('walkthru_box_text'));
                self['_doneBtn'] = angular.element(document.getElementById('walkthru_box_done'));
                self['_prevBtn'] = angular.element(document.getElementById('walkthru_box_prev'));
                self['_nextBtn'] = angular.element(document.getElementById('walkthru_box_next'));

                defer.resolve(true);
                return defer.promise;
            },

            cycleParents: function(el){
                if(el.parentNode && el.parentNode.tagName !== 'BODY'){
                    var $element = angular.element(el.parentNode);
                    $element.addClass('walkthru_item_parent');
                    self.cycleParents($element[0]);
                }
            },

            makeStyles: function($element, step){
                var style = '<style>#'+ $element.attr('id') + '{z-index:99999;';
                var position = $element.css("position");
                if(!position || position == 'static') style = style + 'position:relative;';
                if(step.styles){
                    style = style + step.styles;
                }
                style = style + '}</style>';
                self._styles.html(self._styles.html() + style);
            },

            doScroll: function($element){
                var scrll = 0;
                var scrollTo = $element.offset().top;
                document.body.scrollTop = scrollTo;

                var offset = $element[0].getBoundingClientRect();
                var boxOffset = self._box[0].getBoundingClientRect();

                if((offset.height + boxOffset.height) < window.innerHeight){
                    scrollTo = scrollTo - (((boxOffset.top - offset.height) / 2) );
                    document.body.scrollTop = scrollTo;
                }
            },

            positionBlockouts: function($element){
                if($element){
                    var offset = $element[0].getBoundingClientRect();
                    var left = offset.left;
                    var top = offset.top;
                    var bottom = $element.outerHeight() + top;
                    var right = $element.outerWidth() + left;
                    self._top.css({
                        'width': offset.width,
                        'height': offset.top,
                        'left': offset.left,
                        'top': top - offset.top
                    });
                    self._bottom.css({
                        'width': offset.width,
                        'height': window.innerHeight - (offset.top + offset.height),
                        'left': offset.left,
                        'top': offset.top + offset.height
                    });
                    self._left.css({
                        'width': offset.left,
                        'height': '100%',
                        'left': 0,
                        'top': 0
                    });
                    self._right.css({
                        'width': window.innerWidth - (offset.width + offset.left),
                        'height': '100%',
                        'right': 0,
                        'top': 0
                    });
                }else{
                    self._top.css({ 'width': '100%', 'height': '100%', 'left': 0, 'top': 0 });
                    self._right.css({ 'width': 0, 'height': 0, 'right': 0, 'top': 0 });
                    self._left.css({ 'width': 0, 'height': 0, 'left': 0, 'top': 0 });
                    self._bottom.css({ 'width': 0, 'height': 0, 'left': 0, 'top': 0 });
                }
            },

            run_steps: function(){
                self._styles.html('');
                angular.element(document.querySelector('.walkthru_item')).removeClass('walkthru_item');
                angular.element(document.querySelector('.walkthru_item_parent')).removeClass('walkthru_item_parent');

                var walkthru_box_next = document.getElementById('walkthru_box_next');
                walkthru_box_next.addEventListener('click', self.next, true);

                var walkthru_box_prev = document.getElementById('walkthru_box_prev');
                walkthru_box_prev.addEventListener('click', self.prev, true);

                var walkthru_box_done = document.getElementById('walkthru_box_done');
                walkthru_box_done.addEventListener('click', self.done, true);

                if(self.steps.initial && typeof self.steps.initial === 'function'){
                    self.steps.initial();
                    self.runner();
                }else{
                    self.runner();
                }
            },

            refreshStep: function(step){
                angular.element(document.querySelector('.walkthru_item')).removeClass('walkthru_item');
                angular.element(document.querySelector('.walkthru_item_parent')).removeClass('walkthru_item_parent');
                if(self.steps[self.index].element){
                    var $elements = angular.element(document.querySelectorAll(self.steps[self.index].element));
                    if($elements.length === 0){
                        $timeout(function(){self.runner();}, 500);
                    }else{
                        var $element = angular.element($elements[0]);
                        self.doScroll($element)
                        $element.addClass('walkthru_item');
                        $element.attr('id', $element.attr('id') || make_id(10));
                        self.makeStyles($element, self.steps[self.index]);
                        self.positionBlockouts($element);
                        self.cycleParents($element[0]);
                    }
                }else{
                    self.positionBlockouts($element);
                }
            },

            runner: function(){
                if(self.steps[self.index]){
                    self._styles.html('');
                    angular.element(document.querySelector('.walkthru_item')).removeClass('walkthru_item');
                    angular.element(document.querySelector('.walkthru_item_parent')).removeClass('walkthru_item_parent');

                    if(self.steps[self.index].func && typeof self.steps[self.index].func == 'function'){
                        self.steps[self.index].func(function(r){

                        });
                    }

                    self._text.text(self.steps[self.index].text);
                    if(self.steps[self.index].element){
                        var $elements = angular.element(document.querySelectorAll(self.steps[self.index].element));
                        if($elements.length === 0){
                            $timeout(function(){self.runner();}, 500);
                        }else{
                            var $element = angular.element($elements[0]);
                            self.doScroll($element)
                            $element.addClass('walkthru_item');
                            $element.attr('id', $element.attr('id') || make_id(10));
                            self.makeStyles($element, self.steps[self.index]);
                            self.positionBlockouts($element);
                            self.cycleParents($element[0]);
                        }
                    }else{
                        self.positionBlockouts($element);
                    }
                }else if(self.steps.complete && typeof self.steps.complete == 'function'){
                    self.steps.complete(function(c){

                    });
                }
            },

            next: function(){
                self.index = self.index + 1;
                self.runner();
            },

            prev: function(){
                self.index = self.index - 1;
                self.runner();
            },

            done: function(){
                self.index = 0;
                $timeout(function(){
                    self.steps = null;
                    self.active = false;
                    self._wrapper.remove();
                    self._styles.html('');
                    angular.element(document.querySelector('.walkthru_item')).removeClass('walkthru_item');
                    angular.element(document.querySelector('.walkthru_item_parent')).removeClass('walkthru_item_parent');
                    if(self.doneFunc && typeof self.doneFunc === 'function'){
                        self.doneFunc();
                    }
                });
            },

            run: function(options){
                self.steps = options;
                if(options.hasOwnProperty('doneFunc') && typeof options.doneFunc === 'function'){
                    self.doneFunc = options.doneFunc;
                }
                self.index = 0;
                self.dom_it().then(function(){
                    self.run_steps();
                });
            }
        };
        return self;
    });
})(angular.module('eduCKate'));
