() => {
	
	// loading the shaders for button textures

	$FS_PLUS = new rjs.Shader("FRAGMENT", "Sources/glsl/fragment-plus.glsl", "PLUS");
	$FS_SOUND = new rjs.Shader("FRAGMENT", "Sources/glsl/fragment-sound.glsl", "SOUND");
	$FS_X = new rjs.Shader("FRAGMENT", "Sources/glsl/fragment-x.glsl", "X");
	$FS_DOTS = new rjs.Shader("FRAGMENT", "Sources/glsl/fragment-dots.glsl", "DOTS");
	$VS_PLUS = new rjs.Shader("VERTEX", "Sources/glsl/vertex-plus.glsl", "PLUS2");

	$H_PLUS = new rjs.Program({
		fragment: FS_PLUS,
		vertex: "DEFAULT",
		id: "PLUS"
	});

	$H_PLUS2 = new rjs.Program({
		fragment: FS_PLUS,
		vertex: VS_PLUS,
		id: "PLUS2"
	});

	$H_SOUND = new rjs.Program({
		fragment: FS_SOUND,
		vertex: "DEFAULT",
		id: "SOUND"
	});

	$H_X = new rjs.Program({
		fragment: FS_X,
		vertex: "DEFAULT",
		id: "X"
	});

	$H_DOTS = new rjs.Program({
		fragment: FS_DOTS,
		vertex: "DEFAULT",
		id: "DOTS"
	});

	

}