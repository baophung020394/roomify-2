import puter from '@heyputer/puter.js';

import { createHostingSlug, HOSTING_CONFIG_KEY } from './utils';

type HostingConfig = { subdomain: string };
type HostedAsset = { url: string }

export const getOrCreateHostingConfig = async (): Promise<HostingConfig | null> => {
    const existing = (await puter.kv.get(HOSTING_CONFIG_KEY)) as HostingConfig | null;

    if (existing?.subdomain) return { subdomain: existing.subdomain }

    const subdomain = createHostingSlug();

    try {
        const created = await puter.hosting.create(subdomain, ".");
        return { subdomain: created.subdomain }
    } catch (e) {
        console.warn(`Can not find subdomain`, e)
        return null;
    }
}

export const uploadImagetoHosting = async ({hosting, url, projectId, label}: StoreHostedImageParams): Promise<HostedAsset | null> => {
    
}