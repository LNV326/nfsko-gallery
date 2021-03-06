/*
 * <li class='gallery_thumb small' id='thumb-template'> <!-- ID ���� ���� � ��������� -->
 * 	<a href='...' status="show" imgid="...">
 * 		<img/> <!-- ����������� � �������� ����, ������������� ��� ��������� � JS -->
 * 	</a>
 *	<div class="ui-progressbar"></div> <!-- ������������ ������ � ��������� -->
 * </li>
 */
$(function() {	
    $.widget( "nfsko.thumbnail", {
    	options : {
    		thumbnailsPath : 'thumbs/'
    	},
		imageDOM : null,
		thumbDOM : null,
		progressDOM : null,
    	// �����������
    	_create : function() {
			if ( !this.element.is('li.gallery_thumb.small') )
				throw new Error("Error in nfsko.thumb: ������� ������ �� ������������� �������");
			this.element.addClass('ui-thumb');
			this.imageDOM = this.element.children('a');
			/*this.thumbDOM = $('<img>').appendTo( this.imageDOM );
			// ��������� ���������
			this.thumb( this._getThumbSrc() );*/
			this.thumbDOM = this.imageDOM.children('img');
			this.thumb( this.thumbDOM.attr('lazysrc') );
			
//			var t = this;
//			this.element.find('div.buttons div').each(function(){
//				$(this).bind('click', function() {
//					t._toggleVisibility(this);
//				});
//			});
    	},
    	// �����������
    	_destroy : function() {
    		this.element.removeClass('ui-thumb');
    	},
    	// ����������/������������� ������ �� �����������
    	image : function( newImage ) {
    		if (undefined === newImage)
    			return this.imageDOM.attr('href');
    		this.imageDOM.attr('href', newImage);
    		return newImage;
    	},
    	// ����������/������������� ���������
    	thumb : function( newThumb ) {
    		if (undefined === newThumb)
    			return this.thumbDOM.attr('src');
    		var t = this;
    		this.thumbDOM.bind('load', function() {
    			t.imageDOM.removeClass('ui-loading');
    			t._format();
    		});
    		t.imageDOM.addClass('ui-loading');
    		this.thumbDOM.attr('src', newThumb);    		
    		return newThumb;
    	},
    	// ����������/������������� ������ (���������) �����������
    	status : function( newStatus ) {
    		if (undefined === newStatus)
    			return this.imageDOM.attr('status');
    		this.imageDOM.attr('status', newStatus);
    	},
		// ������������� ������ ��������� (�������/���������)
		_format : function() {
			if (this.thumbDOM.width() / this.thumbDOM.height() < 1)
				this.element.addClass('book');
			else
				this.element.addClass('album');
		},
		// ���������� URL ���������, �� ������ URL ����������� 
		/*_getThumbSrc : function() {
			return this.image().replace(
					/(.+?)([^\/]+?\.[jpg,jpeg])/,
					"$1" + this.options.thumbnailsPath + "$2");
		},*/
		// �������� ������ ��������
		createProgressBar : function() {
			var t = this;
			this.progressDOM = $('<div>').appendTo( this.element );
			this.progressDOM.progressbar({
				max : 101, // � ���������
				value : 0,
				complete : function( event, ui ) {
					setTimeout(function() {
						t.progressDOM.progressbar("destroy");
						// ����������� ���������
						//$.album.album( 'addThumb', t.element.remove() ); // TODO 
						//$.album.album( 'initGroup' ); 
					}, 1000);
				}
			});
		},
		// ���������� ��������� ��������
		updateProgressBar : function( percent ) {						
			this.progressDOM.progressbar("option", "value", percent);
		},
		// �������� �� �����
		createFromFile : function( file ) {
			var reader = new FileReader(),
				t = this;
			reader.onload = function(e) {
				// e.target.result �������� ���� � �����������
				t.thumb( e.target.result );	
			};
			reader.readAsDataURL( file );
			// ������ ������ ��������
			this.createProgressBar();				
		},
		// ���������� �������� ��������
		uploadDone : function( isError, error ) {
			if ( false == isError ) {
				this.element.addClass('new');
				this.updateProgressBar(101);
			} else {
				this.element.addClass('error');
				this.uploadError( error[0] );
			}
		},
		// ������ �������� �����������
		uploadError : function( errCode ) {	
			this.progressDOM.progressbar("option", "value", 'auto').text(errCode);
		},
//		// ������������ ��������� �����������
//		_toggleVisibility : function( button ) {
//			var element = this;
//			$.ajax({
//				url: $(button).attr('href'),
//				type: "POST",
//				dataType: "json",
//				context: element,
//				beforeSend : function( jqXHR, textStatus ) {
//					this.status('changing');
//				}
//			}).done(function( response ) {
//				// ���������� ������ �� �������
//				var rh = new ResponseHandler({
//					responseType: 'ajax',
//					onSuccess : function( body ) {
//						this.status( body.image_visibility );											
//					},
//					onFailure : function( error ) {
//						alert( "DestinationInnerFail: ���-�� �� ��� ��� ��������� ��������� �����������" );
//					}
//				});
//				rh.handler( response );
//			}).fail(function( jqXHR, textStatus ) {
//				// ��������� ������ ��� ������ �������
//				alert( "RequestNotValidFail: " + textStatus );
//			});
//			return false;
//		}	
    });
});