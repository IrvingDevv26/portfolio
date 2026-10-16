/* ¿El navegador tiene WebGL acelerado por hardware?
   Con renderizado por software (SwiftShader, llvmpipe: GPU bloqueada, máquinas
   virtuales, navegadores headless) la escena 3D bloquearía el hilo principal
   varios segundos, así que conviene mostrar una versión ligera. */
export function hasHardwareWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) return false;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = String(
      info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER),
    );
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
  } catch {
    return false;
  }
}
