import { useRef, useState, useCallback, useEffect } from 'react';
import './LineSidebar.css';

const FALLOFF_CURVES = {
  linear: p => p,
  smooth: p => p * p * (3 - 2 * p),
  sharp: p => p * p * p
};

const DEFAULT_ITEMS = [
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
];

const LineSidebar = ({
  items = DEFAULT_ITEMS,
  accentColor = '#A855F7',
  textColor = '#c4c4c4',
  markerColor = '#6c6c6c',
  showIndex = true,
  showMarker = true,
  proximityRadius = 100,
  maxShift = 30,
  falloff = 'smooth',
  markerLength = 60,
  markerGap = 0,
  tickScale = 0.5,
  scaleTick = true,
  itemGap = 20,
  fontSize = 1.1,
  smoothing = 100,
  defaultActive = null,
  activeIndex: controlledActiveIndex,
  onItemClick,
  className = ''
}) => {
  const listRef = useRef(null);
  const itemRefs = useRef([]);
  const targetsRef = useRef([]);
  const currentRef = useRef([]);
  const rafRef = useRef(null);
  const lastRef = useRef(0);
  const smoothingRef = useRef(smoothing);
  
  const [internalActiveIndex, setInternalActiveIndex] = useState(defaultActive !== null ? defaultActive : 0);
  const activeIndex = controlledActiveIndex !== undefined ? controlledActiveIndex : internalActiveIndex;

  const activeRef = useRef(activeIndex);
  activeRef.current = activeIndex;
  smoothingRef.current = smoothing;

  // Keep internal ref arrays aligned with items length
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, items.length);
    targetsRef.current = Array.from({ length: items.length }, (_, i) => (targetsRef.current[i] || 0));
    currentRef.current = Array.from({ length: items.length }, (_, i) => (currentRef.current[i] || 0));
  }, [items.length]);

  // Single rAF loop that eases every item's --effect toward its target
  const runFrame = useCallback(now => {
    const dt = Math.min((now - lastRef.current) / 1000, 0.05);
    lastRef.current = now;
    const tau = Math.max(smoothingRef.current, 1) / 1000;
    const k = 1 - Math.exp(-dt / tau);

    let moving = false;
    const els = itemRefs.current;
    const count = items.length;

    for (let i = 0; i < count; i++) {
      const el = els[i];
      if (!el) continue;
      const target = Math.max(targetsRef.current[i] || 0, activeRef.current === i ? 1 : 0);
      const cur = currentRef.current[i] ?? 0;
      const next = cur + (target - cur) * k;
      const settled = Math.abs(target - next) < 0.0015;
      const value = settled ? target : next;
      currentRef.current[i] = value;
      el.style.setProperty('--effect', value.toFixed(4));
      if (!settled) moving = true;
    }

    rafRef.current = moving ? requestAnimationFrame(runFrame) : null;
  }, [items.length]);

  const startLoop = useCallback(() => {
    if (rafRef.current != null) return;
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(runFrame);
  }, [runFrame]);

  // Robust pointer move calculation using bounding client rects
  const handlePointerMove = useCallback(
    e => {
      const list = listRef.current;
      if (!list) return;
      const listRect = list.getBoundingClientRect();
      const pointerY = e.clientY - listRect.top;
      const ease = FALLOFF_CURVES[falloff] ?? FALLOFF_CURVES.linear;
      const els = itemRefs.current;

      for (let i = 0; i < items.length; i++) {
        const el = els[i];
        if (!el) continue;
        const itemRect = el.getBoundingClientRect();
        const center = itemRect.top - listRect.top + itemRect.height / 2;
        const distance = Math.abs(pointerY - center);
        targetsRef.current[i] = ease(Math.max(0, 1 - distance / proximityRadius));
      }
      startLoop();
    },
    [falloff, proximityRadius, startLoop, items.length]
  );

  const handlePointerLeave = useCallback(() => {
    for (let i = 0; i < items.length; i++) {
      targetsRef.current[i] = 0;
    }
    startLoop();
  }, [startLoop, items.length]);

  const handleClick = useCallback(
    (index, label) => {
      if (controlledActiveIndex === undefined) {
        setInternalActiveIndex(index);
      }
      onItemClick?.(index, label);
    },
    [controlledActiveIndex, onItemClick]
  );

  // Sync active states immediately and kick animation loop
  useEffect(() => {
    for (let i = 0; i < items.length; i++) {
      const el = itemRefs.current[i];
      if (el) {
        const isAct = activeIndex === i;
        const targetVal = isAct ? 1 : (targetsRef.current[i] || 0);
        if (currentRef.current[i] === undefined) {
          currentRef.current[i] = targetVal;
          el.style.setProperty('--effect', targetVal.toFixed(4));
        }
      }
    }
    startLoop();
  }, [activeIndex, items.length, startLoop]);

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    },
    []
  );

  return (
    <nav
      className={`line-sidebar${showMarker ? ' line-sidebar--markers' : ''}${scaleTick ? ' line-sidebar--scale-tick' : ''}${className ? ` ${className}` : ''}`}
      style={{
        '--accent-color': accentColor,
        '--text-color': textColor,
        '--marker-color': markerColor,
        '--marker-length': `${markerLength}px`,
        '--marker-gap': `${markerGap}px`,
        '--tick-scale': tickScale,
        '--max-shift': `${maxShift}px`,
        '--item-gap': `${itemGap}px`,
        '--font-size': `${fontSize}rem`,
        '--smoothing': `${smoothing}ms`
      }}
    >
      <ul
        ref={listRef}
        className="line-sidebar__list"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerCancel={handlePointerLeave}
      >
        {items.map((label, index) => (
          <li
            key={`${label}-${index}`}
            ref={el => {
              itemRefs.current[index] = el;
            }}
            className="line-sidebar__item"
            aria-current={activeIndex === index ? 'true' : undefined}
            onClick={() => handleClick(index, label)}
          >
            {showMarker && <span className="line-sidebar__marker" aria-hidden="true" />}
            <span className="line-sidebar__label">
              {showIndex && <span className="line-sidebar__index">{String(index + 1).padStart(2, '0')}</span>}
              <span className="line-sidebar__text">{label}</span>
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default LineSidebar;
