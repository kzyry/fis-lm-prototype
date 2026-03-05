export interface EmbedParams {
  embed: boolean;
  tab: string | null;
  scenario: string | null;
  chromeless: boolean;
  hideHeader: boolean;
  hideTabBar: boolean;
  hideActions: boolean;
}

export function parseEmbedParams(): EmbedParams {
  const params = new URLSearchParams(window.location.search);

  const embed = params.get('embed') === '1';
  const chromeless = params.get('chromeless') === '1';

  return {
    embed,
    tab: params.get('tab'),
    scenario: params.get('scenario'),
    chromeless,
    hideHeader: chromeless || params.get('hideHeader') === '1',
    hideTabBar: chromeless || params.get('hideTabBar') === '1',
    hideActions: chromeless || params.get('hideActions') === '1',
  };
}
