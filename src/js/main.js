$(document)
	.ready(
		function()
		{
			var fs = require("fs");						//	Libreria FileSystem
			var buf;									//	Buffer par la imagen a guardar
			var	$snapshot = $('#my_result img')			//	SnapShot de la camara

			Webcam.attach('#my_camera');	//	Visualizo la camara

			$snapshot
				.cropper(
					{
						aspectRatio:		1			//	Imagen Cuadrada
					,	autoCropArea:		0.1			//	Fuerzo el minimo del area del cropper
					,	strict:				true		//	Fuerzo que no pueda moverme fuera de la imagen
					,	cropBoxResizable:	false		//	Evito que el cropper cambie de tamaño
					,	guides:				false		//	Oculto las guias del cropper
					,	minCropBoxWidth:	150			//	Fuerzo el minimo del ancho a 150px
					,	minCropBoxHeight:	150			//	Fuerzo el minimo del alto a 150px
					,	zoomable:			false		//	Fuerzo que no se pueda hacer zoom sobre la imagen
					}
				);


			var app = {
				takeSnapshot: function()		//	Tomo la foto e instancio el cropper
				{
					Webcam
						.snap(
							function(data_uri)
							{
								$snapshot
									.cropper('replace',data_uri);
							}
						);
				}

			,	takeCrop:	function ()			//	Tomo la imagen croppeada y creo un buffer que me servira para crear el archivo
				{
					var result = $snapshot.cropper('getCroppedCanvas', {}, {});		//	Obtengo el canvas
					var jpeg = result.toDataURL('image/jpeg');;						//	Obtengo la imagen en Base64
					var $cropped = $('<img>').attr('src',jpeg).css('width',240);	//	Creo la imagen en funcion de lo cropeado
					$('#my_crop').html($cropped);									//	Inserto la imagen
					var img = jpeg + "";											//	Creo una copia en Base64 de la imagen
					var data = img.replace(/^data:image\/\w+;base64,/, "");			//	Configuro el texto en Base64
					buf = new Buffer(data, 'base64');								//	Creo un buffer de la imagen
				}

			,	saveCrop:	function ()			//	Guardo la imagen croppeada
				{
					$('input.toDownload').click()	//	LLamo a la descarga de la imagen
				}
			}

			$('.wizard-next')
				.click(
					function()
					{
						$('.wizard-back').attr('disabled',false)

						app[$('.wizard-card-container .active').attr('action-name')]();

						if	($('.wizard-card-container .active').attr('action-name') != 'saveCrop') {
							
							$('.wizard-nav-list .active')
								.removeClass('active')
								.addClass('success')
								.next()
								.addClass('active');

							$('.wizard-card-container .active')
								.removeClass('active')
								.next()
								.addClass('active');

							$('.wizard-next')
								.attr('action-to-do',$('.wizard-card-container .active').attr('action-name'))
								.html($('.wizard-card-container .active').attr('action-title'));

						}


					}
				)

			$('.wizard-back')
				.click(
					function()
					{
						$('.wizard-nav-list .active')
							.removeClass('active')
							.prev()
							.removeClass('success')
							.addClass('active');

						$('.wizard-card-container .active')
							.removeClass('active')
							.prev()
							.addClass('active');

						$('.wizard-next')
							.attr('action-to-do',$('.wizard-card-container .active').attr('action-name'))
							.html($('.wizard-card-container .active').attr('action-title'));
						
						if	($('.wizard-card-container .active').attr('action-name') == 'takeSnapshot')
							$('.wizard-back').attr('disabled',true);
						else
							$('.wizard-back').attr('disabled',false);
					}
				)

			$('.wizard-reset')
				.click(
					function()
					{
						$('.wizard-nav-item').removeClass('success')
						$('.wizard-nav-item').removeClass('active')
						$('.wizard-nav-item[data-cardname="webcam"]').addClass('active')

						$('.wizard-card.active').removeClass('active')
						$('.wizard-card[data-cardname="webcam"]').addClass('active')
					}
				)

			$("input.toDownload")			//	Guardo la imagen
				.change(
					function()
					{
						var filePath = $(this).val();						//	Obtengo el directorio donde guardara la imagen
						$('input[name="dni"]').val(filePath.split('/').pop().split('.').shift());
						if (filePath !== "") {								//	Verifico que no este vacio
							fs
								.writeFile(									//	Escribo el archivo
									filePath
								,	buf
								,	function callback(err)					//	Si ocurrio un error
									{
										if (err) {
											alert("No se pudo guardar el archivo.");
										}
										else {
											var	notification
											=	new Notification(
													"Aviso"
												,	{
														body: "Imagen guardada satisfactoriamente"
													}
												)
											notification
												.onshow = function () {
													setTimeout(
														function()
														{
															notification.close();
														}
													,	5000
													);
												}
										}
									}
								);
						}
					}
				);

			$('input[name="dni"]')			//	Obtengo el nombre de la imagen a guardar
				.keyup(
					function(ev)
					{
						if	(ev.keyCode == 13)
							$('input.toDownload').click()									//	LLamo a la descarga de la imagen
						else
							$('input.toDownload').attr('nwsaveas',$(this).val()+'.jpg');	//	Cambio el nombre de la imagen
					}
				);
		}
	);