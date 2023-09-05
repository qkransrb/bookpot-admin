import { useRef } from "react";

import { Author } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import useAddBookFormStep from "../hooks/useAddBookFormStep";
import AddBookStep1Form from "./add-book-step1-form";
import AddBookStep2Form from "./add-book-step2-form";

interface Props {
  authors: Author[];
}

const AddBook: React.FC<Props> = ({ authors }) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { step } = useAddBookFormStep();

  return (
    <Dialog>
      <DialogTrigger asChild ref={triggerRef}>
        <Button variant="default" size="lg">
          전자책 추가
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-5">
          <DialogTitle className="text-main-dark font-bold">
            {`전자책 등록 ${step}/2`}
          </DialogTitle>
        </DialogHeader>
        {step === 1 && <AddBookStep1Form authors={authors} />}
        {step === 2 && <AddBookStep2Form triggerRef={triggerRef} />}
      </DialogContent>
    </Dialog>
  );
};

export default AddBook;
