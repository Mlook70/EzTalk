"use client";
import { UserButton } from '@clerk/nextjs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import UserValidation from '@/lib/validation/user';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
Form,
FormControl,
FormDescription,
FormField,
FormItem,
FormLabel,
FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import { isBase64Image } from '@/lib/utils';
import { useUploadThing } from '@/lib/uploadthing';
import { updateUser } from '@/lib/actions/user.action';
import { usePathname, useRouter } from 'next/navigation';

interface Props {
user: {
id: string;
objectId: string;
username: string;
name: string;
bio: string;
image: string;
};
btnTitle: string;
}

const AccountProfile = ({ user, btnTitle }: Props) => {
const [files, setFiles] = useState<File[]>([]);
const { startUpload } = useUploadThing("media");
const router = useRouter();
const pathname = usePathname();
const [loading, setLoading] = useState(false);

const form = useForm({
resolver: zodResolver(UserValidation),
defaultValues: {
    profile_photo: user?.image || "",
    name: user?.name || "",
    username: user?.username || "",
    bio: user?.bio || ""
}
});

const onSubmit = async () => {
setLoading(true); // Set loading state to true
const values = form.getValues() as z.infer<typeof UserValidation>; // Retrieve form values using react-hook-form

const blob = values.profile_photo;

const hasImageChanged = isBase64Image(blob);
if (hasImageChanged) {
    const imgRes = await startUpload(files);

    if (imgRes && imgRes[0].url) {
    values.profile_photo = imgRes[0].url;
    }
}

await updateUser({
    userId: user.id,
    name: values.name,
    path: pathname,
    username: values.username,
    bio: values.bio,
    image: values.profile_photo,
});

setLoading(false); // Set loading state to false
if (pathname === "/profile/edit") {
    router.back();
} else {
    router.push("/");
}
};

const handleImage = (
e: ChangeEvent<HTMLInputElement>,
fieldChange: (value: string) => void
) => {
e.preventDefault();

const fileReader = new FileReader();

if (e.target.files && e.target.files.length > 0) {
    const file = e.target.files[0];
    setFiles(Array.from(e.target.files));

    if (!file.type.includes("image")) return;

    fileReader.onload = async (event) => {
    const imageDataUrl = event.target?.result?.toString() || "";
    fieldChange(imageDataUrl);
    };

    fileReader.readAsDataURL(file);
}
};

return (
<div>
    {loading && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="loader">Loading...</div>
    </div>
    )}
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10">
        <FormField
        control={form.control}
        name="profile_photo"
        render={({ field }) => (
            <FormItem className="flex items-center gap-4">
            <FormLabel className="account-form_image-label">
                {field.value ? (
                <Image
                    src={field.value}
                    alt="profile photo"
                    width={96}
                    height={96}
                    priority
                    className="rounded-full object-contain"
                />
                ) : (
                <Image
                    src="/assets/profile.svg"
                    alt="profile photo"
                    width={24}
                    height={24}
                    className="object-contain"
                />
                )}
            </FormLabel>
            <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                type="file"
                accept="image/*"
                placeholder="Add profile photo"
                className="account-form_image-input"
                onChange={(e) => handleImage(e, field.onChange)}
                />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />
        <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-3">
            <FormLabel className="text-base-semibold text-light-2">
                Name
            </FormLabel>
            <FormControl>
                <Input
                type="text"
                className="account-form_input no-focus"
                {...field}
                />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />

        <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-3">
            <FormLabel className="text-base-semibold text-light-2">
                Username
            </FormLabel>
            <FormControl>
                <Input
                type="text"
                className="account-form_input no-focus"
                {...field}
                />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />

        <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-3">
            <FormLabel className="text-base-semibold text-light-2">
                Bio
            </FormLabel>
            <FormControl>
                <Textarea
                rows={10}
                className="account-form_input no-focus"
                {...field}
                />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />
        <Button className="reply-button" type="submit">Submit</Button>
    </form>
    </Form>
</div>
);
};

export default AccountProfile;
