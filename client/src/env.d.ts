/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
    PUBLIC_API_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
