type ScrollTriggerUnit = 'px' | 'percent'

interface ScrollTimeline {
  [property: string]: [number | string, number | string]; // Start and end values
}

interface ScrollEventHandlerOptions {
  startTrigger: number;
  endTrigger: number;
  unit: ScrollTriggerUnit;
  timeline?: ScrollTimeline; // Add timeline to options
  onStart?: () => void;
  onScroll?: (scrollPosition: number) => void;
  onEnd?: () => void;
  setPin: boolean;
}

export function ScrollTrigger(
  elementOrSelector: HTMLElement | string,
  options: ScrollEventHandlerOptions
): () => void {
  const element = typeof elementOrSelector === 'string'
    ? document.querySelector(elementOrSelector) as HTMLElement | null
    : elementOrSelector as HTMLElement;

  if (!element) {
    throw new Error('Element not found');
  }

  const { startTrigger, endTrigger, unit, setPin, timeline, onStart, onScroll, onEnd } = options;

  let hasStarted = false;
  let hasEnded = false;
  let pinElement: HTMLElement | null = null;

  function getTriggerValue(trigger: number, unit: ScrollTriggerUnit): number {
    if (unit === 'percent') {
      return (trigger / 100) * document.documentElement.scrollHeight;
    }
    return trigger;
  }

  const startValue = getTriggerValue(startTrigger, unit);
  const endValue = getTriggerValue(endTrigger, unit);

  // Helper to linearly interpolate between two values
  function lerp(start: number, end: number, t: number): number {
    return start + t * (end - start);
  }

  // Helper to interpolate between two string values (e.g., "0px" to "100px")
  function interpolate(start: string, end: string, t: number): string {
    const startValue = parseFloat(start);
    const endValue = parseFloat(end);
    const unit = end.replace(/[0-9.]/g, '');
    const interpolatedValue = lerp(startValue, endValue, t);
    return `${interpolatedValue}${unit}`;
  }

  // Apply timeline-based interpolated styles
  function applyTimeline(scrollPosition: number) {
    if (timeline) {
      const t = (scrollPosition - startValue) / (endValue - startValue);
      Object.keys(timeline).forEach((property) => {
        const [startValue, endValue] = timeline[property];
        const interpolatedValue = typeof startValue === 'number'
          ? lerp(startValue, endValue as number, t)
          : interpolate(startValue as string, endValue as string, t);
        (element!.style as any)[property] = interpolatedValue;
      });
    }
  }

  function handleScroll() {
    const scrollPosition = window.scrollY;

    if (scrollPosition >= startValue && !hasStarted) {
      onStart?.();
      hasStarted = true;

      if (setPin) {
        pinElement = pinElement ?? document.createElement("div");
        const firstChild = element!.childNodes[0] as HTMLElement;
        const firstChildStyle = getComputedStyle(firstChild);
        const marginTop = parseFloat(firstChildStyle.marginTop);
        const marginBottom = parseFloat(firstChildStyle.marginBottom);
        pinElement!.style.height = `${element!.clientHeight + marginTop + marginBottom}px`;
        pinElement.style.width = `1px`;
        pinElement.classList.add("BahutDerKarDetaHoon");

        element!.style.top = `0px`;
        element!.style.position = "fixed";

        const parentElement = element!.parentElement;
        if (parentElement && !parentElement.contains(pinElement)) {
          parentElement.insertBefore(pinElement, element!.nextSibling);
        }
      }
    }

    if (scrollPosition >= startValue && scrollPosition <= endValue) {
      onScroll?.(scrollPosition);
      applyTimeline(scrollPosition); // Apply timeline during scroll
    }

    if (scrollPosition > endValue && !hasEnded) {
      onEnd?.();
      hasEnded = true;
    }

    if (scrollPosition < startValue) {
      hasStarted = false;

      if (setPin && pinElement) {
        if (pinElement.parentElement) {
          pinElement.parentElement.removeChild(pinElement);
        }
        element!.style.position = "relative";
        pinElement = null;
      }
    }

    if (scrollPosition <= endValue) {
      hasEnded = false;
    }
  }

  window.addEventListener('scroll', handleScroll);

  return () => {
    window.removeEventListener('scroll', handleScroll);
    if (pinElement && pinElement.parentElement) {
      pinElement.parentElement.removeChild(pinElement);
    }
    if (element) {
      element.style.position = "relative";
    }
  };
}
