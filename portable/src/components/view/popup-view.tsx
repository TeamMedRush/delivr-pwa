import { Button } from "@components/ui/interactive/button";
import { Container } from "@components/ui/structure/container";
import { usePopup } from "@contexts/popup";
import { useClasses } from "@styles";

export function PopupView() {
  const { active, currentEvent } = usePopup();

  return (
    <Container className={useClasses(
      "popup",
      active && "active",
      currentEvent?.data.type === "error" && "error",
      currentEvent?.data.type === "success" && "success",
      currentEvent?.data.type === "info" && "info",
    )}>
      <Container
        className={useClasses("popup-background")}
        children={null}
      />

      <Container className={useClasses("popup-box")}>
        <Container className={useClasses("popup-title")}>
          {currentEvent?.data.title || currentEvent?.data.type}
        </Container>

        <Container className={useClasses("popup-content")}>
          {currentEvent?.data.message}
        </Container>

        <Container className={useClasses("popup-actions")}>
          <Button
            icon={{
              "info": "CheckRegular",
              "success": "CheckRegular",
              "error": "WarningCircleRegular",
            }[currentEvent?.data.type || "info"] as any}

            title="Acknowledge"
            onClick={() => currentEvent?.resolve()}
            disabled={!active}
          />
        </Container>
      </Container>
    </Container>
  );
}

