import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, Users, Stethoscope, Pill, Heart, GitBranch, ShieldCheck, 
  Clock, MessageSquare, PlusCircle, Calendar, FileText, BarChart2, ArrowRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Reusable Section Component
const Section = ({ children, className = "" }) => (
  <motion.section 
    className={`py-16 sm:py-24 ${className}`}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6 }}
  >
    <div className="container mx-auto px-4">{children}</div>
  </motion.section>
);

// Feature Card Component (✅ FIXED ICON)
const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div 
    className="bg-card p-6 rounded-xl border border-border shadow-sm text-center transform hover:scale-105 transition-transform duration-300"
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.5, delay: delay }}
  >
    <div className="inline-block p-3 bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white rounded-lg mb-4 shadow-lg">
      {React.createElement(icon, { size: 26, className: "mx-auto" })}
    </div>
    <h3 className="font-bold text-lg text-foreground">{title}</h3>
    <p className="text-sm text-muted-foreground mt-2">{description}</p>
  </motion.div>
);

// Accordion Item Component
const AccordionItem = ({ title, content, isOpen, onClick }) => (
  <div className="border-b border-border">
    <button 
      className="flex justify-between items-center w-full py-4 text-left font-semibold text-lg text-foreground hover:text-primary transition-colors"
      onClick={onClick}
    >
      {title}
      <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }}>
        <PlusCircle size={20} className="text-muted-foreground"/>
      </motion.span>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <p className="pb-4 text-muted-foreground">{content}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FeaturesPage = () => {
  const [activeTab, setActiveTab] = useState('patients');
  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  // 👩‍⚕️ Patient Features
  const patientFeatures = [
    { icon: Clock, title: "Smart Appointments", description: "Book, reschedule, or track your appointments with real-time queue updates. Never wait unnecessarily again." },
    { icon: ShieldCheck, title: "Secure Health Records", description: "Access all your medical history, reports, and digital prescriptions securely from anywhere, anytime." },
    { icon: Pill, title: "Medicine Finder", description: "Find prescribed medicines, compare prices, and order refills directly from verified pharmacies." },
    { icon: MessageSquare, title: "Doctor Consultations", description: "Connect with doctors for follow-ups or second opinions via secure chat or video calls." },
  ];

  // 🩺 Doctor Features
  const doctorFeatures = [
    { icon: Calendar, title: "Intuitive Schedule Management", description: "Efficiently manage your appointments, patient queues, and clinic availability with smart tools." },
    { icon: Users, title: "Comprehensive Patient Profiles", description: "Access detailed patient history, treatment plans, lab reports, and manage all patient data in one place." },
    { icon: FileText, title: "Digital Prescriptions", description: "Create and issue clear, digital prescriptions instantly, reducing errors and improving patient care." },
    { icon: BarChart2, title: "Practice Analytics", description: "Gain insights into your practice's performance, patient demographics, and appointment trends." },
  ];

  // ❓ FAQs
  const faqs = [
    { question: "How does HealthSphere ensure my data privacy?", answer: "We use end-to-end encryption and adhere to strict data privacy regulations (like HIPAA/GDPR) to ensure all your health data is secure and confidential." },
    { question: "Can I use HealthSphere for emergency situations?", answer: "HealthSphere is designed for routine healthcare management and appointments. For medical emergencies, please call your local emergency services immediately." },
    { question: "Is HealthSphere available globally?", answer: "Currently, HealthSphere is primarily focused on India. We are working on expanding our services to other regions soon." },
    { question: "How do I connect with a doctor through HealthSphere?", answer: "You can find doctors by specialty or location, view their profiles, and book an appointment directly through the app. You can also opt for virtual consultations where available." },
  ];

  return (
    <div>
      {/* 🌟 Hero Section */}
      <Section className="bg-gradient-to-br from-background to-muted/20">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7 }}
          >
            Your Health, Simplified. <br/> Integrated Care for Everyone.
          </motion.h1>
          <motion.p 
            className="mt-6 text-lg sm:text-xl text-muted-foreground px-4"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            HealthSphere connects patients, doctors, and pharmacies in a single, seamless ecosystem, making healthcare smarter, faster, and more efficient.
          </motion.p>
          <motion.div 
            className="mt-8 flex justify-center gap-4"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <Link to="/signup" className="inline-flex items-center justify-center font-bold py-3 px-8 rounded-full bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white hover:shadow-lg hover:brightness-110 transition-all duration-300">
              Get Started Free <Users size={20} className="ml-2"/>
            </Link>
            <Link to="/login" className="inline-flex items-center justify-center font-semibold py-3 px-8 rounded-full border border-border text-foreground hover:bg-muted transition-colors duration-300">
              Learn More
            </Link>
          </motion.div>
        </div>
      </Section>

      {/* 🧑‍🤝‍🧑 Role-Based Features */}
      <Section className="bg-muted/30">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
            Tailored Features for Your Role
          </h2>
          <p className="text-muted-foreground mt-2">
            Whether you're a patient seeking care or a doctor providing it, HealthSphere has you covered.
          </p>
        </div>

        <div className="flex justify-center mb-10">
          <div className="bg-card p-1 rounded-full border border-border shadow-md flex">
            <button 
              onClick={() => setActiveTab('patients')} 
              className={`px-6 py-2 rounded-full font-semibold transition-all ${activeTab === 'patients' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:bg-muted'}`}
            >
              For Patients
            </button>
            <button 
              onClick={() => setActiveTab('doctors')} 
              className={`px-6 py-2 rounded-full font-semibold transition-all ${activeTab === 'doctors' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:bg-muted'}`}
            >
              For Doctors
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'patients' && (
            <motion.div
              key="patients"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {patientFeatures.map((f, i) => (
                <FeatureCard key={i} {...f} delay={i * 0.1}/>
              ))}
            </motion.div>
          )}
          {activeTab === 'doctors' && (
            <motion.div
              key="doctors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {doctorFeatures.map((f, i) => (
                <FeatureCard key={i} {...f} delay={i * 0.1}/>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </Section>

      {/* 🧠 FAQ Section */}
      <Section>
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mt-2">Find quick answers to your common queries.</p>
        </div>
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              title={faq.question} 
              content={faq.answer} 
              isOpen={openAccordion === index} 
              onClick={() => toggleAccordion(index)}
            />
          ))}
        </div>
      </Section>

      {/* 🚀 Final Call-to-Action */}
      <Section className="bg-gradient-to-br from-primary/10 to-primary/20 text-white rounded-t-3xl">
        <div className="text-center p-12 bg-card rounded-2xl border border-border shadow-2xl max-w-4xl mx-auto transform hover:scale-[1.01] transition-transform duration-300">
          <GitBranch size={50} className="mx-auto text-primary mb-6"/>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground leading-tight">
            Experience the Future of Health
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            Join thousands of users who are already benefiting from HealthSphere's integrated healthcare solutions.
          </p>
          <Link to="/signup" className="mt-8 inline-flex items-center justify-center font-bold py-4 px-10 rounded-full bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white text-lg hover:shadow-xl hover:brightness-110 transition-all duration-300 transform hover:-translate-y-1">
            Start Your Journey Today <ArrowRight size={24} className="ml-3"/>
          </Link>
        </div>
      </Section>
    </div>
  );
};

export default FeaturesPage;
