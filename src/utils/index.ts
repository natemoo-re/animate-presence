export const nextTick = /*@__PURE__*/(cb: () => void) => Promise.resolve().then(cb);

export const presence = (
  element: HTMLElement,
  hooks: { afterSelf?: () => void } = {},
) => {
    const { afterSelf } = hooks;
    return new Promise(async resolve => {
      const {
        animationName,
        animationDuration,
        transitionDuration
      } = window.getComputedStyle(element);

      if (animationName !== "none" && animationDuration !== "0s") {
        listen("animation");
      } else if (transitionDuration !== "0s") {
        listen("transition");
      } else {
        afterSelf?.();
        resolve();
      }

      function listen(name: string) {
        element.addEventListener(`${name}end`, onEnd(name));
      }

      function onEnd(name: string) {
        return function(event: Event) {
          if (event.target !== element) return;
          element.removeEventListener(`${name}end`, this);
          afterSelf?.();
          resolve();
          return;
        };
      }
    });

}

const kebab = (str: string) => str.replace(/([A-Z])/g, `-$1`).toLowerCase();

type Primitive = string | number | boolean | null | undefined;

export const setCustomProperties = (
  el: HTMLElement,
  props?: Record<string | number, Primitive>
) => {
  const customProps = convertToCustomProperties(props);
  for (const [key, value] of Object.entries(customProps)) {
    el.style.setProperty(key, value);
  }
};

const convertToCustomProperties = (
  o: Primitive | Record<string|number, Primitive>,
  prefix = "--",
  result: any = {},
): Record<string, string> => {
  if (o == null) return result;

  switch (typeof o) {
    case "string": {
      result[kebab(prefix)] = o;
      return result;
    }
    case "number": {
      result[kebab(prefix)] = o.toString(10);
      return result;
    }
    case "boolean": {
      result[kebab(prefix)] = o ? `1` : `0`;
      return result;
    }
    default:
      break;
  }

  if (Array.isArray(o) || typeof o === "object") {
    for (let [key, value] of Object.entries(o)) {
      const name = [
        prefix,
        !prefix.endsWith("-") && '-',
        key
      ]
        .filter(Boolean)
        .join("");
      convertToCustomProperties(value, name, result);
    }
    return result;
  }
  return result;
}

export const isHTMLElement = (node: Node): node is HTMLElement =>
  node &&
  node.nodeType === node.ELEMENT_NODE &&
  typeof (node as HTMLElement).tagName !== "undefined";

export const hasData = (el: HTMLElement, key: string) => typeof el.dataset[key] !== "undefined";

export function closest(selector: string, base = this) {
  try {
      function closestFrom(el: Node|Window) {
          if (!el || el === document || el === window) return null;
          let found = (el as HTMLElement).closest(selector);
          return found ? found : closestFrom(((el as HTMLElement).getRootNode() as any).host);
      }

      return closestFrom(base);
  } catch (e) {
    return null;
  }
}

export const getTopLevelChildren = (el: HTMLElement): HTMLAnimatePresenceElement[] => {
  const all = Array.from(el.querySelectorAll("animate-presence"));
  const nested = Array.from(
    el.querySelectorAll(":scope animate-presence animate-presence")
  );
  return all.filter(el => !nested.includes(el));
}

export const exitChildren = async (el: HTMLElement) => {
  return Promise.all(
    getTopLevelChildren(el).map((el: HTMLAnimatePresenceElement) => el.exit())
  );
};

export const enterChildren = async (el: HTMLElement) => {
  return Promise.all(
    getTopLevelChildren(el).map((el: HTMLAnimatePresenceElement) => el.enter())
  );
};