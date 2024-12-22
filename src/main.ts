import { showUI, on } from "@create-figma-plugin/utilities";
import { CreatePagesHandler, SaveSettingsHandler } from "./types";

function saveSettings(
  pages: string,
  componentKey: string,
  coverPageName: string,
  isVariant: boolean
) {
  figma.clientStorage.setAsync("pages", pages);
  figma.clientStorage.setAsync("componentKey", componentKey);
  figma.clientStorage.setAsync("coverPageName", coverPageName);
  figma.clientStorage.setAsync("isVariant", isVariant);
}

async function loadSettings() {
  const pages = await figma.clientStorage.getAsync("pages");
  const componentKey = await figma.clientStorage.getAsync("componentKey");
  const coverPageName = await figma.clientStorage.getAsync("coverPageName");
  const isVariant = await figma.clientStorage.getAsync("isVariant");
  return { pages, componentKey, coverPageName, isVariant };
}

export default function () {
  // プラグインの初期化
  figma
    .loadFontAsync({ family: "Inter", style: "Regular" })
    .then(async () => {
      const { pages, componentKey, coverPageName, isVariant } =
        await loadSettings();
      showUI(
        {
          height: 400,
          width: 320,
        },
        { pages, componentKey, coverPageName, isVariant }
      );

      // イベントハンドラの設定
      on<SaveSettingsHandler>(
        "SAVE_SETTINGS",
        ({ pages, componentKey, coverPageName, isVariant }) => {
          saveSettings(pages, componentKey, coverPageName, isVariant);
        }
      );

      on<CreatePagesHandler>(
        "CREATE_PAGES",
        async function ({
          pageNames,
          componentKey,
          componentType,
          coverPageName,
        }) {
          saveSettings(
            pageNames.join("\n"),
            componentKey,
            coverPageName,
            componentType === "variant"
          );
          console.log("Starting page creation with:", {
            pageNames,
            componentKey,
            componentType,
            coverPageName,
          });

          // ページの作成処理
          for (const name of pageNames) {
            console.log("Creating page:", name);
            const page = figma.createPage();
            page.name = name;

            if (name === coverPageName) {
              console.log("Creating cover page setup");
              const frame = figma.createFrame();
              frame.name = "Cover";
              frame.resize(1920, 1080);
              page.appendChild(frame);

              let instance;
              if (componentType === "variant") {
                const componentSet = await figma.importComponentSetByKeyAsync(
                  componentKey
                );
                const component = componentSet.defaultVariant;
                instance = component.createInstance();
              } else {
                const component = await figma.importComponentByKeyAsync(
                  componentKey
                );
                instance = component.createInstance();
              }
              frame.appendChild(instance);
              await figma.setFileThumbnailNodeAsync(frame);
            }
          }
        }
      );
    })
    .catch((error) => {
      console.error("Failed to load font:", error);
      figma.closePlugin(`Failed to load font: ${error.message}`);
    });
}
