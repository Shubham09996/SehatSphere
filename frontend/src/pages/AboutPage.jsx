import React, { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Github, Linkedin, Heart } from "lucide-react";

// ------------------- TEAM DATA -------------------
const team = [
  {
    name: "Shubham Gupta",
    role: "Team Leader — Full Stack",
    line: "Architecting the future of healthcare, one line of code at a time.",
    avatarSeed: "Shubham",
    side: "left",
    links: { linkedin: "https://www.linkedin.com/in/shubhamgupta0996/", github: "https://github.com/Shubham09996" },
  },
  {
    name: "Sneha Gupta",
    role: "UI/UX & Documentation",
    line: "Crafting intuitive designs for a seamless and compassionate user experience.",
    avatarSeed: "Sneha",
    side: "right",
    links: { linkedin: "https://www.linkedin.com/in/sneha-gupta-54a2032a4/", github: "https://github.com/snehagupta1234" },
  },
  {
    name: "Om Kumar Jha",
    role: "Frontend & Ideas",
    line: "Bringing static designs to life with fluid animations and next-level features.",
    avatarSeed: "OmKumar",
    side: "left",
    links: { linkedin: "https://www.linkedin.com/in/omkumarjha08/", github: "https://github.com/Omk228" },
  },
];

// ------------------- CONFETTI FUNCTION -------------------
function burstConfetti(colors = ["#0096C7", "#2A9D8F", "#7E57C2", "#EF476F"]) {
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.left = "0";
  canvas.style.top = "0";
  canvas.style.zIndex = "9999";
  canvas.style.pointerEvents = "none";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const pieces = [];
  for (let i = 0; i < 60; i++) {
    pieces.push({
      x: window.innerWidth / 2,
      y: window.innerHeight * 0.2,
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * -10 - 3,
      r: 4 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 100 + Math.random() * 50,
    });
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p) => {
      p.vy += 0.3;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.r, p.r);
    });
    if (pieces.some((p) => p.life > 0)) requestAnimationFrame(draw);
    else document.body.removeChild(canvas);
  }
  draw();
}

// ------------------- TEAM ITEM -------------------
const TeamItem = ({ member, index }) => {
  const controls = useAnimation();
  const ref = useRef();

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) controls.start("visible");
      },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => {
      if (ref.current) obs.unobserve(ref.current);
    };
  }, [controls]);

  const isLeft = member.side === "left";
  const cardAnim = {
    hidden: { opacity: 0, x: isLeft ? -50 : 50, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 1, delay: index * 0.2, type: "spring", stiffness: 60 },
    },
  };

  return (
    <div ref={ref} className="w-full md:w-1/2 px-0 sm:px-4">
      <motion.div
        initial="hidden"
        animate={controls}
        variants={cardAnim}
        className="transform hover:scale-[1.02] transition-transform duration-300 mb-8"
      >
        <div className="bg-card/80 backdrop-blur-md border border-border rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row gap-4 items-center sm:items-start text-center sm:text-left">
          <img
            src={`https://api.dicebear.com/7.x/bottts/svg?seed=${member.avatarSeed}&backgroundType=gradientLinear&backgroundColor=0096c7,2a9d8f,7e57c2`}
            alt={member.name}
            className="w-20 h-20 rounded-full border-4 border-primary/20 object-cover flex-shrink-0"
          />
          <div>
            <h4 className="text-xl sm:text-2xl font-bold text-foreground">
              {member.name}
            </h4>
            <span className="inline-flex text-xs sm:text-sm bg-primary/15 text-primary px-2 py-0.5 rounded-full mt-1 font-semibold">
              {member.role}
            </span>
            <p className="mt-2 text-muted-foreground text-sm sm:text-base leading-relaxed">
              {member.line}
            </p>
            <div className="mt-3 flex items-center justify-center sm:justify-start gap-4">
              {member.links.linkedin && (
                <a
                  href={member.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-primary transition"
                >
                  <Linkedin size={18} />
                </a>
              )}
              {member.links.github && (
                <a
                  href={member.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-primary transition"
                >
                  <Github size={18} />
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ------------------- MAIN COMPONENT -------------------
const AboutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => burstConfetti(), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* ---------- HERO SECTION ---------- */}
      <header className="min-h-[60vh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-16 text-center gap-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-snug bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text"
        >
          The Story Behind HealthSphere
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-2 sm:mt-4 text-sm sm:text-base md:text-lg text-muted-foreground max-w-md sm:max-w-2xl"
        >
          We are a passionate team dedicated to solving healthcare challenges
          with technology — creating a connected, intelligent, and compassionate
          ecosystem.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <button
            onClick={() => {
              burstConfetti();
              navigate("/signup");
            }}
            className="mt-4 px-5 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white font-semibold shadow-lg hover:scale-105 transform transition"
          >
            Join Our Mission
          </button>
        </motion.div>
      </header>

      {/* ---------- TEAM TIMELINE ---------- */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-10 text-center bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
            Meet the Architects
          </h2>
          <div className="relative flex flex-col gap-8 md:gap-12">
            {/* Vertical Line for Timeline */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/10 via-primary/40 to-primary/10" />
            {team.map((member, idx) => (
              <div
                key={idx}
                className={`flex flex-col md:flex-row ${
                  member.side === "left" ? "md:justify-start" : "md:justify-end"
                }`}
              >
                <TeamItem member={member} index={idx} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CALL TO ACTION ---------- */}
      <footer className="py-12 px-4 sm:px-6 lg:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-xl"
          >
            <Heart size={32} className="mx-auto text-primary mb-4" />
            <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Ready to Transform Healthcare?
            </h3>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              Join HealthSphere today — experience a smarter, connected, and
              patient-first healthcare system.
            </p>
            <div className="mt-6 sm:mt-8">
              <button
                onClick={() => {
                  burstConfetti();
                  navigate("/signup");
                }}
                className="px-6 py-2 sm:px-8 sm:py-3 rounded-full bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white shadow-lg font-semibold transform hover:scale-105 transition"
              >
                Get Started — It’s Free
              </button>
            </div>
          </motion.div>

          <div className="mt-8 text-xs text-muted-foreground">
            © {new Date().getFullYear()} HealthSphere — Built by{" "}
            <span className="font-semibold text-foreground">Shubham & Team</span>{" "}
            with ❤️
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
