import React from "react";
import { motion } from "framer-motion";
import {
  User,
  Stethoscope,
  Pill,
  Heart,
  ArrowRight,
  Check,
} from "lucide-react";
import { Link } from "react-router-dom";

// Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

// Reusable Section
const Section = ({ children, className = "" }) => (
  <motion.section
    className={`py-16 sm:py-24 ${className}`}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
    transition={{ staggerChildren: 0.2 }}
  >
    <div className="container mx-auto px-6">{children}</div>
  </motion.section>
);

// Role Card Component
const RoleCard = ({ icon, title, description, link, image }) => (
  <motion.div
    variants={fadeUp}
    transition={{ duration: 0.6 }}
    className="group bg-card rounded-2xl border border-border shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2 relative"
  >
    <Link to={link}>
      {/* Image with Overlay */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        <div className="absolute bottom-4 left-4 flex items-center gap-3">
          <div className="p-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-lg shadow-inner">
            {icon}
          </div>
          <h3 className="font-bold text-2xl text-white drop-shadow-lg tracking-tight">
            {title}
          </h3>
        </div>
      </div>

      {/* Text Content */}
      <div className="p-6 bg-background">
        <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
          {description}
        </p>
        <span className="font-semibold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text flex items-center gap-2 group-hover:gap-3 transition-all">
          Explore Role <ArrowRight size={18} />
        </span>
      </div>
    </Link>
  </motion.div>
);

// Main Page Component
const RolesPage = () => {
  const roles = [
    {
      icon: <User size={22} />,
      title: "Patient",
      description:
        "Manage appointments, health records, and prescriptions effortlessly — your health, your control.",
      link: "/signup",
      image:
        "https://images.unsplash.com/photo-1600442715460-5e9e4ae4b4a7?q=80&w=1000&auto=format&fit=crop",
    },
    {
      icon: <Stethoscope size={22} />,
      title: "Doctor",
      description:
        "Streamline consultations, monitor patient progress, and manage schedules with AI-powered tools.",
      link: "/signup",
      image:
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=1000&auto=format&fit=crop",
    },
    {
      icon: <Pill size={22} />,
      title: "Pharmacy",
      description:
        "Empower your business with verified prescriptions, smart inventory, and seamless connectivity.",
      link: "/signup",
      image:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop",
    },
    {
      icon: <Heart size={22} />,
      title: "Donor",
      description:
        "Join the life-saving network — respond instantly to blood requests and track your donation impact.",
      link: "/signup",
      image:
        "https://images.unsplash.com/photo-1615461066159-fea095e38a02?q=80&w=1000&auto=format&fit=crop",
    },
  ];

  return (
    <div className="bg-background overflow-hidden">
      {/* Hero Section */}
      <Section>
        <div className="text-center max-w-3xl mx-auto">
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text"
          >
            A Role for Everyone in Healthcare
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg text-muted-foreground leading-relaxed"
          >
            HealthSphere unites patients, doctors, pharmacies, and donors in one
            digital ecosystem — making healthcare smarter, faster, and deeply
            connected.
          </motion.p>
        </div>
      </Section>

      {/* Role Cards */}
      <Section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {roles.map((role) => (
            <RoleCard key={role.title} {...role} />
          ))}
        </div>
      </Section>

      {/* Process Section */}
      <Section className="bg-gradient-to-br from-muted/30 via-background to-muted/50">
        <div className="text-center mb-16">
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text"
          >
            Your Journey to Better Health
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-muted-foreground mt-3 max-w-2xl mx-auto"
          >
            Whether you’re a patient or a doctor, HealthSphere makes every step
            intuitive and secure.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-[45%] left-0 w-full h-px border-t-2 border-dashed border-border"></div>

          {["Register & Find", "Book & Connect", "Consult & Care"].map(
            (step, i) => (
              <motion.div key={i} variants={fadeUp} className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 text-xl font-bold rounded-full bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white mb-4 shadow-lg border-4 border-background">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-lg">{step}</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {i === 0
                    ? "Create your account and find the right doctor or pharmacy instantly."
                    : i === 1
                    ? "Schedule appointments, chat securely, and manage prescriptions with ease."
                    : "Get treated, monitor your progress, and store records safely in one place."}
                </p>
              </motion.div>
            )
          )}
        </div>
      </Section>

      {/* Patient Section */}
      <Section>
        <div className="grid md:grid-cols-2 gap-14 items-center">
          <motion.div variants={fadeUp}>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
              For Patients: Take Charge of Your Health
            </h2>
            <p className="text-muted-foreground mt-4">
              Manage appointments, store reports, and stay connected to your
              doctors — all from one dashboard.
            </p>
            <ul className="mt-6 space-y-3 text-foreground">
              <li className="flex items-start gap-3">
                <Check className="text-primary mt-1 flex-shrink-0" />
                <span>
                  <strong>Smart Appointments:</strong> Skip queues and consult
                  doctors digitally.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-primary mt-1 flex-shrink-0" />
                <span>
                  <strong>Secure Records:</strong> Access all reports and
                  prescriptions anytime.
                </span>
              </li>
            </ul>
            <Link
              to="/signup"
              className="mt-8 inline-block font-bold py-3 px-6 rounded-lg bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white hover:opacity-90 transition-opacity shadow-md"
            >
              Join as a Patient
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="relative w-full flex justify-center"
          >
            <div className="bg-card p-4 rounded-2xl border border-border shadow-xl max-w-sm w-full hover:shadow-2xl transition-shadow">
              <div className="bg-muted p-4 rounded-xl">
                <p className="text-sm font-semibold mb-2">
                  Upcoming Appointment
                </p>
                <div className="bg-background p-3 rounded-lg shadow-sm">
                  <p className="font-semibold">Dr. Anjali Sharma</p>
                  <p className="text-xs text-muted-foreground">
                    Cardiology • Today, 10:30 AM
                  </p>
                </div>
              </div>
              <div className="mt-4 bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white p-4 rounded-xl text-center shadow-md">
                <p className="font-bold text-lg">Stay Healthy. Stay Connected.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>
    </div>
  );
};

export default RolesPage;
