export const carStates = {
  IN_GARAGE: 'in garage',
  STARTING: 'starting',
  MOVING: 'moving',
  BROKEN: 'broken',
  FINISHED: 'finished',
  STOPPED: 'resetting',
} as const;

export type CarStatesValues = (typeof carStates)[keyof typeof carStates];
