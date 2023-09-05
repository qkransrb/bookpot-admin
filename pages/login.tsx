import Image from "next/image";
import { useRouter } from "next/router";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import api from "../lib/api";

const formSchema = z.object({
  username: z.string().nonempty({ message: "아이디를 입력해주세요" }),
  password: z.string().nonempty({ message: "비밀번호를 입력해주세요" }),
});

const Login = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await api.post("/auth/local", values);
      form.reset();
      router.push("/");
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <section className="w-[360px] min-h-[320px] bg-[#EEF2FE] rounded-[10px] p-8 flex flex-col items-center gap-y-10 shadow-lg">
        <div className="px-3">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={83}
            height={32}
            className="object-contain"
          />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <div className="mb-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="아이디를 입력해주세요"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mb-10">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="비밀번호를 입력해주세요"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#E06161] hover:bg-[#E06161]/80 transition-all w-full"
            >
              로그인
            </Button>
          </form>
        </Form>
      </section>
    </div>
  );
};

export default Login;
