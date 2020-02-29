export interface PresenceDetail {
  i: number;
}

export type PresenceHandler = (
  el: HTMLElement,
  detail: PresenceDetail
) => Promise<Animation | void>;

export const createPresenceHandler = (cb: PresenceHandler) => ({
  detail: { hold, ...detail },
}) => hold((el: HTMLElement) => cb(el, detail as PresenceDetail));
