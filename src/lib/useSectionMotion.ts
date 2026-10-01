import { useEffect } from 'react';

// Fraction of the screen a section must fill before its entrance plays.
const ENTER_AT = 0.28;
// Most items revealed one after another in a section; the rest share the last delay.
const MAX_STAGGER = 9;

const visibleShare = (rect: DOMRect, root: DOMRect) =>
  Math.max(0, Math.min(rect.bottom, root.bottom) - Math.max(rect.top, root.top)) / root.height;

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * The pieces of a section that rise in one after another: the children of its
 * content wrapper (`.animate-doodle-in`). When the wrapper only holds one or two
 * blocks (e.g. a single card), the biggest one is opened up so its own
 * contents stagger too.
 */
const revealTargets = (section: HTMLElement): HTMLElement[] => {
  const root = section.querySelector<HTMLElement>('.animate-doodle-in');
  if (!root) return [];
  let items = Array.from(root.children) as HTMLElement[];
  const inFlow = items.filter((el) => getComputedStyle(el).position !== 'absolute');
  if (inFlow.length < 3 && inFlow.length > 0) {
    const biggest = inFlow.reduce((a, b) => (b.offsetHeight > a.offsetHeight ? b : a));
    items = items.flatMap((el) => (el === biggest ? [el, ...(Array.from(el.children) as HTMLElement[])] : [el]));
    // The opened-up block stays put; its children do the moving.
    items = items.filter((el) => el !== biggest);
  }
  // Leave elements that already run their own animation alone.
  return items.filter((el) => getComputedStyle(el).animationName === 'none');
};

/**
 * Scroll-driven motion for the invitation, built from what's already in each
 * section (Material-style "emphasized decelerate" entrances):
 *  - when a section scrolls into view its heading, cards and buttons rise in
 *    one after another, the heading underline draws itself and the scattered
 *    doodles pop in; it replays every time the section comes back into view;
 *  - while scrolling, the scattered doodles drift at slightly different speeds
 *    (parallax), settling into place when the section snaps.
 */
export const useSectionMotion = (containerId: string, enabled: boolean, deps: unknown[] = []) => {
  useEffect(() => {
    if (!enabled) return;
    const container = document.getElementById(containerId);
    if (!container) return;
    if (reducedMotion()) return;

    const sections = Array.from(container.querySelectorAll<HTMLElement>('.mobile-snap-section'));
    // Sections already on screen start their entrance right away instead of
    // waiting a frame for the observer (which would flash them empty).
    const now = container.getBoundingClientRect();
    sections.forEach((section) => {
      if (visibleShare(section.getBoundingClientRect(), now) >= ENTER_AT) section.classList.add('is-active');
      revealTargets(section).forEach((el, i) => {
        el.classList.add('reveal-item');
        el.style.setProperty('--reveal-i', String(Math.min(i, MAX_STAGGER)));
      });
      section.classList.add('motion-ready');
    });


    const observer = new IntersectionObserver(
      (entries) => {
        // While the RSVP keyboard is up nothing should move.
        if (container.classList.contains('is-typing')) return;
        entries.forEach((entry) => {
          const section = entry.target as HTMLElement;
          const root = entry.rootBounds ?? container.getBoundingClientRect();
          const share = visibleShare(entry.boundingClientRect, root);
          if (share >= ENTER_AT) section.classList.add('is-active');
          // Reset only once it's fully off screen, so it replays next time
          // without ever visibly disappearing.
          else if (!entry.isIntersecting) section.classList.remove('is-active');
        });
      },
      { root: container, threshold: Array.from({ length: 21 }, (_, i) => i / 20) },
    );
    sections.forEach((s) => observer.observe(s));

    // Parallax: each section gets --sp, its distance (px) from the screen's
    // centre; scattered doodles shift by a fraction of it (their --depth).
    let frame = 0;
    const updateParallax = () => {
      frame = 0;
      const root = container.getBoundingClientRect();
      const mid = root.top + root.height / 2;
      for (const s of sections) {
        const r = s.getBoundingClientRect();
        if (r.bottom < root.top - root.height || r.top > root.bottom + root.height) continue;
        // Tall sections (gallery, wishes) settle against their top instead of their middle.
        const anchor = r.height > root.height ? r.top + root.height / 2 : r.top + r.height / 2;
        s.style.setProperty('--sp', (anchor - mid).toFixed(1));
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateParallax);
    };
    container.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    updateParallax();

    return () => {
      observer.disconnect();
      container.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
      sections.forEach((s) => {
        s.classList.remove('motion-ready', 'is-active');
        s.style.removeProperty('--sp');
        s.querySelectorAll<HTMLElement>('.reveal-item').forEach((el) => {
          el.classList.remove('reveal-item');
          el.style.removeProperty('--reveal-i');
        });
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerId, enabled, ...deps]);
};
