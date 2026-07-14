// AUTO GENERATED FILE - DO NOT EDIT

const assetData = {
  'logo.png': '/assets/logo.png',
  'parallax-d.svg': '/assets/parallax-d.svg',
  'parallax-l.svg': '/assets/parallax-l.svg'
} as const;

export type AssetName = (keyof typeof assetData);

export function useAsset(assetName: AssetName): string {
  return assetData[assetName];
}

