// Geometry helpers shared by the phone and the laptop.
import * as THREE from 'three';

export function roundedRect(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r);
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h);
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r);
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}

// A slab with rounded corners and a chamfered rim, centred on the origin, facing +z.
// The bevel grows the outline, so the shape is drawn inset by its size to keep w and h exact.
export function slab(w, h, depth, radius, bevel) {
  const shape = roundedRect(w - 2 * bevel, h - 2 * bevel, Math.max(radius - bevel, 0.001));
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: depth - 2 * bevel,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 4,
    curveSegments: 20,
  });
  geo.translate(0, 0, -(depth - 2 * bevel) / 2);
  return geo;
}

// A flat rounded panel whose UVs span the whole panel, so a texture maps onto it edge to edge.
export function panel(w, h, radius) {
  const geo = new THREE.ShapeGeometry(roundedRect(w, h, radius), 16);
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i += 1) {
    uv.setXY(i, pos.getX(i) / w + 0.5, pos.getY(i) / h + 0.5);
  }
  uv.needsUpdate = true;
  return geo;
}

// Only the mirror-like reflections of a sheet of glass, added over whatever sits behind it.
export function glassMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: 0x000000,
    roughness: 0.06,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    // Enough of the room to read as glass, never so much that it hides what the screen shows.
    envMapIntensity: 0.22,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}

export function loadTexture(url, onReady) {
  const tex = new THREE.TextureLoader().load(url, onReady);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

// Distance to the edge of a rounded rectangle given by its half size, negative inside.
const ROUNDED = /* glsl */ `
  float rounded(vec2 p, vec2 half_size, float radius) {
    vec2 q = abs(p) - (half_size - radius);
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
  }`;

// A lit screen: its picture, unlit, with the window shown, the saturation and the brightness
// under control. window: [scaleX, scaleY, offsetX, offsetY] in texture coordinates.
// Up to two pieces of the screen can be singled out (spotA, spotB: centre and half size on the
// panel, in scene units; onA, onB: how much): the rest of the screen then goes out of focus and
// a little darker, as the lens of the cover does with the name. `soft` is the same picture,
// blurred (tools/screens.py and the lab of 14/11: light, relief and a drawn frame were tried).
export function screenMaterial(texture, soft = texture) {
  return new THREE.ShaderMaterial({
    uniforms: {
      map: { value: texture },
      soft: { value: soft },
      view: { value: new THREE.Vector4(1, 1, 0, 0) },
      saturation: { value: 1 },
      gain: { value: 1 },
      size: { value: new THREE.Vector2(1, 1) },
      corner: { value: 0.02 },
      spotA: { value: new THREE.Vector4(0, 0, 0.1, 0.1) },
      spotB: { value: new THREE.Vector4(0, 0, 0.1, 0.1) },
      onA: { value: 0 },
      onB: { value: 0 },
      // How dark and how blurred the rest of the screen gets, 0 to 1.
      dim: { value: 0.3 },
      blur: { value: 1 },
      feather: { value: 0.016 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D map;
      uniform sampler2D soft;
      uniform vec4 view;
      uniform float saturation;
      uniform float gain;
      uniform vec2 size;
      uniform float corner;
      uniform vec4 spotA;
      uniform vec4 spotB;
      uniform float onA;
      uniform float onB;
      uniform float dim;
      uniform float blur;
      uniform float feather;
      varying vec2 vUv;
      ${ROUNDED}
      void main() {
        vec2 uv = vUv * view.xy + view.zw;
        vec3 colour = texture2D(map, uv).rgb;
        float held = max(onA, onB);
        if (held > 0.001) {
          vec2 p = (vUv - 0.5) * size;
          float inA = 1.0 - smoothstep(0.0, feather, rounded(p - spotA.xy, spotA.zw, corner));
          float inB = 1.0 - smoothstep(0.0, feather, rounded(p - spotB.xy, spotB.zw, corner));
          // How much this point belongs to the rest of the screen, not to a piece being shown.
          float rest = held * (1.0 - inA * onA / held) * (1.0 - inB * onB / held);
          colour = mix(colour, texture2D(soft, uv).rgb, blur * rest) * (1.0 - dim * rest);
        }
        float grey = dot(colour, vec3(0.2126, 0.7152, 0.0722));
        gl_FragColor = vec4(mix(vec3(grey), colour, saturation) * gain, 1.0);
        #include <colorspace_fragment>
      }`,
    toneMapped: false,
  });
}

// A soft round pool of light, for a floor that only shows where light falls on it.
export function poolTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const c = canvas.getContext('2d');
  const fade = c.createRadialGradient(128, 128, 0, 128, 128, 128);
  fade.addColorStop(0, 'rgba(255, 255, 255, 1)');
  fade.addColorStop(0.45, 'rgba(255, 255, 255, 0.34)');
  fade.addColorStop(1, 'rgba(255, 255, 255, 0)');
  c.fillStyle = fade;
  c.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
