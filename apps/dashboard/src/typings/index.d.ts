import { defaultNS, resources } from "~/i18n";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: {
      translation: (typeof resources)["zh-Hans"][typeof defaultNS];
    };
  }
}
