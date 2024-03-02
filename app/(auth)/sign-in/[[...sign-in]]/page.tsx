import { SignIn } from "@clerk/nextjs";

const Page =()=> {
    return (
        <div className="bg-[url('/assets/EzTalkBg.png')] bg-cover bg-center">
            <SignIn />;
        </div>
    );
};

export default Page;