import type { ClientListRecord } from '#/api';

export function formatClientDisplayLabel(item: Pick<ClientListRecord, 'Addr' | 'Id' | 'Location' | 'OsName'>) {
  return `ID: ${item.Id} IP: ${item.Addr} Location: ${item.Location} OS: ${item.OsName}`;
}

export function decorateSelectOptionTitles(popperClass: string) {
  requestAnimationFrame(() => {
    document
      .querySelectorAll(`${popperClass} .el-select-dropdown__item`)
      .forEach((item) => {
        const text = item.textContent?.trim() ?? '';
        if (text) {
          item.setAttribute('title', text);
        }
      });
  });
}

export function buildOnlineClientOptions(
  items: ClientListRecord[],
  selectedClientId?: number | null,
) {
  return items.filter((item) => item.IsConnect || item.Id === selectedClientId);
}
