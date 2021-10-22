export const PROCESS_STATUS = {
  NOT_STARTED: 0,
  IN_PROCESS: 1,
  COMPLETED: 2,
  APPROVED: 3
};

export const PROCESS_STATUS_OPTIONS = [
  {
    name: 'Not Started',
    value: PROCESS_STATUS.NOT_STARTED
  },
  {
    name: 'In Process',
    value: PROCESS_STATUS.IN_PROCESS
  },
  {
    name: 'Completed',
    value: PROCESS_STATUS.COMPLETED
  },
  {
    name: 'Approved',
    value: PROCESS_STATUS.APPROVED
  }
];
