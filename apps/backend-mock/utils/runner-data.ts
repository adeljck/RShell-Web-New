export interface RunnerRecord {
  id: number;
  name: string;
}

const RUNNER_LIST: RunnerRecord[] = [
  { id: 0, name: 'AddUser.dll' },
  { id: 1, name: 'fscan.x64.elf' },
  { id: 2, name: 'gost.x64.exe' },
  { id: 3, name: 'gost.x64.so' },
  { id: 4, name: 'mimikatz.x64.exe' },
];

let nextRunnerId = RUNNER_LIST.length;

export function listRunnerRecords() {
  return [...RUNNER_LIST];
}

export function addRunnerRecord(name: string) {
  const existed = RUNNER_LIST.find((item) => item.name === name);
  if (existed) {
    return existed;
  }

  const record: RunnerRecord = {
    id: nextRunnerId++,
    name,
  };
  RUNNER_LIST.push(record);
  return record;
}
