import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import useAddBookFormStep from "../hooks/useAddBookFormStep";
import api from "../lib/api";

const formSchema = z.object({
  thumbnail: z.string().nonempty({ message: "썸네일 이미지를 등록해주세요." }),
  description: z.string().nonempty({ message: "소개 이미지를 등록해주세요." }),
  preview: z.string().nonempty({ message: "체험판 파일을 등록해주세요." }),
  pdf: z.string().nonempty({ message: "전자책 PDF 파일을 등록해주세요." }),
});

const AddBookStep2Form = ({
  triggerRef,
}: {
  triggerRef: React.RefObject<HTMLButtonElement>;
}) => {
  const router = useRouter();
  const { ebookId, onReset } = useAddBookFormStep();

  const [thumbnail, setThumbnail] = useState<File>();
  const [description, setDescription] = useState<File>();
  const [preview, setPreview] = useState<File>();
  const [pdf, setPdf] = useState<File>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      thumbnail: "",
      description: "",
      preview: "",
      pdf: "",
    },
  });

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

  const onSubmit = async (_values: z.infer<typeof formSchema>) => {
    // 썸네일
    const thumbnailFormData = new FormData();
    thumbnailFormData.append("contentType", thumbnail!.type);
    thumbnailFormData.append("filename", thumbnail!.name);
    thumbnailFormData.append("file", thumbnail!);

    // 소개
    const descriptionFormData = new FormData();
    descriptionFormData.append("contentType", description!.type);
    descriptionFormData.append("filename", description!.name);
    descriptionFormData.append("file", description!);

    // 체험판
    const previewFormData = new FormData();
    previewFormData.append("contentType", preview!.type);
    previewFormData.append("filename", preview!.name);
    previewFormData.append("file", preview!);

    // 전자책 PDF
    const pdfFormData = new FormData();
    pdfFormData.append("contentType", pdf!.type);
    pdfFormData.append("filename", pdf!.name);
    pdfFormData.append("file", pdf!);

    try {
      await Promise.all([
        api.put(`/api/v1/ebooks/${ebookId}/thumbnail`, thumbnailFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
        api.put(`/api/v1/ebooks/${ebookId}/description`, descriptionFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
        api.put(`/api/v1/ebooks/${ebookId}/preview`, previewFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
        api.put(`/api/v1/ebooks/${ebookId}/pdf`, pdfFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
      ]);
      onReset();
      toast.success("🥳 등록이 완료됐습니다!");
    } catch (error) {
      console.log(error);
      toast.error("😭 등록이 실패했습니다. 다시 시도해주세요.");
    } finally {
      form.reset();
      triggerRef.current?.click();
      router.reload();
      window.location.reload();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

        {/* 소개 */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="relative flex flex-col">
              <FormLabel className="text-main-dark font-bold">소개 *</FormLabel>
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

        <Button type="submit" variant="default" className="w-full">
          전자책 등록하기
        </Button>
      </form>
    </Form>
  );
};

export default AddBookStep2Form;
