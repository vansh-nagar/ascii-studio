import AsciiAnimationsGrid from "@/components/landing/grid";

const Page = () => {
  return (
    <div>
      {/* <Navbar /> */}
      <div className=" mt-10">
        <AsciiAnimationsGrid />
      </div>
      {/* <div className=" flex flex-col justify-center items-center min-h-screen w-full relative font-satoshi ">
        <Navbar />
        <div className="landing-sections-stack">
          <div className="w-full relative">
            <HeroSection />
          </div>
          <Bento />
          <Testimonials />
          <Pricing />
          <Faq />
          <Footer />
        </div>
      </div> */}
    </div>
  );
};

export default Page;
