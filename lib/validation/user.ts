import * as z from 'zod';

const UserValidation = z.object({
    profile_photo: z.string().url().nonempty(),
    name: z.string().min(3,{message:"Your name should be more than 3 char"}).max(30,{message:"Your name should be less than 30 char"}),
    username: z.string().min(3, {message:"Your username should be more than 3 char"}).max(30, {message:"Your username should be less than 3 char"}),
    bio: z.string().min(0).max(1000, {message:"Your pio should be less than 1000 char"}),
});

export default UserValidation;
