import Banner from "../Components/Home/Banner";
import CallToAction from "../Components/Home/CallToAction";
import Features from "../Components/Home/Features";
import Footer from "../Components/Home/Footer";
import Hero from "../Components/Home/Hero";
import Testimonials from "../Components/Home/Testimonials";

export default function Home() {
  return (
    <div>
      {/* <Banner /> */}
      <Hero />
      <Features />
      <Testimonials />
      <CallToAction />
      <Footer />
    </div>
  );
}
