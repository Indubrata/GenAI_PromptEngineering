**Role & Project Overview**  
You are an elite full-stack React developer and UI/UX expert. Your task is to build a fully functional, highly secure, and deployable web application named **CheckMyResume**. This is a premium, AI-powered resume analyzer and builder that evaluates resumes against current industry standards and specific job descriptions (JD).

**Folder Structure & Output**  
Because this project utilizes advanced React components, initialize a React environment (e.g., Vite or Next.js) with a strict, clean structure:

* Components in /src/components.  
* Styles in /src/css.  
* Assets and motion videos in /src/assets or /public.  
* Maintain production-ready, highly modular code.  
* Website startup file in the root directory


## **Tech Stack & Architecture**

| Layer | Requirements |
| :---- | :---- |
| **Frontend** | React (Vite/Next.js), CSS/GSAP (for scroll animations), responsive design (mobile/laptop). **Dependency:** npm i ogl for WebGL button effects. |
| **Backend & Data** | Node.js/Python backend. **Crucial:** Integrate the **Bright Data API** for live LinkedIn scraping to fetch real-time job openings and recruiter profiles. |
| **AI Integration** | Implement a dual-API failover system. Primary: **Groq API** (running llama-3.3-70b-versatile). Fallback: **Groq API** (running openai/gpt-oss-120b) (for GPT-based models). Build automatic token/error handling. |
| **PDF Handling** | Use established libraries (e.g., react-pdf or pdf.js for reading, and html2pdf.js or Puppeteer for the final export) to ensure layout fidelity. |
| **Error Handling** | No raw code errors displayed; use minimalist, plain-English red boxes. |

## 

## **Custom UI Components (React Bits Integration)**

You must implement two specific custom components for the UI. Ensure they adapt to both Light and Dark modes.  
**1\.** \<SpecularButton/\>

* **Usage:** Use this for ALL primary actions and CTAs across the app (e.g., "Upload Resume", "Build from Scratch", "Apply Now", "Finalize").  
* **Implementation:** Requires ogl. A WebGL powered button with a moving specular highlight that follows the mouse. Use the standard React Bits implementation. Adjust tint, textColor, and baseColor props dynamically based on the active Light/Dark theme to maintain the premium, moody aesthetic.

**2\.** \<LineSidebar/\>

* **Usage:** Use this exclusively as the Left Sidebar in the **Digital Resume Editor**.  
* **Implementation:** The items prop must dynamically map to the available resume sections (e.g., \['Summary', 'Experience', 'Education', 'Skills'\]). Allow drag-and-drop reordering to update this list. Map the onItemClick prop to scroll or focus the user on that specific section in the main editor canvas.


## **UI/UX & Design Language**

* **Aesthetic & Vibe:** Premium, luxury, "Apple-level clean" mixed with an apothecary-premium moody feel. Use rich textures, soft lighting, copper accents, soft gold glow accents, scroll reveal animations, smooth hover effects, slight glassmorphism and smooth gradients.  
* **Theme Toggle:** Seamless light and dark modes. The UI, \<SpecularButton\>, \<LineSidebar\>, and animations must dynamically adapt to both modes.  
* **Animations:** Scroll-driven GSAP/CSS animations. The experience must feel liquid and expensive. Utilize parallax, scroll-reveals, and hover states. Lazy-load images and use muted autoplay for ambient videos.  
* **Accessibility:** Respect prefers-reduced-motion with graceful fallbacks. Maintain high-contrast readability, luxury spacing.  
* **Icons & Assets:** Use ONLY FontAwesome or Iconify. No emojis. Integrate provided assets and motion videos flawlessly.  
* **Launch story:** Told scroll-step by scroll-step with rich imagery. Quotable, 80-120 words total.  
* **Reviews:** Invented text reviews with plausible names on a premium social wall (tasteful, not a TikTok grid), lazy-loaded.  
* **Final Judgement:** Wow in the first 3 seconds, how naturally the video fuses with the scroll, harmony with the photography, copy quality and voice, the reviews section, mobile and laptop feel, overall taste. Optimize for these.  
* The code must harmonize with the assets, never fight them. Immersive and scroll-tagged: the experience is driven by scrolling, not clicking. Weave the hero video into the scroll (scrub it to scroll position or pin it while copy reveals over it; pick whichever feels smoothest). The visitor should feel they are moving through the launch, not reading a brochure. Interactive wherever it counts: parallax, hover states, elements that respond. Motion liquid and expensive, never busy. Be genuinely creative: include at least one moment I did not ask for.  
* Use rich textures, soft lighting, glossy highlights  
* Premium \+ playful  
* Smooth transition (0.3s)  
* Responsive design  
* Hover animations


## **Copywriting Guidelines**

* **Voice:** Confident, dry wit, slightly contrarian. Never cutesy. **Strict rule:** Do NOT use em-dashes anywhere.  
* **Style:** Short, punchy, conversion-focused. Focus on benefits (personalized, crafted, unmatched accuracy).  
* **Elements:** Create emotional headlines, trust-building claims, and strong, action-driven CTAs wrapped in \<SpecularButton\>.  
* **Emotional headlines:** Technical details, trendy and catchy words, luxury  
* **Power words:** “personalized”, “crafted”, “premium”, “accurate”, “curated”, “unmatched”  
* **Features / Craftsmanship:** 3–4 points (LLMs used, RAG agent used)  
* **About / Story:** Emotional storytelling (scoring, passion)  
* **Product Showcase:** Various feature cards with descriptions  
* **Why Choose Us:** Trust \+ differentiation  
* **Social Proof / Stats:** Customers, ratings, experience  
* **Testimonials:** Real-feel reviews  
* **FAQ:** Accordion with smooth animation  
* **CTA Banner (VERY IMPORTANT):** Passion \+ emotional trigger \+ accuracy  
* **Strong CTA button**  
* **Footer:** Minimal, elegant

## **Core User Flows**

**1\. The Landing & Welcome Page**

* **Hero Section:** High-impact, scroll-tagged cinematic visual/video.  
* **Inputs:** Upload area (PDF, DOCX, TXT) \+ Job Role \+ JD input fields. Include an alternative "Build from Scratch" option.  
* **Story & Features:** Scroll-step launch story, feature explorer (2 lines per feature), lazy-loaded premium review wall, and a CTA discovery box.  
* **Global Elements:** Sticky minimal navbar, responsive footer, FAQ accordion.

**2\. The Analysis & Scoring Page**

* **Visual Score:** Display an AI-generated score (out of 10\) on a trendy, animated visual meter alongside textual feedback.  
* **Recommendations:** Suggest real courses/certificates (with links) to boost the score.  
* **Routing:** Ask the user if they want to proceed to the digital editor.

**3\. The Digital Resume Editor**

* **Layout:**  
  * *Left Sidebar:* Implement \<LineSidebar/\> here representing the resume sections. Support drag-and-drop reordering.  
  * *Main Canvas:* The editable resume. Pre-fill data extracted from the upload. Use placeholders only for missing, vital information.  
  * *Right Sidebar:* 1-click addable skill suggestions tailored to the JD.  
* **Real-time AI:** Score meter updates dynamically as edits are made. Built-in grammar checking and ATS keyword optimization.  
* **Templates:** Allow seamless switching between a sample template and the user's draft without losing progress.  
* **AI Chat:** A globally available, collapsible sidebar for real-time AI assistance.

**4\. The Final Export & Job Matching Page**

* **Export:** Download final resume in PDF or DOCX format.  
* **Live Job Matches:** Use the **Bright Data API** to query and display actual, real-time job openings and active recruiters on LinkedIn matching the user's JD and generated profile.  
* **Actionable Tools:**  
  * 1-click apply links to the specific job postings (using \<SpecularButton\>).  
  * AI-generated 5-10 line custom summaries tailored for application forms.  
  * AI-generated custom outreach messages for connecting with the fetched LinkedIn recruiters.

**Prompt for Specular Button :**  
\#\# Integrate the \<SpecularButton /\> component from React Bits

You are helping integrate an open-source React component into an existing application.

\#\#\# Component: SpecularButton  
\#\#\# Variant: JavaScript \+ CSS  
\#\#\# Dependencies: npm i ogl

\---

\#\#\# Usage Example  
\`\`\`jsx  
import SpecularButton from './SpecularButton';

\<SpecularButton  
  size="lg"  
  radius={18}  
  tint="\#ffffff"  
  tintOpacity={0}  
  blur={0}  
  textColor="\#f5f5f5"  
  lineColor="\#ffffff"  
  baseColor="\#525252"  
  intensity={1}  
  shineSize={10}  
  shineFade={40}  
  thickness={1}  
  speed={0.35}  
  followMouse  
  proximity={250}  
  autoAnimate={false}  
  onClick={() \=\> console.log('clicked')}  
\>  
  Get Started  
\</SpecularButton\>  
\`\`\`

\#\#\# Props  
| Prop | Type | Default | Description |  
|------|------|---------|-------------|  
| children | ReactNode | "Get Started" | Button label or any custom content. |  
| size | "sm" | "md" | "lg" | "lg" | Preset padding and font size of the button. |  
| radius | number | 18 | Corner radius in pixels; clamps to a pill automatically. |  
| tint | string | "\#ffffff" | Color of the glass background tint. |  
| tintOpacity | number | 0 | Strength of the glass tint. |  
| blur | number | 0 | Backdrop blur in pixels behind the button. |  
| textColor | string | "\#f5f5f5" | Color of the button label. |  
| lineColor | string | "\#ffffff" | Color of the moving specular highlight. |  
| baseColor | string | "\#525252" | Color of the static edge stroke under the highlight. |  
| intensity | number | 1 | Brightness of the specular highlight. |  
| shineSize | number | 10 | Angular size in degrees of each shine streak along the edge. |  
| shineFade | number | 40 | How gradually each streak fades out at its ends, in degrees. |  
| thickness | number | 1 | Width of the highlight line in pixels. |  
| speed | number | 0.35 | Rotation speed of the sweep when autoAnimate is on. |  
| followMouse | boolean | true | Point the light toward the cursor. |  
| proximity | number | 250 | Distance in pixels within which the shine fades in as the cursor approaches. |  
| autoAnimate | boolean | false | Keep the shine always on with a rotating sweep, regardless of cursor distance. |  
| disabled | boolean | false | Disable the button. |  
| onClick | MouseEventHandler | \- | Standard button click handler. |  
| type | "button" | "submit" | "reset" | "button" | Native button type. |  
| className | string | "" | Additional CSS classes for the button. |

\#\#\# Full Component Source  
\`\`\`jsx  
import { useRef, useEffect } from 'react';  
import { Renderer, Program, Mesh, Triangle, Color } from 'ogl';  
import './SpecularButton.css';

const PAD \= 20;

const VERT \= \`\#version 300 es  
in vec2 position;  
void main() {  
  gl\_Position \= vec4(position, 0.0, 1.0);  
}  
\`;

const FRAG \= \`\#version 300 es  
precision highp float;

uniform vec2 uCenter;  
uniform vec2 uHalfSize;  
uniform float uRadius;  
uniform float uAngle;  
uniform float uPx;  
uniform vec3 uLineColor;  
uniform vec3 uBaseColor;  
uniform float uIntensity;  
uniform float uShineSize;  
uniform float uShineFade;  
uniform float uThickness;  
uniform float uBaseWidth;

out vec4 fragColor;

float sdRoundedRect(vec2 p, vec2 b, float r) {  
  vec2 q \= abs(p) \- b \+ r;  
  return length(max(q, 0.0)) \+ min(max(q.x, q.y), 0.0) \- r;  
}

float shapeSDF(vec2 p) { return sdRoundedRect(p, uHalfSize, uRadius); }

float gaussianLine(float d, float sigma) {  
  float x \= d / (sigma \+ 1e-6);  
  float k \= mix(1.0, 1.6, smoothstep(0.0, 1.5, x));  
  return exp(-k \* x \* x);  
}

void main() {  
  vec2 p \= gl\_FragCoord.xy \- uCenter;  
  float d \= shapeSDF(p);  
  vec2 L \= vec2(cos(uAngle), sin(uAngle));

  // Dark base stroke hugging the edge for a sense of thickness  
  float base \= (1.0 \- smoothstep(0.0, uBaseWidth, abs(d))) \* 0.45;

  // Symmetric specular: the edges facing toward/away from the light both  
  // catch a streak. The angular window (size \+ fade) is measured with an  
  // elliptical normal so it varies continuously along straight edges.  
  vec2 nEll \= normalize(p / (uHalfSize \* uHalfSize) \+ 1e-6);  
  float phi \= acos(clamp(abs(dot(nEll, L)), 0.0, 1.0));  
  float rim \= 1.0 \- smoothstep(uShineSize \- uShineFade, uShineSize \+ uShineFade \+ 1e-4, phi);  
  float line \= gaussianLine(d, uThickness);  
  float edgeClamp \= 1.0 \- smoothstep(0.5 \* uPx, 3.0 \* uPx, abs(d));  
  float hi \= line \* rim \* edgeClamp \* uIntensity;

  vec3 col \= uBaseColor \* base \+ uLineColor \* hi;  
  float a \= clamp(base \+ hi, 0.0, 1.0);  
  fragColor \= vec4(col, a);  
}  
\`;

const SpecularButton \= ({  
  children \= 'Get Started',  
  size \= 'lg',  
  radius \= 18,  
  tint \= '\#ffffff',  
  tintOpacity \= 0,  
  blur \= 0,  
  textColor \= '\#f5f5f5',  
  lineColor \= '\#ffffff',  
  baseColor \= '\#525252',  
  intensity \= 1,  
  shineSize \= 10,  
  shineFade \= 40,  
  thickness \= 1,  
  speed \= 0.35,  
  followMouse \= true,  
  proximity \= 250,  
  autoAnimate \= false,  
  disabled \= false,  
  onClick,  
  className \= '',  
  type \= 'button'  
}) \=\> {  
  const btnRef \= useRef(null);  
  const fxRef \= useRef(null);  
  const propsRef \= useRef({});

  propsRef.current \= { radius, lineColor, baseColor, intensity, shineSize, shineFade, thickness, speed, followMouse, proximity, autoAnimate };

  useEffect(() \=\> {  
    const btn \= btnRef.current;  
    const fx \= fxRef.current;  
    if (\!btn || \!fx) return;

    const dpr \= window.devicePixelRatio || 1;  
    const renderer \= new Renderer({ alpha: true, premultipliedAlpha: true, antialias: true, dpr });  
    const gl \= renderer.gl;  
    gl.clearColor(0, 0, 0, 0);  
    gl.enable(gl.BLEND);  
    gl.blendFunc(gl.ONE, gl.ONE\_MINUS\_SRC\_ALPHA);

    const geometry \= new Triangle(gl);  
    if (geometry.attributes.uv) delete geometry.attributes.uv;

    const program \= new Program(gl, {  
      vertex: VERT,  
      fragment: FRAG,  
      uniforms: {  
        uCenter: { value: \[0, 0\] },  
        uHalfSize: { value: \[1, 1\] },  
        uRadius: { value: 0 },  
        uAngle: { value: 2.4 },  
        uPx: { value: dpr },  
        uLineColor: { value: \[1, 1, 1\] },  
        uBaseColor: { value: \[0.32, 0.32, 0.32\] },  
        uIntensity: { value: 1 },  
        uShineSize: { value: 0.17 },  
        uShineFade: { value: 0.7 },  
        uThickness: { value: 1 },

        uBaseWidth: { value: dpr }  
      }  
    });

    const mesh \= new Mesh(gl, { geometry, program });  
    fx.appendChild(gl.canvas);

    const sizeRef \= { w: 1, h: 1 };  
    const resize \= () \=\> {  
      // Fractional size \+ explicit center keep the SDF pinned to the exact  
      // CSS border, instead of drifting up to a pixel from offsetWidth rounding.  
      const rect \= btn.getBoundingClientRect();  
      const w \= rect.width;  
      const h \= rect.height;  
      sizeRef.w \= w;  
      sizeRef.h \= h;  
      renderer.setSize(w \+ PAD \* 2, h \+ PAD \* 2);  
      program.uniforms.uCenter.value \= \[(PAD \+ w / 2\) \* dpr, (PAD \+ h / 2\) \* dpr\];  
      program.uniforms.uHalfSize.value \= \[(w / 2\) \* dpr, (h / 2\) \* dpr\];  
    };  
    const ro \= new ResizeObserver(resize);  
    ro.observe(btn);  
    resize();

    // Light angle steers toward the pointer (anywhere on the page) and falls  
    // back to a slow sweep when the pointer hasn't moved yet.  
    let pointerAngle \= null;  
    let proximityT \= 0;  
    const onPointerMove \= e \=\> {  
      const rect \= btn.getBoundingClientRect();  
      const cx \= rect.left \+ rect.width / 2;  
      const cy \= rect.top \+ rect.height / 2;  
      const dx \= Math.max(rect.left \- e.clientX, 0, e.clientX \- rect.right);  
      const dy \= Math.max(rect.top \- e.clientY, 0, e.clientY \- rect.bottom);  
      const dist \= Math.hypot(dx, dy);  
      // Over the button itself the light settles on the diagonal (framing the  
      // corners) and gently sways with the cursor position within the button.  
      if (dist \=== 0\) {  
        const nx \= (e.clientX \- cx) / (rect.width / 2);  
        const ny \= (cy \- e.clientY) / (rect.height / 2);  
        pointerAngle \= Math.atan2(2 / rect.height, \-2 / rect.width) \+ nx \* 0.3 \+ ny \* 0.15;  
      } else {  
        pointerAngle \= Math.atan2(cy \- e.clientY, e.clientX \- cx);  
      }  
      const t \= Math.max(0, 1 \- dist / Math.max(propsRef.current.proximity, 1));  
      proximityT \= t \* t \* (3 \- 2 \* t);  
    };  
    window.addEventListener('pointermove', onPointerMove);

    let angle \= 2.4;  
    let idleAngle \= 2.4;  
    let bright \= 0;  
    let last \= performance.now();  
    let raf \= 0;

    const lineC \= new Color();  
    const baseC \= new Color();

    const update \= now \=\> {  
      raf \= requestAnimationFrame(update);  
      const dt \= Math.min((now \- last) / 1000, 0.05);  
      last \= now;  
      const p \= propsRef.current;

      idleAngle \+= p.speed \* dt;  
      const steer \= p.followMouse && pointerAngle \!= null && (\!p.autoAnimate || proximityT \> 0);  
      const target \= steer ? pointerAngle : idleAngle;  
      const diff \= ((target \- angle \+ Math.PI \* 3\) % (Math.PI \* 2)) \- Math.PI;  
      angle \+= diff \* (1 \- Math.exp(-dt \* 7));

      // Shine fades in with pointer proximity unless autoAnimate keeps it on  
      const brightTarget \= p.autoAnimate ? 1 : proximityT;  
      bright \+= (brightTarget \- bright) \* (1 \- Math.exp(-dt \* 8));

      lineC.set(p.lineColor);  
      baseC.set(p.baseColor);  
      program.uniforms.uAngle.value \= angle;  
      program.uniforms.uRadius.value \= Math.min(p.radius, Math.min(sizeRef.w, sizeRef.h) / 2\) \* dpr;  
      program.uniforms.uLineColor.value \= \[lineC.r, lineC.g, lineC.b\];  
      program.uniforms.uBaseColor.value \= \[baseC.r, baseC.g, baseC.b\];  
      program.uniforms.uIntensity.value \= p.intensity \* bright;  
      program.uniforms.uShineSize.value \= (p.shineSize \* Math.PI) / 180;  
      program.uniforms.uShineFade.value \= (p.shineFade \* Math.PI) / 180;  
      program.uniforms.uThickness.value \= p.thickness \* dpr;  
      renderer.render({ scene: mesh });  
    };  
    raf \= requestAnimationFrame(update);

    return () \=\> {  
      cancelAnimationFrame(raf);  
      ro.disconnect();  
      window.removeEventListener('pointermove', onPointerMove);  
      if (gl.canvas.parentNode \=== fx) fx.removeChild(gl.canvas);  
      gl.getExtension('WEBGL\_lose\_context')?.loseContext();  
    };  
  }, \[\]);

  return (  
    \<button  
      ref={btnRef}  
      type={type}  
      disabled={disabled}  
      onClick={onClick}  
      className={\`specular-button specular-button--${size}${className ? \` ${className}\` : ''}\`}  
      style={{  
        '--sb-radius': \`${radius}px\`,  
        '--sb-tint': tint,  
        '--sb-tint-opacity': tintOpacity,  
        '--sb-blur': \`${blur}px\`,  
        '--sb-text-color': textColor  
      }}  
    \>  
      \<span ref={fxRef} className="specular-button\_\_fx" aria-hidden="true" /\>  
      \<span className="specular-button\_\_label"\>{children}\</span\>  
    \</button\>  
  );  
};

export default SpecularButton;

\`\`\`

\#\#\# Component CSS  
\`\`\`css  
.specular-button {  
  \--sb-radius: 18px;  
  \--sb-tint: \#ffffff;  
  \--sb-tint-opacity: 0;  
  \--sb-blur: 0px;  
  \--sb-text-color: \#f5f5f5;

  position: relative;  
  display: inline-flex;  
  align-items: center;  
  justify-content: center;  
  border: none;  
  margin: 0;  
  font-family: inherit;  
  font-weight: 500;  
  letter-spacing: 0.01em;  
  line-height: 1;  
  color: var(--sb-text-color);  
  background: color-mix(in srgb, var(--sb-tint) calc(var(--sb-tint-opacity) \* 100%), transparent);  
  border-radius: var(--sb-radius);  
  backdrop-filter: blur(var(--sb-blur));  
  \-webkit-backdrop-filter: blur(var(--sb-blur));  
  box-shadow:  
    inset 0 1px 0 rgba(255, 255, 255, 0.04),  
    0 8px 24px rgba(0, 0, 0, 0.25);  
  cursor: pointer;  
  outline: none;  
  transition: transform 0.15s ease;  
}

.specular-button:active {  
  transform: scale(0.97);  
}

.specular-button:focus-visible {  
  outline: 2px solid color-mix(in srgb, var(--sb-text-color) 60%, transparent);  
  outline-offset: 3px;  
}

.specular-button:disabled {  
  opacity: 0.55;  
  cursor: default;  
}

.specular-button:disabled:active {  
  transform: none;  
}

.specular-button--sm {  
  font-size: 0.85rem;  
  padding: 10px 22px;  
}

.specular-button--md {  
  font-size: 1rem;  
  padding: 14px 30px;  
}

.specular-button--lg {  
  font-size: 1.15rem;  
  padding: 18px 40px;  
}

/\* Canvas extends past the button so the rim glow can bleed outside the edge \*/  
.specular-button\_\_fx {  
  position: absolute;  
  inset: \-20px;  
  pointer-events: none;  
  z-index: 1;  
}

.specular-button\_\_fx canvas {  
  display: block;  
  width: 100%;  
  height: 100%;  
}

.specular-button\_\_label {  
  position: relative;  
  z-index: 2;  
}

\`\`\`

\#\#\# Integration Instructions  
1\. Install any listed dependencies.  
2\. Copy the component source into the appropriate directory in the project.  
3\. Import the CSS file alongside the component.  
4\. Import and render the component using the usage example above as a starting point.  
5\. Adjust props as needed for the specific use case — refer to the props table for all available options.

### **Prompt for Line Sidebar :**

\#\# Integrate the \<LineSidebar /\> component from React Bits

You are helping integrate an open-source React component into an existing application.

\#\#\# Component: LineSidebar  
\#\#\# Variant: JavaScript \+ CSS

\---

\#\#\# Usage Example  
\`\`\`jsx  
import LineSidebar from './LineSidebar';

\<LineSidebar  
  items={\['Overview', 'Components', 'Animations', 'Backgrounds', 'Showcase'\]}  
  accentColor="\#A855F7"  
  textColor="\#c4c4c4"  
  markerColor="\#6c6c6c"  
  showIndex  
  showMarker  
  proximityRadius={100}  
  maxShift={30}  
  falloff="smooth"  
  markerLength={60}  
  markerGap={0}  
  tickScale={0.5}  
  scaleTick  
  itemGap={20}  
  fontSize={1.1}  
  smoothing={100}  
  defaultActive={0}  
  onItemClick={(index, label) \=\> console.log(index, label)}  
/\>  
\`\`\`

\#\#\# Props  
| Prop | Type | Default | Description |  
|------|------|---------|-------------|  
| items | string\[\] | \[...\] | Labels rendered as the list of sidebar entries. |  
| accentColor | string | "\#A855F7" | Color items and markers shift toward as the cursor gets close. |  
| textColor | string | "\#c4c4c4" | Resting color of the item labels. |  
| markerColor | string | "\#6c6c6c" | Resting color of the leading marker lines. |  
| showIndex | boolean | true | Show the zero-padded index before each label. |  
| showMarker | boolean | true | Show the marker lines (and short ticks) beside each item. |  
| proximityRadius | number | 100 | Vertical distance in pixels within which the cursor influences an item. |  
| maxShift | number | 30 | Maximum horizontal shift in pixels the label slides at full proximity. |  
| falloff | "linear" | "smooth" | "sharp" | "smooth" | Curve mapping cursor distance to the proximity effect. |  
| markerLength | number | 60 | Length in pixels of the marker line; the in-between ticks scale from this too. |  
| markerGap | number | 0 | Gap in pixels between the labels and the markers. |  
| tickScale | number | 0.5 | Length of the in-between ticks as a fraction of markerLength. |  
| scaleTick | boolean | true | When true, the in-between ticks also grow with cursor proximity. |  
| itemGap | number | 20 | Vertical gap between items in pixels. |  
| fontSize | number | 1.1 | Font size of the labels in rem. |  
| smoothing | number | 100 | Transition duration in milliseconds for the proximity response. |  
| defaultActive | number | null | null | Index of the item selected on mount. |  
| onItemClick | (index, label) \=\> void | \- | Called when an item is clicked; the clicked item also becomes active. |  
| className | string | "" | Additional CSS classes for the outer wrapper. |

\#\#\# Full Component Source  
\`\`\`jsx  
import { useRef, useState, useCallback, useEffect } from 'react';  
import './LineSidebar.css';

const FALLOFF\_CURVES \= {  
  linear: p \=\> p,  
  smooth: p \=\> p \* p \* (3 \- 2 \* p),  
  sharp: p \=\> p \* p \* p  
};

const DEFAULT\_ITEMS \= \[  
  'Overview',  
  'Components',  
  'Animations',  
  'Backgrounds',  
  'Showcase',  
  'Playground',  
  'Templates',  
  'Changelog',  
  'Community',  
  'Resources',  
  'Documentation',  
  'Support'  
\];

const LineSidebar \= ({  
  items \= DEFAULT\_ITEMS,  
  accentColor \= '\#A855F7',  
  textColor \= '\#c4c4c4',  
  markerColor \= '\#6c6c6c',  
  showIndex \= true,  
  showMarker \= true,  
  proximityRadius \= 100,  
  maxShift \= 30,  
  falloff \= 'smooth',  
  markerLength \= 60,  
  markerGap \= 0,  
  tickScale \= 0.5,  
  scaleTick \= true,  
  itemGap \= 20,  
  fontSize \= 1.1,  
  smoothing \= 100,  
  defaultActive \= null,  
  onItemClick,  
  className \= ''  
}) \=\> {  
  const listRef \= useRef(null);  
  const itemRefs \= useRef(\[\]);  
  const targetsRef \= useRef(\[\]);  
  const currentRef \= useRef(\[\]);  
  const rafRef \= useRef(null);  
  const lastRef \= useRef(0);  
  const activeRef \= useRef(defaultActive);  
  const smoothingRef \= useRef(smoothing);  
  const \[activeIndex, setActiveIndex\] \= useState(defaultActive);

  activeRef.current \= activeIndex;  
  smoothingRef.current \= smoothing;

  // Single rAF loop that eases every item's \--effect toward its target using  
  // frame-rate independent exponential smoothing, so color, shift and scale  
  // all move together without staggering CSS transitions.  
  const runFrame \= useCallback(now \=\> {  
    const dt \= Math.min((now \- lastRef.current) / 1000, 0.05);  
    lastRef.current \= now;  
    const tau \= Math.max(smoothingRef.current, 1\) / 1000;  
    const k \= 1 \- Math.exp(-dt / tau);

    let moving \= false;  
    const items \= itemRefs.current;  
    for (let i \= 0; i \< items.length; i++) {  
      const el \= items\[i\];  
      if (\!el) continue;  
      const target \= Math.max(targetsRef.current\[i\] || 0, activeRef.current \=== i ? 1 : 0);  
      const cur \= currentRef.current\[i\] || 0;  
      const next \= cur \+ (target \- cur) \* k;  
      const settled \= Math.abs(target \- next) \< 0.0015;  
      const value \= settled ? target : next;  
      currentRef.current\[i\] \= value;  
      el.style.setProperty('--effect', value.toFixed(4));  
      if (\!settled) moving \= true;  
    }

    rafRef.current \= moving ? requestAnimationFrame(runFrame) : null;  
  }, \[\]);

  const startLoop \= useCallback(() \=\> {  
    if (rafRef.current \!= null) return;  
    lastRef.current \= performance.now();  
    rafRef.current \= requestAnimationFrame(runFrame);  
  }, \[runFrame\]);

  const handlePointerMove \= useCallback(  
    e \=\> {  
      const list \= listRef.current;  
      if (\!list) return;  
      const rect \= list.getBoundingClientRect();  
      const pointerY \= e.clientY \- rect.top;  
      const ease \= FALLOFF\_CURVES\[falloff\] ?? FALLOFF\_CURVES.linear;  
      const items \= itemRefs.current;  
      for (let i \= 0; i \< items.length; i++) {  
        const el \= items\[i\];  
        if (\!el) continue;  
        const center \= el.offsetTop \+ el.offsetHeight / 2;  
        const distance \= Math.abs(pointerY \- center);  
        targetsRef.current\[i\] \= ease(Math.max(0, 1 \- distance / proximityRadius));  
      }  
      startLoop();  
    },  
    \[falloff, proximityRadius, startLoop\]  
  );

  const handlePointerLeave \= useCallback(() \=\> {  
    targetsRef.current \= targetsRef.current.map(() \=\> 0);  
    startLoop();  
  }, \[startLoop\]);

  const handleClick \= useCallback(  
    (index, label) \=\> {  
      setActiveIndex(index);  
      onItemClick?.(index, label);  
    },  
    \[onItemClick\]  
  );

  useEffect(() \=\> {  
    startLoop();  
  }, \[activeIndex, startLoop\]);

  useEffect(  
    () \=\> () \=\> {  
      if (rafRef.current \!= null) cancelAnimationFrame(rafRef.current);  
    },  
    \[\]  
  );

  return (  
    \<nav  
      className={\`line-sidebar${showMarker ? ' line-sidebar--markers' : ''}${scaleTick ? ' line-sidebar--scale-tick' : ''}${className ? \` ${className}\` : ''}\`}  
      style={{  
        '--accent-color': accentColor,  
        '--text-color': textColor,  
        '--marker-color': markerColor,  
        '--marker-length': \`${markerLength}px\`,  
        '--marker-gap': \`${markerGap}px\`,  
        '--tick-scale': tickScale,  
        '--max-shift': \`${maxShift}px\`,  
        '--item-gap': \`${itemGap}px\`,  
        '--font-size': \`${fontSize}rem\`,  
        '--smoothing': \`${smoothing}ms\`  
      }}  
    \>  
      \<ul ref={listRef} className="line-sidebar\_\_list" onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}\>  
        {items.map((label, index) \=\> (  
          \<li  
            key={\`${label}-${index}\`}  
            ref={el \=\> {  
              itemRefs.current\[index\] \= el;  
            }}  
            className="line-sidebar\_\_item"  
            aria-current={activeIndex \=== index ? 'true' : undefined}  
            onClick={() \=\> handleClick(index, label)}  
          \>  
            {showMarker && \<span className="line-sidebar\_\_marker" aria-hidden="true" /\>}  
            \<span className="line-sidebar\_\_label"\>  
              {showIndex && \<span className="line-sidebar\_\_index"\>{String(index \+ 1).padStart(2, '0')}\</span\>}  
              \<span className="line-sidebar\_\_text"\>{label}\</span\>  
            \</span\>  
          \</li\>  
        ))}  
      \</ul\>  
    \</nav\>  
  );  
};

export default LineSidebar;

\`\`\`

\#\#\# Component CSS  
\`\`\`css  
.line-sidebar {  
  \--accent-color: \#a855f7;  
  \--text-color: \#c4c4c4;  
  \--marker-color: \#6c6c6c;  
  \--marker-length: 60px;  
  \--marker-gap: 0px;  
  \--tick-scale: 0.5;  
  \--max-shift: 30px;  
  \--item-gap: 20px;  
  \--font-size: 1.1rem;  
  \--smoothing: 100ms;

  position: relative;  
  display: flex;  
  justify-content: flex-start;  
}

.line-sidebar--markers {  
  padding-left: calc(var(--marker-length) \+ var(--marker-gap));  
}

.line-sidebar\_\_list {  
  list-style: none;  
  margin: 0;  
  padding: 1rem 0;  
  display: flex;  
  flex-direction: column;  
  gap: var(--item-gap);  
}

/\* \--effect (0..1) is driven per item by a rAF lerp in JS, so every derived  
   property below reads the same continuously-animating value and stays in  
   step, with no CSS transitions to stagger. \*/  
.line-sidebar\_\_item {  
  position: relative;  
  cursor: pointer;  
}

/\* Widen the pointer target so items react a touch before the cursor arrives \*/  
.line-sidebar\_\_item::before {  
  content: '';  
  position: absolute;  
  inset: \-6px \-48px;  
}

.line-sidebar\_\_label {  
  position: relative;  
  display: inline-flex;  
  align-items: baseline;  
  font-size: var(--font-size);  
  line-height: 1.2;  
  color: color-mix(in srgb, var(--accent-color) calc(var(--effect, 0\) \* 100%), var(--text-color));  
  transform: translateX(calc(var(--effect, 0\) \* var(--max-shift)));  
}

.line-sidebar\_\_index {  
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;  
  margin-right: 0.6rem;  
  font-size: 0.85em;  
  opacity: calc(0.55 \+ var(--effect, 0\) \* 0.45);  
}

.line-sidebar\_\_marker {  
  position: absolute;  
  top: 50%;  
  left: calc(-1 \* var(--marker-length) \- var(--marker-gap));  
  height: 1px;  
  width: var(--marker-length);  
  background-color: color-mix(in srgb, var(--accent-color) calc(var(--effect, 0\) \* 100%), var(--marker-color));  
  transform-origin: left center;  
  transform: translateY(-50%) scaleX(calc(0.7 \+ var(--effect, 0\) \* 0.5));  
}

/\* Short static tick centered in the gap between two menu items \*/  
.line-sidebar--markers .line-sidebar\_\_item:not(:last-child)::after {  
  content: '';  
  position: absolute;  
  top: calc(100% \+ var(--item-gap) / 2);  
  left: calc(-1 \* var(--marker-length) \- var(--marker-gap));  
  height: 1px;  
  width: calc(var(--marker-length) \* var(--tick-scale));  
  background-color: var(--marker-color);  
  opacity: 0.5;  
  transform: translateY(-50%);  
}

/\* When enabled, the in-between ticks grow with cursor proximity too \*/  
.line-sidebar--scale-tick .line-sidebar\_\_item:not(:last-child)::after {  
  transform-origin: left center;  
  transform: translateY(-50%) scaleX(calc(0.7 \+ var(--effect, 0\) \* 0.6));  
}

\`\`\`

\#\#\# Integration Instructions  
1\. Install any listed dependencies.  
2\. Copy the component source into the appropriate directory in the project.  
3\. Import the CSS file alongside the component.  
4\. Import and render the component using the usage example above as a starting point.  
5\. Adjust props as needed for the specific use case — refer to the props table for all available options.

### **Structured Text Flowchart**

**Global Actions (Available Anywhere)**

* **\[Click: Dark/Light Mode Toggle\]** \-\> Switches CSS variables/GSAP themes \-\> Updates UI seamlessly.  
* **\[Click: AI Chat Sidebar Toggle\]** \-\> Opens/Collapses chat panel \-\> **\[Send Message\]** \-\> Triggers LLM API Call (with Failover) \-\> Streams response via WebSockets.

**1\. Landing & Welcome Page**

* **\[Click: Upload Resume Button\]** \-\> Opens file picker \-\> Parses PDF text via `pdf.js` locally.  
  * **\[Click: Submit Analysis\]** \-\> Sends parsed text \+ Job Role \+ JD to Backend.  
  * *Action:* Backend triggers Dual-LLM Analysis.  
  * *Result:* Navigates to Analysis & Scoring Page.  
* **\[Click: Build From Scratch Button\]** \-\> Skips upload.  
  * **\[Click: Submit Details\]** \-\> Sends Job Role \+ JD to Backend.  
  * *Action:* Backend triggers Dual-LLM Template Generation.  
  * *Result:* Navigates directly to the Digital Resume Editor.

**2\. Analysis & Scoring Page**

* *On Load:* Renders visual score meter, textual feedback, and course recommendations.  
* **\[Click: Course Link\]** \-\> Opens course provider in a new tab.  
* **\[Click: Edit Resume Button\]** \-\> Navigates to Digital Resume Editor.

**3\. Digital Resume Editor**

* **\[Drag & Drop: Sidebar Sections\]** \-\> Reorders layout in main canvas.  
* **\[Click: 1-Click Add Skill (Right Sidebar)\]** \-\> Injects skill into canvas \-\> Triggers background AI API Call to recalculate score \-\> Meter updates in real time.  
* **\[Click: Switch to Template View\]** \-\> Toggles canvas to show ideal template.  
* **\[Click: Switch to My Resume\]** \-\> Restores user progress perfectly.  
* **\[Click: Finalize & Export Button\]** \-\> Navigates to Final Export & Job Matching Page.

**4\. Final Export & Job Matching Page**

* *On Load (Parallel Actions):*  
  * Render final magnified score.  
  * Trigger Backend Scraping Worker (Bright Data).  
* **\[System: Scraping Complete\]** \-\> WebSocket pushes live jobs/recruiters to UI \-\> Job cards appear.  
* **\[Click: Download PDF/DOCX\]** \-\> Sends HTML/state to Backend Worker \-\> Puppeteer generates PDF \-\> File downloads to local machine.  
* **\[Click: Apply Now (Job Card)\]** \-\> Copies AI generated 5 to 10 line summary to clipboard \-\> Opens company application page in new tab.  
* **\[Click: Connect (Recruiter Card)\]** \-\> Copies custom outreach message \-\> Opens LinkedIn recruiter profile in new tab.

### **The Dual-Failover Logic Map**

Whenever a button triggers an AI or Scraping action, the backend follows this strict state flow to prevent UI freezing:

**A. LLM API Failover Flow (Triggered by Score, Chat, or Editing)**

1. Frontend requests data.  
2. Backend pings Redis Cache. If found \-\> Return data instantly.  
3. If not cached \-\> Call **Groq API** (`llama-3.3-70b-versatile`) with 5 second timeout.  
4. *Condition: Success* \-\> Return data to Frontend \-\> Cache result.  
5. *Condition: Timeout / Rate Limit (429)* \-\> Call **OpenAI API** fallback.  
6. *Condition: OpenAI Success* \-\> Return data to Frontend \-\> Cache result.  
7. *Condition: Total Failure* \-\> Send error to Frontend \-\> Display minimalist red box (e.g., "AI services are currently busy. Please try again.").

**B. Bright Data Scraping Flow (Triggered on Final Page Load)**

1. Frontend loads Final Page \-\> Requests job data \-\> Receives `job_search_id`.  
2. Backend Worker checks Redis Cache for recent LinkedIn scrape matching the JD.  
3. If found \-\> Fire WebSocket event \-\> Display jobs instantly.  
4. If not cached \-\> Worker initiates Bright Data API call.  
5. *Condition: Success* \-\> Format data \-\> Save to DB/Cache \-\> Fire WebSocket event \-\> UI populates.  
6. *Condition: Scraper Blocked/Timeout* \-\> Fetch broader generic jobs from cache \-\> Fire WebSocket event \-\> Display generic fallback jobs \+ minimalist red box alert ("Live fetching delayed, showing recent matches").

## **Core Backend Architecture**

Separate your application into distinct services rather than a single monolithic block. This allows you to scale the AI processing and the web scraping independently of your main web server.

| Component | Technology Recommendation | Purpose |
| :---- | :---- | :---- |
| **Main API Server** | Node.js (Express/NestJS) or Python (FastAPI) | Handles auth, file uploads, and routes frontend requests. |
| **Worker Queue** | Redis \+ BullMQ (Node) or Celery (Python) | Offloads heavy tasks (scraping, PDF generation) from the main thread. |
| **Database** | PostgreSQL | Stores user profiles, resume states, and encrypted credentials. |
| **Cache Layer** | Redis | Caches job queries and standard AI responses to reduce API costs. |
| **Real-time Comms** | WebSockets (Socket.io) | Pushes live score updates, chat responses, and scraping results to the frontend. |

## **1\. The Dual AI Routing Layer**

You need an abstraction layer, often called an AI Gateway or AI Service Class, to manage the interaction between Groq and OpenAI. Do not hardcode API calls directly into your route controllers.

* **The Failover Mechanism:** Configure the AI Service to always hit the Groq API first (since it is drastically faster for Llama-3). Wrap this call in a try/catch block with a strict timeout (e.g., 5 seconds). If Groq throws a rate limit error (429) or times out, the catch block immediately routes the exact same prompt to the OpenAI API endpoint.  
* **Streaming Responses:** For the real-time resume editor and the chatbot, use Server-Sent Events (SSE) or WebSockets. This allows the LLM to stream its text generation token-by-token to the frontend, preventing the user from staring at a loading spinner.  
* **Prompt Caching:** Many users will upload resumes for identical job titles (e.g., "Software Engineer"). Hash the job description and cache the extracted core requirements in Redis. If another user applies for a nearly identical role, fetch the requirements from the cache instead of burning LLM tokens.

## **2\. Managing Bright Data Scraping**

Web scraping is inherently slow and unpredictable due to CAPTCHAs, proxy rotations, and rate limits. If you process Bright Data requests on the main server thread, the user's browser will time out waiting for a response.

* **Asynchronous Workers:** When the user lands on the final matching page, the main server generates a unique job\_search\_id and immediately returns it to the frontend. Simultaneously, it places the scraping task into your Worker Queue (e.g., BullMQ).  
* **Background Processing:** A separate worker process picks up the task, executes the Bright Data API call to scrape LinkedIn, formats the returned data, and saves it to the database under that job\_search\_id.  
* **WebSocket Push:** Once the worker finishes, it triggers an event over WebSockets to notify the frontend. The frontend then dynamically populates the job listings and recruiter profiles without needing a page refresh.  
* **Data Pooling:** Cache LinkedIn scraping results for 12 to 24 hours. If 50 people search for "Marketing Manager in London" today, you only need to call the Bright Data API once. This saves massive amounts of money and bypasses rate limits entirely.

## **3\. Handling PDF Parsing and Export**

File handling can also block your server if not managed correctly.

* **Ingestion:** When a user uploads a PDF, parse the text directly in the frontend using pdf.js before sending it to the backend. This saves server bandwidth and CPU cycles. Only send the extracted raw string to your AI routing layer for analysis.  
* **Export:** For generating the final, beautifully formatted PDF, use a headless browser service like Puppeteer on your backend. Because rendering CSS/GSAP animations to a static PDF is resource-intensive, place PDF generation into your Worker Queue just like the scraping tasks.

## **4\. Security Implementation**

To meet your strict security requirements and isolate user data:

* **Stateless Auth:** Use JSON Web Tokens (JWT) with short lifespans (15 minutes) and HTTP-only refresh cookies.  
* **Row-Level Security (RLS):** If using PostgreSQL, implement RLS. This ensures that even if a query is somehow injected, the database itself will mathematically refuse to return a resume belonging to a user\_id that does not match the token making the request.  
* **API Obfuscation:** Never expose your Groq, OpenAI, or Bright Data API keys to the frontend. All third-party calls must originate from your backend server.

**AI Models That Will Perform All Analysis, Scoring and Answering User Questions in this Project :**

1. llama-3.3-70b-versatile  
2. openai/gpt-oss-120b

Both these models are to be accessed via API calls through Groq API.

**MOST IMPORTANT \!\!**

- Use taste skill to review the project built and improvise to make the frontend look better and visually attractive and stunning, and improvise the backend to handle future updates seamlessly without any errors. The backend must support all the features displayed in the frontend.  
- Use UI-UX-Pro Max skill to implement all the modern and trendy features suitable for this app.  
- Use Antigravity Awesome skills to enhance the backend and frontend to handle all features seamlessly and error free.  
- Use impeccable skill to enhance the frontend of the website, especially the welcome / home page.  
- Use Magic MCP and motion design skills to implement beautiful and stunning motion animations that catch the user’s attention immediately and elevate the overall rich and premium look of the website.  
- The website must be very tight on security implementing all the modern security locks to prevent hacking into the website via unauthorized access.  
- Use of motion animations on the welcome / home page is an absolute non-negotiable requirement.

**Add a .env file where i will paste my Groq API key and BrightData API key**