import AccordionController from "@/components/shared/accordion/AccordionController";

import MobileLink from "./MobileLink";
import Accordion from "@/components/shared/accordion/Accordion";
import AccordionContent from "@/components/shared/accordion/AccordionContent";
const MobileMenuItem = ({ item }) => {
  const { name, path, children, accordion } = item;

  return !accordion ? (
    <div className="mb-1"> 
      <MobileLink item={{ name, path }} />
    </div>
  ) : (
    <Accordion>
      <AccordionController type={"primary"}>
        <MobileLink item={{ name, path }} />
      </AccordionController>
      <AccordionContent>{children && children}</AccordionContent>
    </Accordion>
  );
};

export default MobileMenuItem;
