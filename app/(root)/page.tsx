import { UserButton } from "@clerk/nextjs";

const Home = ()=> {
  return (
    <>
      <h1 className='head-text text-left'>Home</h1>
      <div className="h-screen">
        <UserButton />
      </div> 
    </>
  );
};


export default Home;
