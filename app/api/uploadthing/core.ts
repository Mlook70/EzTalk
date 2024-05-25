// import { createUploadthing, type FileRouter } from "uploadthing/next";
// import { UploadThingError } from "uploadthing/server";
// import { currentUser } from "@clerk/nextjs";
// const f = createUploadthing();

// const getUser = async ()=>{
//     await currentUser();
// };

// const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

// // FileRouter for your app, can contain multiple FileRoutes
// export const ourFileRouter = {
// // Define as many FileRoutes as you like, each with a unique routeSlug
// media: f({ image: { maxFileSize: "4MB",  maxFileCount:1} })
// // Set permissions and file types for this FileRoute
// .middleware(async ({ req }) => {
//     // This code runs on your server before upload
//     const user = await getUser();

//     // If you throw, the user will not be able to upload
//     if (!user) throw new UploadThingError("Unauthorized");

//     // Whatever is returned here is accessible in onUploadComplete as `metadata`
//     return { userId: user.id };
// })
// .onUploadComplete(async ({ metadata, file }) => {
//     // This code RUNS ON YOUR SERVER after upload
//     console.log("Upload complete for userId:", metadata.userId);

//     console.log("file url", file.url);

//     // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
//     return { uploadedBy: metadata.userId };
// }),
// } satisfies FileRouter;

// export type OurFileRouter = typeof ourFileRouter;



// File: /pages/_middleware.ts

import { NextRequest, NextResponse } from 'next/server';
import { createUploadthing } from "uploadthing/next";
import { UploadThingError } from 'uploadthing/server';

interface UploadedFile {
    url: string;
    // Define other properties based on the expected file object structure
}

const uploadThing = createUploadthing();

const getUser = async (req: NextRequest) => {
    // Example: Extract and verify JWT from the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null; // No valid token provided
    }
    const token = authHeader.split(' ')[1];
    // Here, implement your token verification logic
    return { id: 'userId' }; // Return user ID upon successful token verification
};

export const ourFileRouter = {
    media: uploadThing({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(async ({ req }) => {
            const user = await getUser(req);
            if (!user) throw new UploadThingError("Unauthorized");
            return { userId: user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            const uploadedFile = file as UploadedFile;
            if (!uploadedFile.url) {
                throw new Error("File URL is missing");
            }
            console.log("Upload complete for userId:", metadata.userId);
            console.log("File URL:", uploadedFile.url);
            return { uploadedBy: metadata.userId, fileUrl: uploadedFile.url };
        }),
};

// Middleware to handle requests
export function middleware(req: NextRequest) {
    if (req.nextUrl.pathname.startsWith('/api/upload')) {
        return NextResponse.rewrite(req.nextUrl);
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/api/upload/:path*']
};
