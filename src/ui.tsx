import {
  Button,
  Container,
  Text,
  Textbox,
  TextboxMultiline,
  Checkbox,
  render,
  VerticalSpace,
} from "@create-figma-plugin/ui";
import { emit } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useCallback, useState } from "preact/hooks";
import { CreatePagesHandler, PluginProps } from "./types";

function Plugin({
  pages: initialPages,
  componentKey: initialComponentKey,
  coverPageName: initialCoverPageName,
  isVariant: initialIsVariant,
}: PluginProps) {
  const [pages, setPages] = useState<string>(initialPages || "");
  const [componentKey, setComponentKey] = useState<string>(
    initialComponentKey || ""
  );
  const [coverPageName, setCoverPageName] = useState<string>(
    initialCoverPageName || "Cover"
  );
  const [isVariant, setIsVariant] = useState<boolean>(initialIsVariant ?? true);
  const handlePagesChange = useCallback(
    (newValue: string) => {
      setPages(newValue);
      emit("SAVE_SETTINGS", {
        pages: newValue,
        componentKey,
        coverPageName,
        isVariant,
      });
    },
    [componentKey, coverPageName, isVariant]
  );

  const handleComponentKeyChange = useCallback(
    (newValue: string) => {
      setComponentKey(newValue);
      emit("SAVE_SETTINGS", {
        pages,
        componentKey: newValue,
        coverPageName,
        isVariant,
      });
    },
    [pages, coverPageName, isVariant]
  );

  const handleCoverPageNameChange = useCallback(
    (newValue: string) => {
      setCoverPageName(newValue);
      emit("SAVE_SETTINGS", {
        pages,
        componentKey,
        coverPageName: newValue,
        isVariant,
      });
    },
    [pages, componentKey, isVariant]
  );

  const handleIsVariantChange = useCallback(
    (event: h.JSX.TargetedEvent<HTMLInputElement>) => {
      const newValue = event.currentTarget.checked;
      setIsVariant(newValue);
      emit("SAVE_SETTINGS", {
        pages,
        componentKey,
        componentType: newValue ? "variant" : "standard",
        coverPageName,
        isVariant: newValue,
      });
    },
    [pages, componentKey, coverPageName]
  );

  const handleCreatePagesButtonClick = useCallback(() => {
    const pageNames = pages.split("\n").filter((name) => name.trim() !== "");
    console.log("Creating pages:", pageNames);
    emit<CreatePagesHandler>("CREATE_PAGES", {
      pageNames,
      componentKey,
      componentType: isVariant ? "variant" : "standard",
      coverPageName,
    });
  }, [pages, componentKey, isVariant, coverPageName]);

  return (
    <Container space="medium">
      <VerticalSpace space="large" />
      <Text>Pages</Text>
      <VerticalSpace space="small" />
      <TextboxMultiline
        rows={7}
        value={pages}
        onValueInput={handlePagesChange}
        variant="border"
        placeholder="Enter the page name(s). If there are multiple pages, please separate them with line breaks."
      />
      <VerticalSpace space="large" />
      <Text>Cover Page Name</Text>
      <VerticalSpace space="small" />
      <Textbox
        value={coverPageName}
        onValueInput={handleCoverPageNameChange}
        variant="border"
        placeholder="Enter cover page name"
      />
      <VerticalSpace space="large" />
      <Text>Cover Component Key</Text>
      <VerticalSpace space="small" />
      <Textbox
        value={componentKey}
        onValueInput={handleComponentKeyChange}
        variant="border"
        placeholder="Enter component key"
      />
      <VerticalSpace space="small" />
      <Checkbox value={isVariant} onChange={handleIsVariantChange}>
        <Text>Use Variant</Text>
      </Checkbox>
      <VerticalSpace space="large" />
      <Button fullWidth onClick={handleCreatePagesButtonClick}>
        Create Pages
      </Button>
      <VerticalSpace space="small" />
    </Container>
  );
}

export default render(Plugin);
