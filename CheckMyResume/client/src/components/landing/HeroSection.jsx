import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Renderer, Camera, Transform, Program, Mesh, Geometry } from 'ogl';
import SpecularButton from '../ui/SpecularButton';
import Galaxy from '../ui/Galaxy';
import GradualBlur from '../ui/GradualBlur';
import { Icon } from '@iconify/react';
import './HeroSection.css';

// ─── Hero video source ────────────────────────────────────────────────────────
// Place your looping video at:  /public/assets/hero-bg.mp4
// The component detects it automatically — if not found, the animated aurora
// gradient serves as the fallback background.
const HERO_VIDEO_SRC = '/assets/hero-bg.mp4';

// Cross-fade timing (milliseconds / seconds)
const CROSSFADE_DURATION_MS  = 700;  // How long the fade transition lasts
const CROSSFADE_TRIGGER_S    = 0.8;  // How many seconds before video end to start the fade

// ─── WebGL Particle shaders ───────────────────────────────────────────────────
const particleVertex = `
  attribute vec3 position;
  attribute vec3 random;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;

  varying vec3 vColor;

  void main() {
    vec3 color1 = vec3(0.78, 0.55, 0.20); // warm gold
    vec3 color2 = vec3(0.68, 0.35, 0.12); // copper
    vec3 color3 = vec3(0.50, 0.30, 0.80); // violet accent
    vec3 base = mix(color1, color2, random.x);
    vColor = mix(base, color3, random.z * 0.4);

    vec3 pos = position;
    pos.y += sin(uTime * 0.18 + random.y * 6.28) * 2.2;
    pos.x += cos(uTime * 0.13 + random.z * 6.28) * 1.8;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = (14.0 * random.x + 5.0) * (30.0 / -mvPosition.z);
    gl_Position  = projectionMatrix * mvPosition;
  }
`;

const particleFragment = `
  precision highp float;
  varying vec3 vColor;

  void main() {
    vec2  cxy = 2.0 * gl_PointCoord - 1.0;
    float r   = dot(cxy, cxy);
    if (r > 1.0) discard;
    float alpha = (1.0 - r) * 0.65;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function HeroSection() {
  const canvasRef   = useRef(null);
  const videoARef   = useRef(null);
  const videoBRef   = useRef(null);
  const videoLayerRef = useRef(null);

  // Tracks which video element is currently the "foreground"
  const activeRef      = useRef('A');
  const crossfadingRef = useRef(false);

  const textRef     = useRef(null);
  const subtitleRef = useRef(null);
  const buttonsRef  = useRef(null);
  const navigate    = useNavigate();

  const [hasVideo, setHasVideo]                 = useState(false);
  const [prefersReducedMotion] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // ── Seamless cross-fade video loop ─────────────────────────────────────────
  useEffect(() => {
    const va = videoARef.current;
    const vb = videoBRef.current;
    if (!va || !vb) return;

    // Easing: ease-in-out quad
    const ease = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    const crossfade = () => {
      if (crossfadingRef.current) return;
      crossfadingRef.current = true;

      const fg = activeRef.current === 'A' ? va : vb;
      const bg = activeRef.current === 'A' ? vb : va;

      // Prime the incoming video
      bg.currentTime = 0;
      bg.play().catch(() => {});

      const startTime = performance.now();

      const tick = (now) => {
        const t = Math.min((now - startTime) / CROSSFADE_DURATION_MS, 1);
        const e = ease(t);
        fg.style.opacity = String(1 - e);
        bg.style.opacity = String(e);

        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          // Swap active
          activeRef.current   = activeRef.current === 'A' ? 'B' : 'A';
          crossfadingRef.current = false;
        }
      };

      requestAnimationFrame(tick);
    };

    // Watch the active video's remaining time
    const checkTime = () => {
      const active = activeRef.current === 'A' ? va : vb;
      if (!active.duration || crossfadingRef.current) return;
      if (active.duration - active.currentTime <= CROSSFADE_TRIGGER_S) {
        crossfade();
      }
    };

    // Mark that a video has successfully loaded
    const onCanPlay = () => {
      setHasVideo(true);
      // Fade the video layer in
      if (videoLayerRef.current) {
        videoLayerRef.current.classList.add('hero__video-layer--ready');
      }
    };

    // Handle 404 / missing file silently — aurora fallback stays
    const onError = () => {
      setHasVideo(false);
    };

    va.addEventListener('timeupdate', checkTime);
    vb.addEventListener('timeupdate', checkTime);
    va.addEventListener('canplay',    onCanPlay, { once: true });
    va.addEventListener('error',      onError,   { once: true });

    return () => {
      va.removeEventListener('timeupdate', checkTime);
      vb.removeEventListener('timeupdate', checkTime);
    };
  }, []);

  // ── GSAP text reveal ───────────────────────────────────────────────────────
  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!textRef.current) return;

    const words = textRef.current.innerText.split(' ');
    textRef.current.innerHTML = '';

    words.forEach((word) => {
      const span = document.createElement('span');
      span.innerText = word + ' ';
      span.className = 'reveal-word';
      textRef.current.appendChild(span);
    });

    const spans = textRef.current.querySelectorAll('.reveal-word');
    gsap.set(spans, { opacity: 0.05, y: 24 });
    gsap.set([subtitleRef.current, buttonsRef.current], { opacity: 0, y: 30 });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to(spans, { opacity: 1, y: 0, duration: 1, stagger: 0.1, delay: 0.3 })
      .to(subtitleRef.current, { opacity: 1, y: 0, duration: 1 },   '-=0.5')
      .to(buttonsRef.current,  { opacity: 1, y: 0, duration: 1 },   '-=0.8');

    return () => tl.kill();
  }, [prefersReducedMotion]);

  // ── WebGL ambient particle field ───────────────────────────────────────────
  useEffect(() => {
    if (prefersReducedMotion || !canvasRef.current) return;

    const renderer = new Renderer({
      canvas:    canvasRef.current,
      alpha:     true,
      antialias: true,
    });
    const gl = renderer.gl;

    const camera = new Camera(gl, { fov: 35 });
    camera.position.set(0, 0, 15);

    const scene = new Transform();

    const particleCount = 120;
    const position = new Float32Array(particleCount * 3);
    const random   = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      position[i * 3 + 0] = (Math.random() - 0.5) * 32;
      position[i * 3 + 1] = (Math.random() - 0.5) * 22;
      position[i * 3 + 2] = (Math.random() - 0.5) * 12;
      random[i * 3 + 0]   = Math.random();
      random[i * 3 + 1]   = Math.random();
      random[i * 3 + 2]   = Math.random();
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: position },
      random:   { size: 3, data: random   },
    });

    const program = new Program(gl, {
      vertex:      particleVertex,
      fragment:    particleFragment,
      transparent: true,
      uniforms:    { uTime: { value: 0 } },
    });

    const particles = new Mesh(gl, { geometry, program, mode: gl.POINTS });
    particles.setParent(scene);

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    };
    window.addEventListener('resize', resize, false);
    resize();

    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth)  * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    let animId;
    const update = (t) => {
      animId = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;
      scene.rotation.y += (mouseX * 0.2 - scene.rotation.y) * 0.05;
      scene.rotation.x += (mouseY * 0.1 - scene.rotation.x) * 0.05;
      renderer.render({ scene, camera });
    };
    animId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize',     resize);
      window.removeEventListener('mousemove',  onMouseMove);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [prefersReducedMotion]);

  return (
    <section className={`hero ${hasVideo ? 'hero--has-video' : ''}`}>

      {/* ── Galaxy Background Effect ── */}
      <div className="hero__galaxy-wrapper" aria-hidden="true">
        <Galaxy
          mouseRepulsion={true}
          mouseInteraction={true}
          density={1.5}
          glowIntensity={0.65}
          saturation={0.9}
          hueShift={50}
          starSpeed={0.4}
          twinkleIntensity={0.5}
          transparent={true}
        />
      </div>

      {/* ── Video layer: two elements for seamless cross-fade looping ── */}
      <div ref={videoLayerRef} className="hero__video-layer" aria-hidden="true">
        <video
          ref={videoARef}
          className="hero__video hero__video--a"
          src={HERO_VIDEO_SRC}
          autoPlay
          muted
          playsInline
          preload="auto"
        />
        <video
          ref={videoBRef}
          className="hero__video hero__video--b"
          src={HERO_VIDEO_SRC}
          muted
          playsInline
          preload="auto"
        />
      </div>

      {/* Dark overlay for text legibility when video is active */}
      <div className="hero__video-overlay" aria-hidden="true" />

      {/* WebGL particle canvas */}
      <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />

      {/* Page content */}
      <div className="container-hero hero__content">
        <h1 ref={textRef} className="hero__title">
          Your Resume. Reimagined by AI.
        </h1>

        <p ref={subtitleRef} className="hero__subtitle">
          Stop getting rejected by ATS algorithms. CheckMyResume analyzes your
          PDF, identifies missing keywords, and generates a perfectly formatted,
          recruiter-ready profile in seconds.
        </p>

        <div ref={buttonsRef} className="hero__actions">
          <SpecularButton
            size="lg"
            onClick={() =>
              document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            Upload Resume
          </SpecularButton>

          <button
            className="hero__secondary-btn"
            onClick={() => navigate('/editor')}
          >
            Build from Scratch
            <Icon icon="ph:arrow-right-bold" width="16" height="16" />
          </button>
        </div>
      </div>

      <div className="hero__scroll-indicator">
        <div className="hero__scroll-mouse">
          <div className="hero__scroll-wheel" />
        </div>
        <span>Scroll to explore</span>
      </div>

      {/* ── Gradual Blur UI Component at Hero section bottom ── */}
      <GradualBlur
        target="parent"
        position="bottom"
        height="8rem"
        strength={2}
        divCount={5}
        curve="bezier"
        exponential={true}
        opacity={1}
      />
    </section>
  );
}
