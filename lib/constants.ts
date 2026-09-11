export const COMPANY_NAME = 'Aurora Labs'

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const SITE_URL = new URL(configuredSiteUrl).origin
