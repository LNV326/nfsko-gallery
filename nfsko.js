// jquery.nfsko.js
;
(function($) {
	var nfsko = {};
	nfsko.defaults = {
		pupMenuClass : '.s_popupmenu',
		// Галерея
		galMainId : '#gallery_container',
		galLazyUpload : 10
	};
	nfsko._init = function() {
		self = this;
		this._initLangChanger();

		// this.test();
	};
	nfsko._initLangChanger = function() {
		return;
		$('#head_lang').hover(function() {
			$(this).find(nfsko.defaults.pupMenuClass).show();
		}, function() {
			$(this).find(nfsko.defaults.pupMenuClass).hide();
		});
	};
	nfsko.galleryMain = function() {
		$(nfsko.defaults.galMainId + ' .gallery_thumb').css({
			'position' : 'absolute',
			'display' : 'block'
		});
		var navigate = $('.gallery_navigate'),
			stapel = $(nfsko.defaults.galMainId).stapel({
					gutter : 2,
					pileAngles : 0,
					delay : 0,
					onLoad : function() {
						//$(stapel.items.find('.gallery_thumb_name')).hide();
						$(nfsko.defaults.galMainId + ' .gallery_thumb[data-pile!=""] .gallery_thumb_name').hide();
					},
					onBeforeOpen : function(pileName) {
						navigate.append('<a>' + pileName + '</a>');
						$(navigate.find('a:nth-child(1)')).on('click', function() {
							stapel.closePile();
							return false;
						});
						var group = $(nfsko.defaults.galMainId + ' .gallery_thumb[data-pile="'+pileName+'"] a').addAjaxy();
						group.find('.gallery_thumb_name').show();
					},
					onBeforeClose : function(pileName) {
						var elms = navigate.find('a:nth-child(2)');
						$(navigate.find('a:nth-child(1)')).unbind('click');
						$(navigate.find('a:nth-child(2)')).remove();
						var group = $(nfsko.defaults.galMainId + ' .gallery_thumb[data-pile="'+pileName+'"] a').removeAjaxy();
						group.find('.gallery_thumb_name').hide();
					}
				});
	};
	nfsko.loadAlbums = function(el) {
		var url = $(el).attr('href');
		$.get(url, {}, function(response) {
			$('#body_main').html('');
			$('#body_main').append(response['result']);
		}, 'json');
		return false;
	}
	
	
	test = function() {
		$('#link_gallery').on('click', function() {
			var uri = $(this).attr('href');
			$.get(uri, {}, function(response) { // РїС—Р…РїС—Р…РїС—Р…РїС—Р…РїС—Р…РїС—Р…РїС—Р…РїС—Р…
												// XML РїС—Р…РїС—Р…
												// РїС—Р…РїС—Р…РїС—Р…РїС—Р…РїС—Р…
												// example.xml
				$('#body_main').html('');
				$('#body_main').append(response['result']);
				// var tag = "<span>";
				// var span = $( tag );
				// span.append(response['result']);
				// var html = $(span).find('ul');
				// $('#body_main').append(html).masonry();
				// $('.gallery_new_container').masonry( 'reload' );
				// alert($(window).scrollTop());
				// if (response['status'] != 0)
				// send = false;
				/*
				 * $(xml).find('note').each(function(){ //
				 * РїС—Р…РїС—Р…РїС—Р…РїС—Р…РїС—Р…РїС—Р…РїС—Р…РїС—Р…РїС—Р… DOM
				 * РїС—Р…РїС—Р…РїС—Р…РїС—Р…РїС—Р…РїС—Р…РїС—Р…
				 * РїС—Р…РїС—Р…РїС—Р…РїС—Р…РїС—Р…РїС—Р…РїС—Р… РїС—Р…РїС—Р… XML
				 * $('#example-3').append('To: ' + $(this).find('to').text() + '<br/>')
				 * .append('From: ' + $(this).find('from').text() + '<br/>')
				 * .append('<b>' + $(this).find('heading').text() + '</b><br/>')
				 * .append( $(this).find('body').text() + '<br/>'); });
				 */
			}, 'json'); // РїС—Р…РїС—Р…РїС—Р…РїС—Р…РїС—Р…РїС—Р…РїС—Р…РїС—Р…РїС—Р…
						// РїС—Р…РїС—Р…РїС—Р…РїС—Р… РїС—Р…РїС—Р…РїС—Р…
						// РїС—Р…РїС—Р…РїС—Р…РїС—Р…РїС—Р…РїС—Р…
			return false;
		});
	};

	$.nfsko = function(method) {
		if (nfsko[method]) {
			return nfsko[method].apply(this, Array.prototype.slice.call(
					arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return nfsko._init(arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.nfsko');
		}
	};
	$.fn.mainGallery = function() {
//		$(nfsko.defaults.galMainId + ' .gallery_thumb a').on('click', function(){
//			return nfsko.loadAlbums(this);
//		});
		nfsko.galleryMain();
		
	};
})(jQuery);

$(document).ready(function() {
	$.nfsko();
	
	
	
	var $body = $('#body_main');
	$.Ajaxy.configure({
		'options': {
			root_url: 'http://symfony.nfsko.mooo.com',
			base_url: '/app_dev.php/',
			auto_ajaxify: false,
//			method: 'get'
		},
        'Controllers': {
            '_generic': {
                request: function(){
                	//alert('_generic request');
                	// Prepare
                    var Ajaxy = $.Ajaxy;
                    // Log what is happening
                    if ( Ajaxy.options.debug )
                    	window.console.debug('$.Ajaxy.Controllers._generic.request', [this,arguments]);
                    // Loading
                    //$body.addClass('loading');
                	return true;
                },
                response: function(){
                	//alert('_generic response');
                    // Prepare
                    var Ajaxy = $.Ajaxy; var data = this.State.Response.data; var state = this.state||'unknown';
                    // Log what is happening
                    if ( Ajaxy.options.debug )
                    	window.console.debug('$.Ajaxy.Controllers._generic.response', [this,arguments], data, state);
                    // Loaded
                    //$body.removeClass('loading');
                    // Title
                    var title = data.title||false; // if we have a title in the response
                    if ( title ) document.title = title; // if we have a new title use it
                    // Set data
                    if (data.result)
                    	$body.html(data.result);
                    return true;
                },
                error: function(){
                	alert('_generic error');
                	return true;
                }
            },
            'gallery-page': {
            	classname: 'ajaxy-page',
            	//matches: /^\/gallery\/?/,
            	request: function(){
            		alert('page request');
            		return true;
            	},
            	response: function(){
            		alert('page response');
            		return true;
            	}
            }
        }
	});
	
	//$('#body_menu').ajaxify();
	
    $("body").ajaxComplete(function(event, XMLHttpRequest, ajaxOption){
        if(XMLHttpRequest.getResponseHeader('x-debug-token')) {
            $('.sf-toolbarreset').remove();
            $('.sf-toolbar').remove();
            $.get(window.location.protocol+'//'+window.location.hostname+'/app_dev.php/_wdt/'+XMLHttpRequest.getResponseHeader('x-debug-token'),function(data){
            $('body').append(data);
        });
        }
    });

});


(function($) {
	var nfsko2 = {
		// Инициализация главного меню
		mainMenu : function( options ) {
			var menu = function(t) {
				this.element = t;		
			};
			menu.prototype = {
				element : null,
				// Активный селектор
				selector : null,
				// Инициализация главного меню
				initMenu : function() {
					this.element.children('.can_select').bind('click', function(){$.mainMenu.onSelectorClick(this);});
					this.element.children('.can_select').last().click();
				},
				// Действие по клику на селектор
				onSelectorClick : function(el) {
					if (this.selector !== el) {
						if (this.selector !== null)
							this.hideSubMenu(this.selector);
						this.showSubMenu(el);
						this.selector = el;
					}
				},
				// Скрытие подменю (служенбная функция)
				hideSubMenu : function(el) {
					if (el == null)
						el = this.selector;
					el.id = '';
					$(el).children('.menu_submenu').hide();
				},
				// Отображение подменю (служенбная функция)
				showSubMenu : function(el) {
					if (el == null)
						el = this.selector;
					el.id = 'active';
					$(el).children('.menu_submenu').show();
				}
			};
			if (!$.mainMenu) {
				$.mainMenu = new menu(this);
				$.mainMenu.initMenu();
			}			
//			// Действие по клику на элемент меню
//			$(this).children('li:not(.can_select)').bind('click', function(){
//				// Смена активного элемента
//				if (status.active !== this) {
//					if (status.active !== null)
//						status.active.id = '';
//					this.id = 'active';
//					status.active = this;
//				}
//				$(this).parent().children('.can_select').last().click();
//				//TODO Действие по нажатию
//				return false;
//			});
//			// Действие по клику на элемент подменю
//			$(this).find('.menu_submenu > li').bind('click', function(){
//				if (status.active !== null) {
//					alert(111);
//				}
//			});
		},
		// Инициализация альбома
		albumInit : function( options ) {
			var album = function(t) {
				this.element = t;		
			};
			album.prototype = {
				element : null,
				lazyLoadCount : 10,
				thumbnailsPath : 'thumbs/',
				// Инициализация группы изображений для предпоказа
				initGroup : function() {
					this.element.find('a').attr('rel','group');
					this.element.find('a[rel="group"]').unbind('click').fancybox();
				},
				// Деинициализация группы изображений для предпоказа
				removeGroup : function() {
					this.element.find('a').removeAttr('rel').unbind('click');
				},
				// Загрузка миниатюр
				loadThumbs : function() {
					var images = this.element.find('a:not(:has(img))'),
						showLine = $(window).height() + $(window).scrollTop(),
						count = 0,
						thumbnailsPath = this.thumbnailsPath;
					for ( var i = 0, c = images.length; i < c; i += this.lazyLoadCount) {
						var top = $(images.get(i)).offset().top;
						if (showLine < top) {
							count = i;
							break;
						}
					}
					if (i != 0 && count == 0)
						count = images.length;
					images.slice(0,count).each(function(){
						var thumbUrl = $(this).attr('href').replace(/(.+?)([^\/]+?\.jpg)/, "$1" + thumbnailsPath + "$2");
						$(this).append($('<img>', {'src' : thumbUrl}));
					});
				},
				// Получение группы изображений
				getGroup : function() {
					return this.element.find('a');
				},
				// Получение группы изображений с изменившимся статусом
				getSelected : function() {
					return this.element.find('a[new_status]');
				}			
			};
			if (!$.album) {
				$.album = new album(this);
				$.album.initGroup();
				$.album.loadThumbs();
				$(document).bind('scroll', function() {
					$.album.loadThumbs();
				});
			}	
		},
		// Инициализация управления альбомом
		albumManageInit : function() {
			var albumManage = function(t) {
				this.element = t;
				this.init_but = $(t.children(".icon[info='main']"));
				this.c_panel = $(t.children(".control_panel[info='confirm']"));
				this.b_panel = $(t.children(".control_panel[info='buttons']"));
			};
			albumManage.prototype = {
					element : null,
					init_but : null,
					c_panel : null,
					b_panel : null,
					buttons : null,	// Массив клавиш управления
					info : null,	// Поле информационных сообщений
					// Инициализация клавишь управления
					initButtons : function() {
						var b = this.b_panel;
						this.buttons = {
							addButton : b.children("li[info='add']"),
							hideButton : b.children("li[info='hide']"),
							moveButton : b.children("li[info='move']"),
							trashButton : b.children("li[info='trash']"),
							// Клавиши подтверждения/отмены
							okButton : this.c_panel.find("button[info='ok']"),
							cancelButton : this.c_panel.find("button[info='cancel']")
						};
						// Главная кнопка
						this.init_but.bind('click',function(){$.albumManage.onMainClick();});
						// Кнопки действий
						this.buttons.addButton.bind('click',$.albumManage.onAddClick);
						this.buttons.hideButton.bind('click',function(){$.albumManage.onHideClick();});
						this.buttons.moveButton.bind('click',function(){$.albumManage.onMoveClick();});
						this.buttons.trashButton.bind('click',function(){$.albumManage.onTrashClick();});
						// Клавиши подтверждения/отмены
						this.buttons.okButton.bind('click',function(){$.albumManage.onOkClick();});
						this.buttons.cancelButton.bind('click',function(){$.albumManage.onCancelClick();});
					},
					// Действие при нажатии главной кнопки
					onMainClick : function() {
						if (this.b_panel.is(":visible")) {
							this.onCancelClick();
						} else {
							// Cкрытие подменю
							$.mainMenu.hideSubMenu();
							//var pos = $('#body_menu').offset();
							//this.b_panel.offset(pos);
							this.b_panel.show();
						}
							
					},
					// Действие при нажатии на любую клавишу управления
					_onButtonClick : function(button, toggleFunc) {
						var about = button.attr('about');
						if (about != null) {
							this.c_panel.children('.about').text(about);
							this.b_panel.hide();
							this.c_panel.show();
						}
						//this.info.text(info);
						// Отключение показа изображений по клику
						$.album.removeGroup();	
						var images = $.album.getGroup();
						images.bind('click', function(){
							toggleFunc.call(this);
							return false;
						});	
					},
					// Переключение статуса изображения
					_toggleStatusImage : function(img, onStat, offStat) {
						var status = img.attr('status');
						var newStatus = img.attr('new_status');
						if (newStatus)
							img.removeAttr('new_status');
						else {
							status == onStat ? status = offStat : status = onStat;
							img.attr('new_status', status);
						}
					},
					// Переключение видимости изображения
					_toggleHideImage : function() {
						$.albumManage._toggleStatusImage($(this),'show','hide');			
					},
					// Выбор изображения для перемещения
					_toggleMoveImage : function() {
						$.albumManage._toggleStatusImage($(this),'show','move');	
					},
					// Перемещение изображения в корзину и обратно
					_toggleTrashImage : function() {
						$.albumManage._toggleStatusImage($(this),'show','trash');
					},
					// Установка или отмена изменений статуса
					clearSelection : function(cancel) {
						var images = $.album.getSelected();
						// Если применение изменений
						if (cancel === false)
							images.each(function(){
								$(this).attr('status', $(this).attr('new_status'));
							});
						images.removeAttr('new_status');
					},
					// Инициализация кнопки добавления изображений в альбом
					onAddClick : function() {
						$(this).fancybox({
							width: 640,
							height: 480,
							autoSize : false,
							type : 'ajax',
							afterLoad : function() {
//								if (jQuery.inArray(typeof this.content, ['object', 'string'])) {
//									var response = jQuery.parseJSON(this.content);			
//									this.content = response['result'];
//								} else {
//									alert(typeof this.content);
//								}
							}
						});
					},
					// Инициализация кнопки отображения изображений (если скрыты или в корзине)
					onHideClick : function() {
						this._onButtonClick(this.buttons.hideButton, this._toggleHideImage);
					},
					// Инициализация кнопки перемещения изображений
					onMoveClick : function() {
						this._onButtonClick(this.buttons.moveButton, this._toggleMoveImage);
					},
					// Инициализация кнопки перемещения изображений в корзину
					onTrashClick : function() {
						this._onButtonClick(this.buttons.trashButton, this._toggleTrashImage);
					},
					// Действия по нажатию клавиши подтверждения
					onOkClick : function(confirm) {
						var method,
							showIds = [],
							hideIds = [],
							moveIds = [],
							trashIds = [];
						// Сортировка новых статусов изображений по категориям
						$.album.getSelected().each(function(){
							var id = $(this).attr('uid');
							switch ($(this).attr('new_status')) {
								case 'show': showIds.push(id); break;
								case 'hide': hideIds.push(id); break;
								case 'move': moveIds.push(id); break;
								case 'trash': trashIds.push(id); break;
							}
						});
						confirm == true ? method = 'post' : method = 'get';
						$.ajax({
							cache : false,
							url : this.buttons.hideButton.attr('href'),
							data : {'showIds' : showIds, 'hideIds' : hideIds, 'moveIds' : moveIds, 'trashIds' : trashIds},
							dataType : 'json',
							type : method,
							success : this._onResponse 
						});
//						$.get(this.buttons.hideButton.attr('href'), {'showIds' : showIds, 'hideIds' : hideIds, 'moveIds' : moveIds, 'trashIds' : trashIds}, this._onResponse, 'json');
					},
					// Действия по нажатию клавиши отмены (для клавиш отображения, скрытия и перемещения)
					onCancelClick : function(cancel) {
						this.clearSelection(cancel);
						$.album.initGroup();
						this.c_panel.hide();
						this.b_panel.hide();	
						// Отображение подменю
						$.mainMenu.showSubMenu();
					},
					// Функция реагирования на ответ сервера
					_onResponse : function(data) {
						$.fancybox({
							modal : true,
							content : data['result'],
							afterShow : function() {
								var el = $.album.element;
								$.album.element = this.inner;
								$.album.loadThumbs();
								$.album.element = el;
								$.fancybox.resize();
							}
						});
					},
					// Подтверждение изменений
					confirm : function() {
						$.fancybox.close();
						this.onOkClick(true);
						this.onCancelClick(false);
					}
				};
			if (!$.albumManage) {
				$.albumManage = new albumManage(this);
				$.albumManage.initButtons();
			}
		},
		// Инициализация управления альбомом
		categoryManageInit : function() {
			var categoryManage = function(t) {
				this.element = t;
				this.init_but = $(t.children(".icon[info='main']"));
				this.c_panel = $(t.children(".control_panel[info='confirm']"));
				this.b_panel = $(t.children(".control_panel[info='buttons']"));
			};
			categoryManage.prototype = {
					element : null,
					init_but : null,
					c_panel : null,
					b_panel : null,
					buttons : null,	// Массив клавиш управления
					info : null,	// Поле информационных сообщений
					// Инициализация клавишь управления
					initButtons : function() {
						var b = this.b_panel;
						this.buttons = {
							addButton : b.children("li[info='add']"),
							hideButton : b.children("li[info='hide']"),
							moveButton : b.children("li[info='move']"),
							trashButton : b.children("li[info='trash']"),
							// Клавиши подтверждения/отмены
							okButton : this.c_panel.find("button[info='ok']"),
							cancelButton : this.c_panel.find("button[info='cancel']")
						};
						// Главная кнопка
						this.init_but.bind('click',function(){$.albumManage.onMainClick();});
						// Кнопки действий
						this.buttons.addButton.bind('click',$.albumManage.onAddClick);
						this.buttons.hideButton.bind('click',function(){$.albumManage.onHideClick();});
						this.buttons.moveButton.bind('click',function(){$.albumManage.onMoveClick();});
						this.buttons.trashButton.bind('click',function(){$.albumManage.onTrashClick();});
						// Клавиши подтверждения/отмены
						this.buttons.okButton.bind('click',function(){$.albumManage.onOkClick();});
						this.buttons.cancelButton.bind('click',function(){$.albumManage.onCancelClick();});
					}
			};
		}
	};	
	$.fn.nfsko2 = function( options ) {
		if ( typeof options === 'string' && nfsko2[ options ]) {
			return nfsko2[ options ].apply(this, Array.prototype.slice.call( arguments, 1 ));
		}
	};
})(jQuery);

$(document).ready(function(){
	$('#menu_main').nfsko2('mainMenu');
});
