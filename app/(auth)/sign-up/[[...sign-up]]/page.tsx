import { SignUp } from "@clerk/nextjs";

const Page =()=> {
    return (
        <div className="bg-[url('/assets/EzTalkBg.png')] bg-cover bg-center">
            <SignUp />;
        </div>
    );
};

export default Page;