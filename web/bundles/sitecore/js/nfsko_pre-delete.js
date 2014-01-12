(function($) {
	var nfsko = {
		// ��� �������, ��������� � ������������� �������
		//
		/* Функции, связанные с галереей
		 * 
		 * История изменений:
		 * 1.0 Файл создан
		 * 1.1 Вынесено в отдельные классы: thumbClass, hashClass, thumbUploadClass, fancyBoxButtonsClass, albumClass, mainPageClass
		 * 1.2 Рефакторинг thumbClass, albumClass, fancyBoxButtonsClass, mainPageClass
		 */
		gallery : function(options) {
						
			// Функции для работы с миниатюрой (вызываются в контекте миниатюры)
			var thumbClass = function(obj) {
				/* Под obj понимается следующий код:
				 * <li class='gallery_thumb small' id='thumb-template'> <!-- ID есть лишь у заготовки -->
				 * 	<a href='...' status="show" imgid="...">
				 * 		<img/> <!-- Отсутствует в исходном коде, подставляется при обработке в JS -->
				 * 	</a>
				 *	<div class="ui-progressbar"></div> <!-- Присутствует только в заготовке -->
				 * </li>
				 */
				this._init(obj);
			};
			thumbClass.prototype = {
					obj : null,
					a : null,
					img : null,
					progressBar : null,
					thumbnailsPath : 'thumbs/',
					thumbnailsTemplate : null,
					// Конструктор
					_init : function(obj) {
						if ((obj === null) || (!obj.is('li.gallery_thumb.small') ))
							throw new Error("Error in thumbClass: входной объект не соответствует шаблону");
						this.obj = obj;
						this.a = this.obj.children('a');
						if (this.a.length == 0) {
							throw new Error("Error in thumbClass: не найден тэг A");
						}
						this.img = this.a.children('img');
						// Добавление тэга IMG в случае отсутствия
						if (this.img.length == 0) {
							this.img = $('<img>');
							this.a.append(this.img);
						}
						// Если obj - клон от thumb-template
						if (this.obj.attr('id') == 'thumb-template')
							this.obj.attr('id','');
						this.initVisibilityButtons();
					},
					// Возвращает адрес миниатюры
					_getThumbSrc : function() {
						return this.a.attr('href').replace(
								/(.+?)([^\/]+?\.[jpg,jpeg])/,
								"$1" + this.thumbnailsPath + "$2");
					},
					// Устанавливает формат миниатюры (книжный/альбомный)
					_format : function() {
						if (this.img.width() / this.img.height() < 1)
							this.obj.addClass('book');
						else
							this.obj.addClass('album');
					},
					// Устанавливает миниатюру из URL
					setImg : function(url) {
						url = url || this._getThumbSrc();
						var t = this;
						this.img.bind('load', function() {
							t._format();
						}).attr('src', url);
					},
					setThumbnailsTemplate : function(obj) {
						if ((obj === null) || (!obj.is('li.gallery_thumb.small#thumb-template') ))
							throw new Error("Error in thumbClass: заготовка не соответствует шаблону");
						this.thumbnailsTemplate = obj;					
					},
					// Создание полосы загрузки
					createProgressBar : function() {
						var t = this;
						this.progressBar = $('<div>');
						this.obj.append(this.progressBar);
						this.progressBar.progressbar({
							max: 100,
							value: 0,
							complete: function( event, ui ) {
								setTimeout(function() {
									t.progressBar.progressbar("destroy");
									// Перемещение миниатюры
									$.album.addThumb(t.obj.remove());
									$.album.initGroup(); 
								}, 1000);
							}
						});
					},
					// Обновление прогресса загрузки
					updateProgressBar : function(percent) {						
						this.progressBar.progressbar("option", "value", percent);
					},								
					// Создание из файла
					createFromFile : function(file) {
						var thumb = new thumbClass(this.thumbnailsTemplate.clone()),
							reader = new FileReader();
						reader.onload = function(e) {
							// e.target.result содержит путь к изображению
							thumb.setImg(e.target.result);	
						};						
						// Считываем файл
						reader.readAsDataURL(file);
						// Создаём полосу загрузки
						thumb.createProgressBar();
						$.data(file, thumb);					
						return thumb;
					},
					// Завершение процасса загрузки
					uploadDone : function(response) {
						// response - JSON объект, содержащий: error,
						// result
						// result содержит: imgUrl, imgId, imgStatus
						// error содержит: code, text
						if (response.error != 'undefined' && response.error !== null) {
							this.obj.addClass('error');
							this.progressError(response.error);
						} else {
							this.obj.addClass('new');
							this.updateProgressBar(100);
							this.a.attr('href', response.result.imgUrl)
								.attr('imgid', response.result.imgId)
								.attr('status',	response.result.imgStatus);
							this.setImg();
						}
					},
					// Ошибка загрузки изображения
					uploadError : function(errCode) {	
						if (this.progressBar !== null)
							this.progressBar.progressbar("option", "value", 'auto').text(errCode);
					},
					toggleVisibility : function(element) {
						var t = this;
						var request = $.ajax({
							  url: $(element).attr('href'),
							  type: "POST",
							  dataType: "json"
						}).done(function( response ) {
							if (response.status == 'Success')
								t.a.attr('status',response.body.image_visibility);
						}).fail(function( jqXHR, textStatus ) {
							  alert( "Request failed: " + textStatus );
						});
						return false;
					},
					initVisibilityButtons : function() {
						var t = this;
						this.obj.find('div.buttons div').each(function(){
							$(this).bind('click',function(){t.toggleVisibility(this)});
						});
					},
					visibilityHandler : function(response) {
						
					}					
			};
			
			// Функции для работы с хэшем
			var hashClass = function() {};
			hashClass.prototype = {
					// Проверяет хэш адресной строки браузера на запуск скриптов
					checkHash : function() {
//						var hash = window.location.hash.replace('#', '');
//						if (hash !== null) {
//							hash = hash.split('_');
//							if (hash[0] == 'image') {
//								var img = this.t.find('a[imgid=' + hash[1] + ']');
//								if (img !== null)
//									img.click();
//							}
//						}
					},
					// Устанавливает хэш-часть адресной строки браузера
					setHash : function(hash) {
						window.location.hash = hash;
					}
			};
						
			// Общие кнопки с интерфейсом fancybox (ajax)
			var fancyBoxButtonsClass = function(obj) {
				/*
				 * Под obj понимается следующий код:
				 * <div class="fb-dialog right">
				 * 	<a href='...'>Добавить</a>
				 * </div>
				 */
				this._init(obj);
			};
			fancyBoxButtonsClass.prototype = {
					// Конструктор
					_init : function(obj) {
						if ((obj === null) || (!obj.is('div.fb-dialog.right') ))
							throw new Error("Error in fancyBoxButtonsClass: входной объект не соответствует шаблону");
						this.obj = obj;
						this.buttons = this.obj.find('a');
						if (this.buttons.length > 0)
							this.buttons.fancybox({
								type : 'ajax',
								width : 640,
								height : 480,
								autoSize : false
							});					
					}
			};
			
			
			// Функции для работы с альбомом
			var albumClass = function(obj) {
				/*
				 * Под obj понимается следующий код:
				 * <ul class='gallery_container' id='album'>
				 * 	<div id='gallery_exception'>No images in album</div>
				 * 	<li class='gallery_thumb small'>...</li>
				 * </ul>
				 */
				this._init(obj);
			};
			albumClass.prototype = {
//					thumbs : null,
					noimages : null,
					lazyLoadInProgress : false,
					// Конструктор
					_init : function(obj) {
						if ((obj === null) || (!obj.is('ul.gallery_container#album') ))
							throw new Error("Error in albumClass: входной объект не соответствует шаблону");
						this.obj = obj;
						this.noimages = this.obj.find('div#gallery_exception');
						this.initGroup();
						this._lazyLoad();
						var t = this;
						$(document).bind('scroll', function() {
							t._lazyLoad();
						});
					},
					// Возвращает все миниатюры
					_getThumbs : function() {
						// Получение миниатюр реализовано функцией, так как число миниатюр может меняться
						return this.obj.find('li.gallery_thumb');
					},
					// Возвращает миниатюры без img
					_getThumbsWithoutImg : function() {
						// Реализовано в виде функции, так как число миниатюр без img может меняться
						return this.obj.find('li.gallery_thumb:not(:has(img))');
					},
					// Ленивая загрузка изображений
					_lazyLoad : function() {
						if (this.lazyLoadInProgress)
							return;
						this.lazyLoadInProgress = true;
						// Поиск миниатюр без изображений
						var thumbs = this._getThumbsWithoutImg(),
							showLine = $(window).height() + $(window).scrollTop();
						// Тут применяется метод двоичного поиска
						// ... не зря я проучился 5 лет в институте...
						var start = 0,
							stop = thumbs.length-1,
							current = 0;
						while (start < stop) {
							current = Math.round(start + (stop-start)/2);							
							var thumb = $(thumbs.get(current));
							// Если миниатюра видима
							if (showLine > thumb.offset().top)
								start = current;
							else 
								stop = current;
							if (start+1 == stop)
								start++;
						}
						// Отображение img у миниатюр, начиная с первой без img и до границы экрана
						for (current = 0; current <= stop; current++)
							$(thumbs.get(current)).thumb();
							//new thumbClass($(thumbs.get(current))).setImg();
						this.lazyLoadInProgress = false;
					},
					// Инициализация fancybox для миниатюр			
					initGroup : function() {
						this._toggleException();
						this._getThumbs().find('a').attr('rel', 'group').unbind('click').fancybox({
								nextEffect : 'none',
								prevEffect : 'none',
							    helpers : {
							        title: {
							            type: 'inside'
							        }				
							    },
							    afterLoad : function() {
							    	this.title = 'Изображение ' + (this.index + 1) + ' из ' + this.group.length + (this.title ? ' - ' + this.title : '');
							    },
//								tpl : {
//									wrap : '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div><div class="image-links"></div></div></div>'
//								},
//								beforeLoad : function() {
//									var imgid = $(this.element).attr('imgid');
//									$.album.setHash('image_' + imgid);
//								},
//								afterClose : function() {
//									$.album.setHash('');
//								},
//								afterLoad : function() {
//									var getLinks = function(
//											img, thumb) {
//										var arr = [ {
//											name : 'BBCode',
//											code : '[url=' + img + '][img]' + thumb + '[/img][/url]'
//										} ];
//										return arr;
//									}
//									var img = this.href, thumb = t.thumbClass.getThumb(this.element);
//									this.linkBox = this.skin.find('.image-links');
//									for ( var i = 0, l = getLinks(img, thumb); i < l.length; i++) {
//										var elm = l[i],
//											name = $('<span>').text(elm.name),
//											code = $('<input>').attr('type', 'text').attr('value', elm.code).attr('readonly', 1).bind('click', function() {
//												this.select()
//											}),
//											link = $('<div>').addClass('image-link').append(name).append(code);
//										this.linkBox.append(link);
//									}
//								}
						});
					},
					// Уничтожает fancybox для изображений, убирает onclick
					removeGroup : function() {
						this._getThumbs().find('a').removeAttr('rel').unbind('click');
					},
					// Добавляет изображение в начало
					addThumb : function(thumb) {
						this.obj.prepend(thumb);
					},
					// Скрытие сообщения альбома
					_toggleException : function() {
						if (this._imagesCount() > 0)
							this.noimages.hide();
						else this.noimages.show();
					},
					// Количество изображений
					_imagesCount : function() {
						return this.obj.children('li').length;
					}
			};
			
			
			// Функции для работы с главной страницей галереи
			var mainPageClass = function(obj) {
				/*
				 * Под obj понимается следующий код:
				 * <ul class='gallery_container' id='catalog'>
				 * 	<li class='gallery_thumb big' data-pile='...'>
				 * 		<a href='...' status='show'>
				 * 			<div class='gallery_thumb_name'>...</div>
				 * 		</a>
				 * 	</li>
				 * </ul>
				 */
				this._init(obj);
				this.initGroups();				
			};
			mainPageClass.prototype = {
					// Конструктор
					_init : function(obj) {
						if ((obj === null) || (!obj.is('ul.gallery_container#catalog') ))
							throw new Error("Error in mainPageClass: входной объект не соответствует шаблону");
						this.obj = obj;
						this.thumbs = this.obj.children('li.gallery_thumb');
					},
					// Отображает названия миниатюр
					_showNames : function() {
						// Реализовано в виде отдельной функции, потому что... ну хер его знает, не работает из параметра вызов
						this.obj.find('div.gallery_thumb_name').show();
					},
					// Скрывает названия миниатюр
					_hideNames : function() {
						// Реализовано в виде отдельной функции, потому что... ну хер его знает, не работает из параметра вызов
						this.obj.find('div.gallery_thumb_name').hide();
					},
					// Инициализация групп категорий
					initGroups : function() {
						this.thumbs.css({
							'position' : 'absolute',
							'display' : 'block'
						});
						var t = this;
						stapel = this.obj.stapel({
								gutter : 2,
								pileAngles : 0,
								delay : 0,
								// Действие после загрузки всех миниатюр
								onLoad : function() { t._onLoad(); },
								// Действие перед открытием группы
								onBeforeOpen : function(pileName) { t._onBeforeOpen(pileName); },
								// Действие перед закрытием группы
								onBeforeClose : function(pileName) { t._onBeforeClose(pileName); }
						});
					},
					// Действие после загрузки всех миниатюр
					// Скрываем названия элементов
					_onLoad : function() {
						this._hideNames();
					},
					// Действие перед открытием группы
					// Показываем названия элементов, проставляем навигацию
					_onBeforeOpen : function(pileName) {
//						navigate.append('<a>' + pileName + '</a>');
//						navigate.find('a:first-child').on('click', function() {
//								stapel.closePile();
//								return false;
//						});
						this._showNames();
					},
					// Действие перед закрытием группы
					// Скрываем названия элементов, очищаем навигацию
					_onBeforeClose : function(pileName) {
//						navigate.find('a:last-child').remove();
//						navigate.find('a:first-child').unbind('click');
						this._hideNames();
					}
			};

			
			// Область загрузки изображений
			var dropAreaClass = function(obj) {
				/*
				 * Под obj понимается следующий код:
				 * <ul class='gallery_container' id='droparea'>
				 * 	<li class='gallery_thumb small' id='thumb-template'>
				 * 		<a href="" status="show" imgid=""></a>
				 * 	</li>
				 * 	<div id='dropbox'></div>
				 * 	<input type='file' multiple class='hide' id='input-files' destination='...'></input>
				 * </ul>
				 */
				this._init(obj);
			};
			dropAreaClass.prototype = {
				// Конструктор
				_init : function(obj) {					
					if ((obj === null) || (!obj.is('ul.gallery_container#droparea') ))
						throw new Error("Error in dropAreaClass: входной объект не соответствует шаблону");
					this.obj = obj;
					this.dropbox = this.obj.children('#dropbox');
					this.input = this.obj.children('#input-files');
					this.thumbTemplate = this.obj.children('li.gallery_thumb.small#thumb-template');
					if (this.dropbox.length == 0)
						throw new Error("Error in dropAreaClass: не найден #dropbox");
					if (this.input.length == 0)
						throw new Error("Error in dropAreaClass: не найден #input-files");
					if (this.thumbTemplate.length == 0)
						throw new Error("Error in dropAreaClass: не найден #thumb-template");
					// Установка заготовки
					thumbClass.prototype.setThumbnailsTemplate(this.thumbTemplate);
					// Перенаправление клика на скрытый input
					var t = this;
					this.dropbox.bind('click', function() {
						t.input.trigger('click');
					});
					this.dropbox.filedrop({
						fallback_id : t.input.attr('id'), // Загрузка файлов из input
						paramname : 'image', // Имя поля в $_FILES
						maxfilesize : 1, // в Мб
						queuewait : 100,
						allowedfiletypes : [ 'image/jpeg' ],
						url : t.input.attr('destination'),
						// Переименование файла (если в названии будут русские буквы, то загрузка зафейлится)
						rename : t._fileRename,
						// Вызывается перед загрузкой для каждого файла
						beforeEach : function(file) { return t._addThumbFromFile(file); },
						// Обновление процесса загрузки
						progressUpdated : t._updateThumbProgress,
						// Завершение процасса загрузки
						uploadFinished : t._updateThumbFinished,
						// Обработка ошибки загрузки, отловленная загрузчиком
						error : t._onError
					});
				},
				// Переименование файла перед загрузкой
				_fileRename : function(name) {
					var date = new Date(),
						newName = date.getFullYear()
									+ date.getMonth() + date.getDate()
									+ date.getTime();
					return name.replace(/(.+?)(\[jpg,jpeg])/, newName + "$2");
				},
				// Вставка миниатюры в область загрузки
				_addThumbFromFile : function (file) {				
					var thumb = thumbClass.prototype.createFromFile(file);
					this.obj.append(thumb.obj);
					return true;
				},
				// Обновление процесса загрузки
				_updateThumbProgress : function(i, file, progress) {
					$.data(file).updateProgressBar(progress);
				},
				// Завершение процасса загрузки
				_updateThumbFinished : function(i, file, response) {
					$.data(file).progressDone(response);
				},
				// Обработка ошибки загрузки, отловленная загрузчиком
				_onError : function(errCode, file) {
					var data = $.data(file);
					if (!$.isEmptyObject(data))
						data.progressError(errCode);
					else
						alert(errCode);
				}
			};
			
			// Окно создания нового альбома
			var addAlbumClass = function(obj) {
				this._init(obj);
			};
			addAlbumClass.prototype = {
				_init : function(obj) {
					this.obj = obj;
					this.choices = this.obj.children('select');
					var t = this;
					this.obj.children('button[type="submit"]').bind('click', function() {
						var request = $.ajax({
							  url: t.obj.attr('action'),
							  type: "POST",
							  data: { 'albums' : t.choices.val() },
							  dataType: "json"
						}).done(function( response ) {
							  alert(response.body.album_url);
							  window.location.replace(response.body.album_url);
						}).fail(function( jqXHR, textStatus ) {
							  alert( "Request failed: " + textStatus );
						});
						return false;
					});
				}
			};
			
			if (this.is('.gallery_container#catalog')) {
				$.catalog = new mainPageClass($('.gallery_container#catalog'));
				var b = new fancyBoxButtonsClass($('.fb-dialog'));
			}
			if (this.is('.gallery_container#category')) {
				var b = new fancyBoxButtonsClass($('.fb-dialog'));
			}
			if (this.is('.gallery_container#album')) {
				$.album = new albumClass($('.gallery_container#album'));
				var b = new fancyBoxButtonsClass($('.fb-dialog'));
			}
			if (this.is('.gallery_container#droparea')) {
				$.droparea = new dropAreaClass($('.gallery_container#droparea'));
			}
			if (this.is('#form')) {
				$.addAlbum = new addAlbumClass(this);
			}

//			if (typeof options === 'string' && gallery[options]) {
//				return gallery[options].apply(this, Array.prototype.slice.call(
//						arguments, 1));
//			}
		}
	};
	$.fn.nfsko = function(options) {
		if (typeof options === 'string' && nfsko[options]) {
			return nfsko[options].apply(this, Array.prototype.slice.call(
					arguments, 1));
		}
	};
})(jQuery);

$(document).ready(function() {
	// $('#menu_main').nfsko('mainMenu');
});