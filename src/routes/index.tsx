import FeatureCard from "@/components/common/featurecard/FeatureCard";
import Testimonial from "@/components/common/testimonial/Testimonial";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type React from "react";

export const Route = createFileRoute('/')({
        component: Index,
})

const TwitterIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
    </svg>
);

const DiscordIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.283 3.217a21.43,21.43,0,0,0-4.482-1.257,1.11,1.11,0,0,0-1.011.643,18.42,18.42,0,0,0-6.4,0,1.11,1.11,0,0,0-1.011-.643A21.43,21.43,0,0,0,3.717,3.217a1.1,1.1,0,0,0-.472.932A19.43,19.43,0,0,0,5.8,15.659a1.08,1.08,0,0,0,.682.721,17.43,17.43,0,0,0,5.437,1.44,1.1,1.1,0,0,0,1.16,0,17.43,17.43,0,0,0,5.437-1.44,1.08,1.08,0,0,0,.682-.721A19.43,19.43,0,0,0,20.755,4.149a1.1,1.1,0,0,0-.472-.932ZM8.661,12.783a1.76,1.76,0,0,1-1.8-1.714,1.76,1.76,0,0,1,1.8-1.715,1.74,1.74,0,0,1,1.789,1.715,1.74,1.74,0,0,1-1.789,1.714Zm6.678,0a1.76,1.76,0,0,1-1.8-1.714,1.76,1.76,0,0,1,1.8-1.715,1.74,1.74,0,0,1,1.789,1.715,1.74,1.74,0,0,1-1.789,1.714Z" />
    </svg>
);
const Hero: React.FC = () => {
    return (
        <section className="relative bg-indigo-900 text-white pt-32 pb-24 text-center overflow-hidden">
            <div className="absolute inset-0 bg-grid-indigo-500/20 [mask-image:linear-gradient(to_bottom,white_5%,transparent_95%)]"></div>
            <div className="relative z-10 container mx-auto px-6">
                <h2 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tighter mb-4 animate-fade-in-down">
                    Send Money Globally.
                    <br />
                    <span className="text-indigo-400">Pay Almost Nothing.</span>
                </h2>
                <p className="text-lg md:text-xl max-w-3xl mx-auto text-indigo-200 mb-8 animate-fade-in-up">
                    Experience the future of finance. Peer-to-peer money transfers powered by Solana, with near-instant settlement and transaction fees that are practically free.
                </p>
                <a href="#" className="bg-indigo-600 text-white font-bold py-4 px-10 rounded-lg shadow-lg hover:bg-indigo-500 transition-transform duration-300 transform hover:scale-105 inline-block">
                    Send Money Now for Free
                </a>
            </div>
        </section>
    );
};

const Features: React.FC = () => {
    const features = [
        {
            title: "Near-Zero Fees",
            description: "Say goodbye to costly transfer fees. Our dApp leverages Solana to cut transaction costs to a fraction of a cent.",
        },
        {
            title: "Lightning-Fast Speed",
            description: "Don't wait days for your money to arrive. Transactions on SolPay are confirmed in seconds, not days.",
        },
        {
            title: "Global & Borderless",
            description: "Send money to anyone, anywhere in the world with a Solana wallet. No banks, no borders, no delays.",
        },
        {
            title: "Unmatched Security",
            description: "Built on the secure and decentralized Solana blockchain. Your funds are always in your control.",
        }
    ];
    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-800">Why SolPay is a Game-Changer</h3>
                    <p className="text-gray-600 mt-2 max-w-2xl mx-auto">A better way to transfer value is here. Fast, cheap, and secure.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} heading={feature.title} content={feature.description} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const HowItWorks: React.FC = () => {
    const steps = [
        {
            step: 1,
            title: "Connect Your Wallet",
            description: "Securely connect your favorite Solana wallet like Phantom or Solflare in one click."
        },
        {
            step: 2,
            title: "Enter Details",
            description: "Enter the recipient's wallet address and the amount you want to send."
        },
        {
            step: 3,
            title: "Confirm & Send",
            description: "Review the transaction details (with the tiny fee!) and approve. That's it!"
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-800">Get Started in Seconds</h3>
                    <p className="text-gray-600 mt-2">Sending money has never been this easy.</p>
                </div>
                <div className="relative">
                    {/* <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-indigo-200 -translate-y-1/2"></div> */}
                    <div className="relative flex flex-col md:flex-row justify-between items-center space-y-12 md:space-y-0">
                        {steps.map((step, index) => (
                            <div key={index} className="flex flex-col items-center text-center max-w-xs z-10">
                                <div className="flex items-center justify-center w-16 h-16 bg-indigo-600 text-white text-2xl font-bold rounded-full mb-4 shadow-lg">
                                    {step.step}
                                </div>
                                <h4 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h4>
                                <p className="text-gray-600">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const Testimonials: React.FC = () => {
    const testimonials = [
        {
            quote: "I used to lose 5% of every international client payment to fees. With SolPay, I keep what I earn. It's a game-changer.",
            name: "Maria S.",
            title: "Digital Nomad",
            imgSrc: "https://placehold.co/100x100/E2E8F0/4A5568?text=M"
        },
        {
            quote: "The speed is unbelievable. I sent money to my family overseas, and they received it before I could even send a confirmation text.",
            name: "David L.",
            title: "Small Business Owner",
            imgSrc: "https://placehold.co/100x100/E2E8F0/4A5568?text=D"
        },
        {
            quote: "Finally, a crypto application that's actually easy to use. The interface is clean and intuitive. Highly recommended for anyone in the space.",
            name: "Ken J.",
            title: "Crypto Enthusiast",
            imgSrc: "https://placehold.co/100x100/E2E8F0/4A5568?text=K"
        }
    ];
    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-800">Trusted by Users Worldwide</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <Testimonial key={index} quote={testimonial.quote} image={testimonial.imgSrc} name={testimonial.name} title={testimonial.title}  />
                    ))}
                </div>
            </div>
        </section>
    );
};

const CTA: React.FC = () => {
    return (
        <section className="bg-indigo-600 text-white">
            <div className="container mx-auto px-6 py-20 text-center">
                <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to Join the Future of Money?</h3>
                <p className="text-indigo-200 max-w-2xl mx-auto mb-8">
                    Stop paying outrageous fees and waiting for days. Start sending money on your terms.
                </p>
                <a href="#" className="bg-white text-indigo-600 font-bold py-4 px-10 rounded-lg shadow-lg hover:bg-gray-100 transition-transform duration-300 transform hover:scale-105 inline-block">
                    Launch the App
                </a>
            </div>
        </section>
    );
};

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-gray-400">
            <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center">
                <p>&copy; 2025 SolPay. All rights reserved.</p>
                <div className="flex space-x-4 mt-4 md:mt-0">
                    <a href="#" className="hover:text-white transition-colors duration-300"><TwitterIcon /></a>
                    <a href="#" className="hover:text-white transition-colors duration-300"><DiscordIcon /></a>
                </div>
            </div>
        </footer>
    );
};


function Index() {
  return (
    <div className="bg-white font-sans">
      {/* <Nav /> */}
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
