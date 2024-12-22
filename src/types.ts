import { EventHandler } from "@create-figma-plugin/utilities";

export interface Settings {
  pages: string;
  componentKey: string;
  coverPageName: string;
  isVariant: boolean;
}

export interface CreatePagesHandler extends EventHandler {
  name: "CREATE_PAGES";
  handler: (options: {
    pageNames: string[];
    componentKey: string;
    componentType: string;
    coverPageName: string;
  }) => void;
}

export interface SaveSettingsHandler extends EventHandler {
  name: "SAVE_SETTINGS";
  handler: (settings: Settings) => void;
}

export interface LoadSettingsHandler extends EventHandler {
  name: "LOAD_SETTINGS";
  handler: () => void;
}

export interface SettingsUpdatedHandler extends EventHandler {
  name: "SETTINGS_UPDATED";
  handler: (settings: Settings) => void;
}

export interface PluginProps {
  pages: string;
  componentKey: string;
  coverPageName: string;
  isVariant: boolean;
}
