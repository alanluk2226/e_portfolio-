'use client'
import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { wrapOceanTime } from './oceanMath'

/**
 * Gerstner ocean in WORLD XZ — must stay in sync with oceanMath.ts
 *
 * Side-view blur cause: world-XZ UVs have huge screen derivatives at grazing
 * angles → GPU picks blurry mipmaps → ripple texture vanishes. Fix = no
 * mipmaps + procedural detail that never mipmaps away.
 */
const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uAmp;

varying vec3 vWorldPos;
varying vec3 vNormalW;
varying float vElev;

vec3 gerstner(vec3 p, vec2 dir, float steep, float waveLen, float speed, inout vec3 tangent, inout vec3 binormal) {
  dir = normalize(dir);
  float k = 6.28318530718 / waveLen;
  float c = sqrt(9.8 / k) * speed;
  // Keep phase in a stable range (CPU also wraps uTime)
  float f = k * dot(dir, p.xz) - mod(k * c * uTime, 6.28318530718);
  float a = steep / k * uAmp;

  tangent += vec3(
    -dir.x * dir.x * steep * sin(f),
    dir.x * steep * cos(f),
    -dir.x * dir.y * steep * sin(f)
  );
  binormal += vec3(
    -dir.x * dir.y * steep * sin(f),
    dir.y * steep * cos(f),
    -dir.y * dir.y * steep * sin(f)
  );

  return vec3(dir.x * a * cos(f), a * sin(f), dir.y * a * cos(f));
}

void main() {
  vec3 pos = position;
  vec3 tangent = vec3(1.0, 0.0, 0.0);
  vec3 binormal = vec3(0.0, 0.0, 1.0);
  vec3 displace = vec3(0.0);

  displace += gerstner(pos, vec2(1.0, 0.15), 0.12, 36.0, 0.75, tangent, binormal);
  displace += gerstner(pos, vec2(0.7, 0.7), 0.09, 22.0, 0.9, tangent, binormal);
  displace += gerstner(pos, vec2(-0.4, 0.9), 0.07, 12.0, 1.05, tangent, binormal);
  displace += gerstner(pos, vec2(0.2, -1.0), 0.05, 7.0, 1.2, tangent, binormal);

  float chop = sin(pos.x * 2.4 + uTime * 2.2) * cos(pos.z * 2.1 - uTime * 1.8) * 0.012 * uAmp;
  displace.y += chop;

  pos += displace;
  vElev = displace.y;
  vNormalW = normalize(cross(binormal, tangent));

  vec4 world = modelMatrix * vec4(pos, 1.0);
  vWorldPos = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`

const fragmentShader = /* glsl */ `
uniform vec3 uDeep;
uniform vec3 uMid;
uniform vec3 uShallow;
uniform vec3 uSunDir;
uniform float uTime;
uniform sampler2D uNormals;
uniform float uNormalScale;

varying vec3 vWorldPos;
varying vec3 vNormalW;
varying float vElev;

// Angle-stable procedural ripples (no mipmap death at grazing views)
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * valueNoise(p);
    p = p * 2.05 + 17.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 xz = vWorldPos.xz;
  float dist = length(cameraPosition.xz - xz);
  // Fade micro-detail & sharp specular with distance (kills horizon sparkle)
  float nearDetail = 1.0 - smoothstep(18.0, 55.0, dist);
  float midDetail = 1.0 - smoothstep(35.0, 90.0, dist);

  // --- Normal map WITHOUT relying on auto-mips (texture is LinearFilter) ---
  vec2 uv1 = xz * 0.18 + vec2(uTime * 0.03, uTime * 0.02);
  vec2 uv2 = xz * 0.42 - vec2(uTime * 0.022, -uTime * 0.016);
  vec3 nTex1 = texture2D(uNormals, uv1).xyz * 2.0 - 1.0;
  vec3 nTex2 = texture2D(uNormals, uv2).xyz * 2.0 - 1.0;

  // Procedural micro-ripple — only strong nearby
  float nA = fbm(xz * 1.8 + uTime * 0.35);
  float nB = fbm(xz * 3.6 - uTime * 0.28 + 9.0);
  vec2 procN = vec2(nA - nB, nB - fbm(xz * 2.7 + 3.0)) * 1.4 * nearDetail;

  float texW = 0.55 * midDetail;
  vec3 nDetail = normalize(vec3(
    (nTex1.x + nTex2.x) * texW + procN.x,
    0.0,
    (nTex1.y + nTex2.y) * texW + procN.y
  ));
  nDetail.xz *= uNormalScale * mix(0.35, 1.0, midDetail);

  vec3 N = normalize(vNormalW + vec3(nDetail.x, 0.0, nDetail.z) * 1.25);
  vec3 V = normalize(cameraPosition - vWorldPos);
  vec3 L = normalize(uSunDir);
  vec3 H = normalize(L + V);

  float h = smoothstep(-0.18, 0.22, vElev);
  vec3 waterCol = mix(uDeep, uMid, h);
  waterCol = mix(waterCol, uShallow, smoothstep(0.0, 0.3, vElev) * 0.35);

  float ripple = (nDetail.x * 0.5 + nDetail.z * 0.5 + (nA - 0.5) * 0.8) * nearDetail;
  waterCol *= 1.0 + ripple * 0.28;
  float ndl = max(dot(N, L), 0.0);
  waterCol += vec3(0.02, 0.07, 0.08) * ndl;

  // Soften & dim specular with distance to avoid aliasing sparkles
  float specPow = mix(24.0, 64.0, nearDetail);
  float spec = pow(max(dot(N, H), 0.0), specPow) * 0.55 * midDetail;
  float sparkle = pow(max(dot(N, H), 0.0), 18.0) * 0.14 * nearDetail * (0.5 + nA);

  float fresnel = pow(1.0 - max(dot(N, V), 0.0), 6.0) * 0.06;
  vec3 col = waterCol + vec3(0.04, 0.08, 0.09) * fresnel;
  col += vec3(0.75, 0.92, 0.98) * (spec + sparkle);

  gl_FragColor = vec4(col, 1.0);
}
`

interface WaterProps {
  size?: number
  segments?: number
  amp?: number
}

export default function Water({ size = 280, segments = 192, amp = 0.4 }: WaterProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const normals = useLoader(THREE.TextureLoader, '/textures/waternormals.jpg')
  const gl = useThree(s => s.gl)

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(size, size, segments, segments)
    geo.rotateX(-Math.PI / 2)
    return geo
  }, [size, segments])

  useEffect(() => {
    // Critical: disable mipmaps — grazing views were sampling blurry levels
    normals.generateMipmaps = false
    normals.minFilter = THREE.LinearFilter
    normals.magFilter = THREE.LinearFilter
    normals.wrapS = normals.wrapT = THREE.RepeatWrapping
    normals.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy())
    normals.needsUpdate = true
  }, [normals, gl])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: amp },
      uDeep: { value: new THREE.Color('#033041') },
      uMid: { value: new THREE.Color('#0a6a78') },
      uShallow: { value: new THREE.Color('#1a9aaa') },
      uSunDir: { value: new THREE.Vector3(0.55, 0.75, 0.25).normalize() },
      uNormals: { value: normals },
      uNormalScale: { value: 1.35 },
    }),
    // amp updated via effect — keep uTime binding stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [normals]
  )

  useEffect(() => {
    if (matRef.current) matRef.current.uniforms.uAmp.value = amp
  }, [amp])

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = wrapOceanTime(clock.elapsedTime)
    }
  })

  return (
    <mesh geometry={geometry} receiveShadow>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}
