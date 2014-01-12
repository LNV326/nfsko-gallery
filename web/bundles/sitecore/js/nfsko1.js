(function($) {
	var nfsko = {
		// ��� �������, ��������� � ������������� �������
		//
		// Функции, связанные с галереей
		gallery : function(options) {
			// Функции для работы с миниатюрой (вызываются в контекте миниатюры)
			var thumbs = function() {};
			thumbs.prototype = {
					thumbnailsPath : 'thumbs/',
					thumbnailsTemplate : null,
					// Возвращает адрес миниатюры
					getThumb : function(thumb_a) {
						return thumb_a.attr('href').replace(
								/(.+?)([^\/]+?\.[jpg,jpeg])/,
								"$1" + this.thumbnailsPath + "$2");
					},
					// Устанавливает миниатюру
					setImg : function(thumb) {
						var a = thumb.find('a'), thumbUrl = this
								.getThumb(a), img = a.find('img'), t = this;
						if (img.length == 0) {
							img = $('<img>');
							a.append(img);
						}
						img.bind('load', function() {
							t.format(thumb);
						});
						img.attr('src', thumbUrl);
					},
					// Устанавливает формат миниатюры
					// (книжный/альбомный)
					format : function(thumb) {
						var img = thumb.find('img');
						if (img.width() / img.height() < 1)
							thumb.addClass('book');
						else
							thumb.addClass('album');
					},
					// Обновление прогресса загрузки
					progressUpdate : function(thumb, percent) {
						var progress = thumb.find('.progress');
						if (progress.length > 0)
							progress.width(percent);
					},
					// Завершение процасса загрузки
					progressDone : function(thumb, response) {
						// response - JSON объект, содержащий: error,
						// result
						// result содержит: imgUrl, imgId, imgStatus
						// error содержит: code, text
						if (response.error != 'undefined'
								&& response.error !== null) {
							this.progressError(thumb, response.error);
						} else {
							thumb.addClass('new');
							var progress = thumb
									.find('.progressHolder');
							if (progress.length > 0)
								progress.remove();
							var a = thumb.find('a');
							a.attr('href', response.result.imgUrl)
									.attr('imgid',
											response.result.imgId)
									.attr('status',
											response.result.imgStatus);
							this.setImg(thumb);
						}
					},
					// Ошибка загрузки изображения
					progressError : function(thumb, errCode) {
						thumb.addClass('error');
						var progress = thumb.find('.progress');
						if (progress.length > 0) {
							progress.width('auto');
							progress.text(errCode);
						}
					},
					// Создание миниатюры из файла перед загрузкой
					create : function(file) {
						var thumb = this.thumbnailsTemplate.clone(), img = thumb
								.find('img'), reader = new FileReader();
						reader.onload = function(e) {
							// e.target.result содержит путь к
							// изображению
							img.attr('src', e.target.result);
						};
						// Считываем файл
						reader.readAsDataURL(file);
						$.data(file, thumb);
						return thumb;
					}
			};
			
			
			
			
			var gallery = {
				// Инициализация главной страницы галереи
				initMain : function(options) {
					var mainG = function(t) {
						this.t = t;
					};
					mainG.prototype = {
						initGroups : function() {
							this.t.children('.gallery_thumb').css({
								'position' : 'absolute',
								'display' : 'block'
							});
							var navigate = $('.gallery_navigate'), // TODO
																	// ����������
																	// �
																	// ��������
																	// �����
																	// ���������
							t = this.t;
							stapel = this.t
									.stapel({
										gutter : 2,
										pileAngles : 0,
										delay : 0,
										onLoad : function() {
											// $(stapel.items.find('.gallery_thumb_name')).hide();
											t
													.find(
															'.gallery_thumb[data-pile!=""] .gallery_thumb_name')
													.hide();
										},
										// Действие перед открытием группы
										// Показываем названия элементов,
										// проставляем навигацию
										onBeforeOpen : function(pileName) {
											navigate.append('<a>' + pileName
													+ '</a>');
											navigate.find('a:first-child').on(
													'click', function() {
														stapel.closePile();
														return false;
													});
											var group = t
													.find('.gallery_thumb[data-pile="'
															+ pileName + '"] a'); // .addAjaxy();
																					// TODO
																					// �����������
																					// �����
											group.find('.gallery_thumb_name')
													.show();
										},
										// Действие перед закрытием группы
										// Скрываем названия элементов, очищаем
										// навигацию
										onBeforeClose : function(pileName) {
											navigate.find('a:last-child')
													.remove();
											;
											navigate.find('a:first-child')
													.unbind('click');
											var group = t
													.find('.gallery_thumb[data-pile="'
															+ pileName + '"] a');// .removeAjaxy();
																					// TODO
																					// ����������
																					// �����
											group.find('.gallery_thumb_name')
													.hide();
										}
									});
						}
					};
					if (!$.mainG) {
						$.mainG = new mainG(this);
						$.mainG.initGroups();
						$('.fb-dialog a').fancybox();
					}
				},
				// Инициализация альбома
				initAlbum : function(options) {
					var album = function(t) {
						this.t = t;
					};
					album.prototype = {
						element : null,
						lazyLoadCount : 10,
						thumbnailsPath : 'thumbs/',
						// ������������� ������ ����������� ��� ����������
						initGroup : function() {
							this.t.find('a').attr('rel', 'group');
							var t = this;
							this.t
									.find('a[rel="group"]')
									.unbind('click')
									.fancybox(
											{
												tpl : {
													wrap : '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div><div class="image-links"></div></div></div>'
												},
												nextEffect : 'none',
												prevEffect : 'none',
												beforeLoad : function() {
													var imgid = $(this.element)
															.attr('imgid');
													$.album.setHash('image_'
															+ imgid);
												},
												afterClose : function() {
													$.album.setHash('');
												},
												afterLoad : function() {
													var getLinks = function(
															img, thumb) {
														var arr = [ {
															name : 'BBCode',
															code : '[url='
																	+ img
																	+ '][img]'
																	+ thumb
																	+ '[/img][/url]'
														} ];
														return arr;
													}
													var img = this.href, thumb = t.thumbClass
															.getThumb(this.element);
													this.linkBox = this.skin
															.find('.image-links');
													for ( var i = 0, l = getLinks(
															img, thumb); i < l.length; i++) {
														var elm = l[i], name = $(
																'<span>').text(
																elm.name), code = $(
																'<input>')
																.attr('type',
																		'text')
																.attr(
																		'value',
																		elm.code)
																.attr(
																		'readonly',
																		1)
																.bind(
																		'click',
																		function() {
																			this
																					.select()
																		}), link = $(
																'<div>')
																.addClass(
																		'image-link')
																.append(name)
																.append(code);
														this.linkBox
																.append(link);
													}
												}
											});
						},
						// ��������������� ������ ����������� ��� ����������
						removeGroup : function() {
							this.t.find('a').removeAttr('rel').unbind('click');
						},
						// Ленивая загрузка изображений
						loadThumbs : function() {
							if (!this.start)
								this.start = true;
							else
								return;
							var thumbs = this.t.find('li:not(:has(img))'), showLine = $(
									window).height()
									+ $(window).scrollTop(), count = 0, t = this;
							for ( var i = 0, c = thumbs.length; i < c; i += this.lazyLoadCount) {
								var top = $(thumbs.get(i)).offset().top;
								if (showLine < top) {
									count = i;
									break;
								}
							}
							if (i != 0 && count == 0)
								count = thumbs.length;
							thumbs.slice(0, count).each(function() {
								t.thumbClass.setImg($(this));
							});
							this.start = false;
						},
						// ��������� ������ �����������
						getGroup : function() {
							return this.t.find('a');
						},
						// ��������� ������ ����������� � ������������ ��������
						getSelected : function() {
							return this.t.find('a[new_status]');
						},
						initDroparea : function() {

						},
						checkHash : function() {
							var hash = window.location.hash.replace('#', '');
							if (hash !== null) {
								hash = hash.split('_');
								if (hash[0] == 'image') {
									var img = this.t.find('a[imgid=' + hash[1]
											+ ']');
									if (img !== null)
										img.click();
								}
							}

						},
						setHash : function(hash) {
							window.location.hash = hash;
						}
					};
					if (!$.album) {
						$.album = new album(this);
						$.album.initGroup();
						$.album.loadThumbs();
						$.album.initDroparea();
						$(document).bind('scroll', function() {
							$.album.loadThumbs();
						});
						$.album.checkHash();
					}
				},
				imagesDropArea : function() {
					var dropbox = $('#dropbox'), inputName = 'input-files', input = $('#'
							+ inputName), template = $('#thumb-template');
					// Установка расположения шаблона для миниатюры
					this.thumbClass.thumbnailsTemplate = $(template);
					// Перенаправление клика на скрытый input
					dropbox.bind('click', function() {
						input.trigger('click');
					});
					var t = this;
					dropbox.filedrop({
						fallback_id : inputName, // Загрузка файлов из input
						paramname : 'image', // Имя поля в $_FILES
						maxfilesize : 1, // в Мб
						queuewait : 1000,
						allowedfiletypes : [ 'image/jpeg' ],
						url : input.attr('destination'),
						// Переименование файла (если в названии будут русские
						// буквы, то загрузка зафейлится)
						rename : function(name) {
							var date = new Date(), newName = date.getFullYear()
									+ date.getMonth() + date.getDate()
									+ date.getTime();
							return name.replace(/(.+?)(\[jpg,jpeg])/, newName
									+ "$2");
						},
						// Вызывается перед загрузкой для каждого файла
						beforeEach : function(file) {
							// Создание и вставка миниатюры
							dropbox.parent().after(t.thumbClass.create(file));
							return true;
						},
						// Обновление процесса загрузки
						progressUpdated : function(i, file, progress) {
							t.thumbClass.progressUpdate($.data(file), progress);
						},
						// Завершение процасса загрузки
						uploadFinished : function(i, file, response) {
							t.thumbClass.progressDone($.data(file), response);
						},
						// Обработка ошибки загрузки, отловленная загрузчиком
						error : function(errCode, file) {
							var data = $.data(file);
							if (!$.isEmptyObject(data))
								t.thumbClass.progressError(data, errCode);
							else
								alert(errCode);
						}
					});
				}
			};
			var initButtons = function() {
				var mc_id = '#module-content', but_cl = '.fb-dialog', gc_id = '#gallery_container';
				// Получение кнопок
				var buttons = $(mc_id + ' ' + but_cl + ' a');
				if (null !== buttons)
					buttons.fancybox({
						type : 'ajax',
						width : 480,
						height : 320,
						autoSize : false
					});
			};
			if (typeof options === 'string' && gallery[options]) {
				initButtons();
				return gallery[options].apply(this, Array.prototype.slice.call(
						arguments, 1));
			}
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