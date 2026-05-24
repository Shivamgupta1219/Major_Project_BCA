import Hero         from "../Components/Home/Hero";
import HowItWorks   from "../Components/Home/HowItWorks";
import Features     from "../Components/Home/Features";
import Testimonials from "../Components/Home/Testimonials";
import CallToAction from "../Components/Home/CallToAction";
import Footer       from "../Components/Home/Footer";

export default function Home() {
  return (
    <div className="bg-slate-950">
      {/* Dark sections */}
      <Hero />
      <HowItWorks />

      {/* Light sections */}
      <div className="bg-white">
        <Features />
        <Testimonials />
      </div>

      {/* Dark closing */}
      <CallToAction />
      <Footer />
    </div>
  );
}
