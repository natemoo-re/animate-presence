import Flipping from 'flipping';

const f = new Flipping();

export function getBounds(el: HTMLElement) {
  return f.getBounds(el);
}

export function getDelta(first: any, last: any) {
  return f.getDelta(first, last);
}
// let defaultStyles: Record<string, string>;

// const blocklist = ['font', 'background', 'animation', 'border-radius', 'border'];

// const isUsefulStyleDeclaration = (key: string) => {
//     return (
//       Number.isNaN(Number(key)) &&
//       !blocklist.includes(key) &&
//       !key.startsWith('webkit') &&
//       !key.endsWith('Origin')
//     );
// }

// export type StyleRecord = Record<string, string|number>;

// export function getStyle(el: HTMLElement): any {
//     if (typeof window === 'undefined') return;

//     Flipping.rect(el);

//     if (!defaultStyles) {
//         defaultStyles = {};
//         const dummyNode = document.createElement(
//           `element-${new Date().valueOf()}`
//         );
//         document.body.appendChild(dummyNode);
//         const tmpStyles = window.getComputedStyle(dummyNode);
//         for (const key in tmpStyles) {
//             if (tmpStyles.hasOwnProperty(key) && isUsefulStyleDeclaration(key)) {
//               defaultStyles[key] = tmpStyles[key];
//             }
//         }
//         dummyNode.remove();
//     }

//     const matrixRegex = /matrix\(.*, .*, .*, .*, (.*), (.*)\)/;

//     const computedStyle = window.getComputedStyle(el);
//     const t = computedStyle.transform.match(matrixRegex);

//     if (t) {
//       let tx = Number.parseFloat(t[1]);
//       let ty = Number.parseFloat(t[2]);
//     }

//     const { width, height, top, left } = el.getBoundingClientRect();
//     let cleanStyle: StyleRecord = {
//       width: width,
//       height: height,
//       tx: tx ?? 0,
//       ty: ty ?? 0,
//       x: left + (width / 2),
//       y: top + (height / 2),
//     };

//     // for (const [key, defaultValue] of Object.entries(defaultStyles)) {
//     //     const computedValue = computedStyle[key];
//     //     if (defaultValue !== computedValue) {
//     //         cleanStyle[key] = computedValue;
//     //     }
//     // }

//     return cleanStyle;
// }

// export function diffStyles(
//          a: StyleRecord,
//          b: StyleRecord
//        ): Record<
//          string,
//          { value: StyleRecord[string]; previous: StyleRecord[string] }
//        > {
//          let diff = {};
//          if (!b) b = {};

//          for (const [key, value] of Object.entries(a)) {
//            const previous = b[key] ?? null;
//            if (value && previous && value !== previous) {
//              diff[key] = { value, previous };
//            }
//          }

//          return diff;
//        }
