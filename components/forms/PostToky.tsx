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

interface Props {
  userId: string;
}

const PostToky = ({ userId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { startUpload } = useUploadThing('media');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const form = useForm({
    resolver: zodResolver(TokyValidation),
    defaultValues: {
      toky: '',
      accountId: userId,
      image: '',
    },
  });

  const onSubmit = async () => {
    setLoading(true);
    const values = form.getValues() as z.infer<typeof TokyValidation>;

    const blob = values.image;
    const hasImageChanged = isBase64Image(blob);
    if (hasImageChanged && files.length > 0) {
      const imgRes = await startUpload(files);
      if (imgRes && imgRes[0]?.url) {
        values.image = imgRes[0].url;
      }
    } else {
      // If no image provided or changed, ensure image field is empty
      values.image = '';
    }

    await createToky({
      text: values.toky,
      author: userId,
      image: values.image,
      communityId: null,
      path: pathname,
    });

    setLoading(false);
    router.push('/');
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        // Image size exceeds 1MB
        setImageError("Image size exceeds 1MB. Please upload a smaller image, if you want to upload bigger subuscribe with VIP PREMIUM soon ^_^");
        setFiles([]);
        form.setValue('image', '');
        return;
      }
      setImageError(null);
      setFiles([file]);

      const reader = new FileReader();
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
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="loader">Loading...</div>
          </div>
        )}
        
        {/* Textarea for toky content */}
        <FormField
          control={form.control}
          name="toky"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-2">Write your toky</FormLabel>
              <FormControl>
                <Textarea {...field} rows={10} className="no-focus text-light-1 outline-none bg-dark-2" />
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
                <Input type="file" accept="image/*" className="no-focus text-light-1 outline-none bg-dark-2" onChange={handleImageChange} />
              </FormControl>
              {field.value && !imageError && (
                <img src={field.value} alt="Preview" className="mt-2 h-48 w-full object-cover" />
              )}
              {imageError && (
                <p className="text-red-500">{imageError}</p>
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