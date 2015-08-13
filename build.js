var	NwBuilder
=	require('nw-builder')
,	nw
=	new NwBuilder(
		{
			files:		'./src/**'
		,	winIco:		'./icons/webcam.ico'
		,	platforms:
			[
				'win32'
			,	'linux32'
			]
		}
	);

nw
	.on(
		'log'
	,	function (msg)
		{
			console.log('nw-builder:', msg);
		}
	);

nw
	.build()
		.then(
			function()
			{
				console.log('nw-builder: all done!');
			}
		).catch(
			function(error)
			{
    			console.error(error);
			}
		);