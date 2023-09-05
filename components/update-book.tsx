import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";
import { Check, ChevronDownIcon, FormInput } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
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
import { Author, Ebook } from "../types";
import { cn } from "../lib/utils";
import api from "../lib/api";

interface Props {
  authors: Author[];
  ebook: Ebook;
}

const formSchema = z.object({
  title: z.string().nonempty(),
  price: z.string().nonempty(),
  intro: z.string().nonempty(),
  authorId: z.string().nonempty(),
  thumbnail: z.string().nonempty(),
  description: z.string().nonempty(),
  preview: z.string().nonempty(),
  pdf: z.string().nonempty(),
});

const UpdateBook = ({ authors, ebook }: Props) => {
  const [searchAuthorsOpen, setSearchAuthorsOpen] = useState<boolean>(false);
  const [selectedAuthor, setSelectedAuthor] = useState({
    label: "작가를 선택해주세요",
    value: 0,
  });

  const [thumbnail, setThumbnail] = useState<File | undefined>(undefined);
  const [description, setDescription] = useState<File | undefined>(undefined);
  const [preview, setPreview] = useState<File | undefined>(undefined);
  const [pdf, setPdf] = useState<File | undefined>(undefined);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const hiddenInputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (ebook) {
      setSelectedAuthor((prev) => {
        return {
          ...prev,
          label: ebook.author.name,
          value: ebook.author.id,
        };
      });
    }
  }, [ebook]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: ebook.title || "",
      price: ebook.price.toString() || "",
      intro: ebook.intro || "",
      authorId: ebook.authorId.toString() || "",
      thumbnail: ebook.thumbnailUrl || "",
      description: ebook.descriptionUrl || "",
      preview: ebook.previewUrl || "",
      pdf: ebook.pdfUrl || "",
    },
  });

  const formattedAuthors = authors.map((author) => ({
    label: author.name,
    value: author.id,
  }));

  const handleImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const name = e.target.name;

      if (name === "thumbnail") {
        setThumbnail(file);
      } else if (name === "description") {
        setDescription(file);
      } else {
        return;
      }

      if (!file.type.includes("image")) {
        return;
      }

      fileReader.onload = async (event) => {
        const imageDataURL = event.target?.result?.toString() || "";
        fieldChange(imageDataURL);
      };

      fileReader.readAsDataURL(file);
    }
  };

  const handleFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const name = e.target.name;

      if (name === "preview") {
        setPreview(file);
      } else if (name === "pdf") {
        setPdf(file);
      } else {
        return;
      }

      fileReader.onload = async (event) => {
        const imageDataURL = event.target?.result?.toString() || "";
        fieldChange(imageDataURL);
      };

      fileReader.readAsDataURL(file);
    }
  };

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
        isPublish: true,
      };

      await api.put(`/api/v1/ebooks/${ebook.id}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // 썸네일
      if (thumbnail) {
        const thumbnailFormData = new FormData();
        thumbnailFormData.append("contentType", thumbnail!.type);
        thumbnailFormData.append("filename", thumbnail!.name);
        thumbnailFormData.append("file", thumbnail!);

        await api.put(
          `/api/v1/ebooks/${ebook.id}/thumbnail`,
          thumbnailFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      // 소개
      if (description) {
        const descriptionFormData = new FormData();
        descriptionFormData.append("contentType", description!.type);
        descriptionFormData.append("filename", description!.name);
        descriptionFormData.append("file", description!);

        await api.put(
          `/api/v1/ebooks/${ebook.id}/description`,
          descriptionFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      // 체험판
      if (preview) {
        const previewFormData = new FormData();
        previewFormData.append("contentType", preview!.type);
        previewFormData.append("filename", preview!.name);
        previewFormData.append("file", preview!);

        await api.put(`/api/v1/ebooks/${ebook.id}/preview`, previewFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // 전자책 PDF
      if (pdf) {
        const pdfFormData = new FormData();
        pdfFormData.append("contentType", pdf!.type);
        pdfFormData.append("filename", pdf!.name);
        pdfFormData.append("file", pdf!);

        await api.put(`/api/v1/ebooks/${ebook.id}/pdf`, pdfFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      toast.success("🥳 수정이 완료됐습니다!");
    } catch (error) {
      console.log(error);
      toast.error("😭 수정이 실패했습니다. 다시 시도해주세요.");
    } finally {
      form.reset();
      triggerRef.current?.click();
      router.reload();
      window.location.reload();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild ref={triggerRef}>
        <Button
          variant="default"
          size="sm"
          onClick={() => {}}
          className="w-[74px]"
        >
          수정
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-5">
          <DialogTitle className="text-main-dark font-bold">
            전자책 수정
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 max-h-[80vh] overflow-auto scrollbar-hide"
          >
            {/* 썸네일 */}
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem className="relative flex flex-col">
                  <FormLabel className="text-main-dark font-bold">
                    썸네일 *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      name="thumbnail"
                      accept="image/*"
                      placeholder="이미지 업로드"
                      className="opacity-0 h-[120px]"
                      onChange={(e) => handleImage(e, field.onChange)}
                    />
                  </FormControl>
                  <FormMessage />
                  {field.value ? (
                    <div className="w-full h-[120px] bg-[#DFE9FA] absolute inset-0 top-6 rounded-sm -z-10 overflow-hidden flex justify-center items-center">
                      <Image
                        src={field.value}
                        alt="Thumbnail"
                        width={120}
                        height={120}
                        priority
                        className="rounded-sm object-contain"
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 top-6 bg-[#DFE9FA] h-[120px] rounded-sm -z-10 flex items-center justify-center">
                      <p className="text-sm font-normal text-main-dark">
                        이미지 업로드
                      </p>
                    </div>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-main-dark font-bold">
                    제목 *
                  </FormLabel>
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
              name="description"
              render={({ field }) => (
                <FormItem className="relative flex flex-col">
                  <FormLabel className="text-main-dark font-bold">
                    소개 *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      name="description"
                      accept="image/*"
                      placeholder="이미지 업로드"
                      className="opacity-0 h-[120px]"
                      onChange={(e) => handleImage(e, field.onChange)}
                    />
                  </FormControl>
                  <FormMessage />
                  {field.value ? (
                    <div className="w-full h-[120px] bg-[#DFE9FA] absolute inset-0 top-6 rounded-sm -z-10 overflow-hidden flex justify-center items-center">
                      <Image
                        src={field.value}
                        alt="Description"
                        width={120}
                        height={120}
                        priority
                        className="rounded-sm object-contain"
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 top-6 bg-[#DFE9FA] h-[120px] rounded-sm -z-10 flex items-center justify-center">
                      <p className="text-sm font-normal text-main-dark">
                        이미지 업로드
                      </p>
                    </div>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="intro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-main-dark font-bold">
                    설명 *
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={8}
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
                  <FormLabel className="text-main-dark font-bold">
                    가격 *
                  </FormLabel>
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
                  <FormLabel className="text-main-dark font-bold">
                    작가 *
                  </FormLabel>
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
                  <FormInput
                    className="hidden"
                    {...field}
                    ref={hiddenInputRef}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 체험판 */}
            <FormField
              control={form.control}
              name="preview"
              render={({ field }) => (
                <FormItem className="relative flex flex-col">
                  <FormLabel className="text-main-dark font-bold">
                    체험판 *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      name="preview"
                      accept=".pdf"
                      onChange={(e) => handleFile(e, field.onChange)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 전자책 PDF */}
            <FormField
              control={form.control}
              name="pdf"
              render={({ field }) => (
                <FormItem className="relative flex flex-col">
                  <FormLabel className="text-main-dark font-bold">
                    전자책 PDF *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      name="pdf"
                      accept=".pdf"
                      onChange={(e) => handleFile(e, field.onChange)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="default"
              className="w-full bg-main-dark"
            >
              작가 수정하기
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateBook;
