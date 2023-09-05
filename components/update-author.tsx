import Image from "next/image";
import { useRouter } from "next/router";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";

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
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Author } from "../types";
import api from "../lib/api";

interface UpdateAuthorProps {
  author: Author;
}

const formSchema = z.object({
  thumbnail: z.string().nonempty({ message: "이미지를 업로드 해주세요" }),
  name: z.string().nonempty({ message: "성함을 입력해주세요" }),
  email: z
    .string()
    .email({ message: "이메일을 입력해주세요" })
    .nonempty({ message: "이메일을 입력해주세요" }),
  bio: z.string().nonempty({ message: "소개를 입력해주세요" }),
});

const UpdateAuthor: React.FC<UpdateAuthorProps> = ({ author }) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      thumbnail: author.thumbnailUrl || "",
      name: author.name || "",
      email: author.email || "",
      bio: author.description || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const data = {
      name: values.name,
      email: values.email,
      description: values.bio,
    };

    try {
      await api.put(`/api/v1/authors/${author.id}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
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
            작가 수정
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* 썸네일 */}
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem className="relative flex flex-col">
                  <FormLabel className="text-main-dark font-bold">
                    썸네일 *
                  </FormLabel>
                  <FormMessage />
                  <div className="w-full h-[120px] bg-[#DFE9FA] inset-0 top-6 rounded-sm -z-10 overflow-hidden flex justify-center items-center">
                    <Image
                      src={field.value}
                      alt="Thumbnail"
                      width={120}
                      height={120}
                      priority
                      className="rounded-sm object-contain"
                    />
                  </div>
                </FormItem>
              )}
            />

            {/* 이름 */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-main-dark font-bold">
                    성함 *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="성함을 입력해주세요"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 이메일 */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-main-dark font-bold">
                    이메일 *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="이메일을 입력해주세요"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 소개 */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-main-dark font-bold">
                    소개 *
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={10}
                      placeholder="소개를 입력해주세요"
                      className="resize-none"
                      {...field}
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

export default UpdateAuthor;
