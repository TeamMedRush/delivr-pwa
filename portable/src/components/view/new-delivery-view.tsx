import { useCallback, useState } from "preact/hooks";

import { createDelivery } from "@api/delivery-actions";
import { PlusCircle } from "@attaditya/iconoir-preact";
import { Form } from "@components/kit/form";
import { Button } from "@components/ui/interactive/button";
import { Container } from "@components/ui/structure/container";
import { Heading } from "@components/ui/text/heading";
import { LoadingView } from "@components/view/loading-view";
import { useClasses } from "@styles";

export function NewDeliveryView() {
  const [loading, setLoading] = useState<boolean>(false);
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");

  const create = useCallback(async () => {
    setLoading(true);

    try {
      const { data } = await createDelivery(invoiceNumber);

      window.history.replaceState(
        {}, "", `/delivery/${(data as any).ride_uuid}`
      );

      window.location.href = `/delivery/${(data as any).ride_uuid}`;
    } catch (error) {
      console.error("Error creating delivery:", error);
      setLoading(false);
      return;
    }
  }, [invoiceNumber]);

  if (loading) {
    return <LoadingView />;
  }

  return (<>
    <Container className={useClasses('new-delivery-view')}>
      <Container className={useClasses("new-delivery-view-header")}>
        <Container className={useClasses("new-delivery-view-header-icon")}>
          <PlusCircle />
        </Container>

        <Heading size="max">
          New Ride
        </Heading>
      </Container>

      <Container className={useClasses("new-delivery-view-content")}>
        <Container className={useClasses("new-delivery-view-form")}>
          <Form
            fields={[
              {
                label: "Invoice Number",
                type: "text",
                updateValue: setInvoiceNumber,
              }
            ]}
          />
        </Container>

        <Container
          className={useClasses("new-delivery-view-filler")}
          children={null}
        />

        <Container className={useClasses("new-delivery-view-footer")}>
          <Button
            title="Create Delivery"
            icon="BicycleRegular"
            disabled={!invoiceNumber}
            onClick={create}
          />
        </Container>
      </Container>
    </Container>
  </>);
}

