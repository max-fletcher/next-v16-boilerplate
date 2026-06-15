"use client";
// import CustomInput from '@/components/CustomInput'
// import { Button } from '@/components/ui/button'
// import { Form } from '@/components/ui/form'
import { TAuthType } from "@/constants/enums";
// import { authFormSchema } from '@/lib/schema/authForm.schema'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { Loader2 } from 'lucide-react'
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
// import { useForm } from 'react-hook-form'
import { z } from "zod";

const AuthForm = ({ type }: { type: TAuthType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { status } = useSession();

  // Redirect logged-in users away from this page
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  // const formSchema = authFormSchema(type)

  // 1. Define your form.
  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     email: "",
  //     password: "",
  //   },
  // })

  // 2. Define a submit handler.
  const onSubmit = async (data: unknown) => {
    // z.infer<typeof formSchema>
    setError(null);
    setIsLoading(true);
    try {
      // Sign up or sign in using next-auth's signIn function
      let res;
      // if (type === TAuthType.SIGN_UP) {
      //   res = await signIn("credentials", {
      //     redirect: false,
      //     name: data.name,
      //     email: data.email,
      //     password: data.password,
      //     type: TAuthType.SIGN_UP,
      //     callbackUrl: "/dashboard",
      //   });
      // }

      // NOTE: else condition here throws type error in response(An expression of type 'void' cannot be tested for truthiness) so we are using an if statement.
      // if (type === TAuthType.SIGN_IN) {
      //   res = await signIn("credentials", {
      //     redirect: false,
      //     email: data.email,
      //     password: data.password,
      //     type: TAuthType.SIGN_IN,
      //     callbackUrl: "/dashboard",
      //   });
      // }

      // Navigate to homepage if logged in
      // if (res?.ok) router.push(res?.url || "/dashboard");
      // else throw new Error(res?.error || "Invalid credentials");
    } catch (error: any) {
      // console.log('onSubmit error', error)
      setError(
        error.message?.replace(/^Error:\s*/, "") || "Something went wrong",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mt-[200px]">
      <header className="flex flex-col gap-5 md:gap-8">
        <div className="flex flex-col gap-1 md:gap-3">
          {/* <h1>
            {type === TAuthType.SIGN_IN ? "Sign In" : "Sign Up"}
            <p className="text-16 font-normal text-gray-600">
              {type === TAuthType.SIGN_IN
                ? "Sign in to get started"
                : "Please enter your details"}
            </p>
            <p className="text-16 font-normal text-red-600">
              {error ? error : ""}
            </p>
          </h1> */}
        </div>
      </header>

      {/* <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4">
          {type === TAuthType.SIGN_UP && (
            <>
              <CustomInput
                control={form.control}
                name="name"
                label="Name"
                placeholder="Enter your name"
                type="text"
              />
            </>
          )}
          <CustomInput
            control={form.control}
            name="email"
            label="Email"
            placeholder="Enter your email"
            type="text"
          />
          <CustomInput
            control={form.control}
            name="password"
            label="Password"
            placeholder="Enter your password"
            type="password"
          />

          <div className="flex flex-col gap-4">
            <Button type="submit" className="form-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  // Spinner/loader component. Comes from lucide-react. Got installed when we installed the sheet component from shadcn.
                  <Loader2 size={20} className="animate-spin mr-2" />
                  Loading...
                </>
              ) : type === TAuthType.SIGN_IN ? (
                "Sign In"
              ) : (
                "Sign Up"
              )}
            </Button>

            <Button
              type="button"
              className="form-btn"
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            >
              Sign in with GitHub
            </Button>
          </div>
        </form>
      </Form> */}

      <section>
        {/* <footer className="flex justify-center gap-1">
          <p className="text-14 font-normal text-gray-600">
            {type === TAuthType.SIGN_IN
              ? "Don't have an account ?"
              : "Already have an account ?"}
          </p>
          <Link
            href={type === TAuthType.SIGN_IN ? "sign-up" : "sign-in"}
            className="form-link"
          >
            {type === TAuthType.SIGN_IN ? "Sign Up" : "Sign In"}
          </Link>
        </footer> */}
      </section>
    </section>
  );
};

export default AuthForm;
