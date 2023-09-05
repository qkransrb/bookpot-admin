import { useRef, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Check, ChevronDownIcon, FormInput } from "lucide-react";
import { toast } from "react-hot-toast";

import useAddBookFormStep from "../hooks/useAddBookFormStep";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Author } from "../types";
import { cn } from "../lib/utils";
import api from "../lib/api";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface AddBookStep1FormProps extends PopoverTriggerProps {
  authors: Author[];
}

const formSchema = z.object({
  title: z.string().nonempty({ message: "제목을 입력해주세요" }),
  intro: z.string().nonempty({ message: "설명을 입력해주세요" }),
  price: z.string().nonempty({ message: "가격을 입력해주세요" }),
  authorId: z.string().nonempty({ message: "작가를 선택해주세요" }),
  isPublish: z.boolean().readonly(),
});

const AddBookStep1Form: React.FC<AddBookStep1FormProps> = ({ authors }) => {
  const [searchAuthorsOpen, setSearchAuthorsOpen] = useState<boolean>(false);
  const [selectedAuthor, setSelectedAuthor] = useState({
    label: "작가를 선택해주세요",
    value: 0,
  });

  const hiddenInputRef = useRef(null);

  const { onNext, onReset } = useAddBookFormStep();

  const formattedAuthors = authors.map((author) => ({
    label: author.name,
    value: author.id,
  }));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      intro: "",
      price: "",
      authorId: "",
      isPublish: true,
    },
  });

  const handleOnSelect = (author: { label: string; value: number }) => {
    setSelectedAuthor({
      label: author.label,
      value: author.value,
    });

    setSearchAuthorsOpen(false);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const data = {
        title: values.title,
        intro: values.intro,
        price: Number(values.price),
        authorId: Number(values.authorId),
        isPublish: values.isPublish,
      };

      const response = await api.post("/api/v1/ebooks", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      onNext(response.data.id);
    } catch (error) {
      toast.error("😭 등록이 실패했습니다. 다시 시도해주세요.");
      form.setValue("authorId", "");
      setSelectedAuthor({
        label: "작가를 선택해주세요",
        value: 0,
      });
      onReset();
    } finally {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-main-dark font-bold">제목 *</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="제목을 입력해주세요"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="intro"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-main-dark font-bold">설명 *</FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  placeholder="설명을 입력해주세요"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-main-dark font-bold">가격 *</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="가격을 입력해주세요"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="authorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-main-dark font-bold">작가 *</FormLabel>
              <Popover
                open={searchAuthorsOpen}
                onOpenChange={setSearchAuthorsOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    role="combobox"
                    aria-expanded={searchAuthorsOpen}
                    aria-label="작가를 선택해주세요"
                    className="w-full flex items-center justify-between"
                  >
                    <span>{selectedAuthor.label}</span>
                    <ChevronDownIcon className="h-4 w-4 shrink-0" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start">
                  <Command>
                    <CommandList>
                      <CommandInput placeholder="작가 이름으로 검색" />
                      <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                      <CommandGroup heading="Authors">
                        {formattedAuthors.map((author) => (
                          <CommandItem
                            key={author.value}
                            onSelect={() => {
                              handleOnSelect({
                                label: author.label,
                                value: author.value,
                              });
                              form.setValue(
                                "authorId",
                                author.value.toString()
                              );
                            }}
                            className="cursor-pointer"
                          >
                            {author.label}
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                author.value === selectedAuthor.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormInput className="hidden" {...field} ref={hiddenInputRef} />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="default" className="w-full">
          다음
        </Button>
      </form>
    </Form>
  );
};

export default AddBookStep1Form;
