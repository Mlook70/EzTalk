

"use client";
import { useState, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, usePathname } from 'next/navigation';
import { useUploadThing } from '@/lib/uploadthing';
import { isBase64Image } from '@/lib/utils';
import { createToky } from '@/lib/actions/toky.action';
import { TokyValidation } from '@/lib/validation/toky';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useOrganization } from "@clerk/nextjs";

interface Props {
  userId: string;
}

const PostToky = ({ userId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { startUpload } = useUploadThing('media');
  const [files, setFiles] = useState<File[]>([]);
  const { organization } = useOrganization();

  const form = useForm({
    resolver: zodResolver(TokyValidation),
    defaultValues: {
      toky: '',
      accountId: userId,
      image: '',
    },
  });

  const onSubmit = async () => {
    const values = form.getValues() as z.infer<typeof TokyValidation>;

    const blob = values.image;
    const hasImageChanged = isBase64Image(blob);
    if (hasImageChanged) {
      const imgRes = await startUpload(files);
      if (imgRes && imgRes[0]?.url) {
        values.image = imgRes[0].url;
      }
    }

    await createToky({
      text: values.toky,
      author: userId,
      communityId: organization ? organization.id : null,
      path: pathname,
    });

    router.push('/');
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const reader = new FileReader();

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFiles([file]);

      reader.onloadend = () => {
        const imageDataUrl = reader.result as string;
        form.setValue('image', imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 flex flex-col gap-10">
        {/* Textarea for toky content */}
        <FormField
          control={form.control}
          name="toky"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-2">write your toky</FormLabel>
              <FormControl>
                <Textarea {...field} rows={10} className="no-focus" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Input for image upload */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-2">Add an image</FormLabel>
              <FormControl>
                <Input type="file" accept="image/*" className="no-focus" onChange={handleImageChange} />
              </FormControl>
              {field.value && (
                <img src={field.value} alt="Preview" className="mt-2 h-48 w-full object-cover" />
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit button */}
        <Button type="submit" className="from-violet-800 via-blue-700 to-sky-500 bg-gradient-to-r">
          Post Toky
        </Button>
      </form>
    </Form>
  );
};

export default PostToky;
