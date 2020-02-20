export const nextTick = /*@__PURE__*/(cb: () => void) => Promise.resolve().then(cb);

export const presence = (
  element: HTMLElement,
  { afterChildren: _, afterSelf }: { afterChildren?: () => void; afterSelf?: () => void }
) =>
  new Promise(async resolve => {
    // const children = Array.from(
    //   element.querySelectorAll("animate-presence")
    // );
    
    // await Promise.all(
    //   children.map(
    //     el =>
    //       new Promise(resolve => {
    //         el.addEventListener("exitComplete", resolve);
    //       })
    //   )
    // );
    
    // afterChildren && afterChildren();

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
      afterSelf && afterSelf();
      resolve();
    }

    function listen(name: string) {
      element.addEventListener(`${name}end`, onEnd(name));
    }

    function onEnd(name: string) {
      return function() {
        element.removeEventListener(`${name}end`, this);
        afterSelf && afterSelf();
        resolve();
        return;
      };
    }
  });
