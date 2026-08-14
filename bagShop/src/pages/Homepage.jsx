import { useEffect } from "react";
import Navibar from "../components/Navibar"
import fc from '../assets/fc.png';
import wh from '../assets/wh.png';
import logo from '../assets/logo.png';
import react from '../assets/react.svg';
import './homepage.css';
import TextPressure from '../component/TextPressure';
import CardSwap, { Card } from '../component/CardSwap';
import LogoLoop from '../component/LogoLoop';
import TrueFocus from '../component/TrueFocus';
import RotatingText from '../component/RotatingText'
import add1 from '../assets/add1.jpg'
import add2 from '../assets/add2.jpg'
import add3 from '../assets/add3.jpg'
import colombia from '../assets/colombia.jpg'
import northface from '../assets/R.png'
import DecryptedText from '../component/DecryptedText';
import GradientText from '../component/GradientText'
import ElectricBorder from '../component/ElectricBorder'
import Footer from '../components/Footer'
import ScrollFloat from '../component/ScrollFloat';
import addPro from '../assets/addpro.png'
import Products from "./Products";
import Category from "../components/Category";

const handleAnimationComplete = () => {
  console.log('Animation completed!');
};

      
// Use your asset logos instead of react-icons
const techLogos = [
  { src: logo, alt: "Logo", href: "#" },
  { src: colombia, alt: "colombia", href: "#" },
  { src: northface, alt: "northface", href: "#" },
];



const Homepage = () => {
  useEffect(() => {
    if (window.location.hash !== "#categories") return;

    const scrollToCategories = window.setTimeout(() => {
      document.getElementById("categories")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);

    return () => window.clearTimeout(scrollToCategories);
  }, []);

  return (
    <>
      <Navibar />
      <div className="hmain">
        <TrueFocus 
        sentence="PRO PACKS"
        manualMode={false}
        blurAmount={5}
        borderColor="#23989A"
        animationDuration={0.5}
        pauseBetweenAnimations={1}
        
        />
        
        <div style={{ marginTop: '4rem', fontSize: '4rem', fontWeight: '500', color: '#ffffff', textAlign: 'center', fontFamily: 'Montserrat, sans-serif' }}>
        <DecryptedText
          text="WHERE STYLE MEETS FUNCTION"
          animateOn="view"
          revealDirection="start"
          sequential
          useOriginalCharsOnly={false}
        />
        </div>
      </div>


      <ScrollFloat
        animationDuration={1}
        ease='back.inOut(2)'
        scrollStart='center bottom+=50%'
        scrollEnd='bottom bottom-=40%'
        stagger={0.03}
      >
      Beyond shopping!
      </ScrollFloat>
       <img src={addPro} alt="Pro Pack Advertisement" className="addPro" />

      <Category />
      
      <Products/>

      
      <hr style={{ width: '80%', color: '#23989A', margin: '4rem 0', justifySelf: 'center' }} />




      <div style={{ height: '200px', position: 'relative', overflow: 'hidden', marginTop: '60px' }}>
        {/* Basic horizontal loop */}
        <LogoLoop
          logos={techLogos}
          speed={100}
          direction="left"
          logoHeight={60}
          gap={60}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          fadeOutColor="#ffffff"
          ariaLabel="Technology partners"
        />
      </div>

   

      <div className="contact">
        <img src={wh} alt="" />
      </div>
      <Footer />
    </>
  )
}

export default Homepage
