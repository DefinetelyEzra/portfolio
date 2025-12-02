'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useDesktopStore } from '@/store/desktopStore';
import WebNavbar from './WebNavbar';
import WebHero from './WebHero';
import WebAbout from './WebAbout';
import WebProjects from './WebProjects';
import WebSkills from './WebSkills';
import WebContact from './WebContact';
import WebFooter from './WebFooter';

export default function WebPortfolio() {
    const { currentTheme } = useDesktopStore();
    const isDark = currentTheme === 'dark';
    const [activeSection, setActiveSection] = useState('hero');

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    // Refs for sections
    const heroRef = useRef<HTMLElement>(null);
    const aboutRef = useRef<HTMLElement>(null);
    const projectsRef = useRef<HTMLElement>(null);
    const skillsRef = useRef<HTMLElement>(null);
    const contactRef = useRef<HTMLElement>(null);

    // Scroll spy
    useEffect(() => {
        const handleScroll = () => {
            const sections = [
                { id: 'hero', ref: heroRef },
                { id: 'about', ref: aboutRef },
                { id: 'projects', ref: projectsRef },
                { id: 'skills', ref: skillsRef },
                { id: 'contact', ref: contactRef },
            ];

            const scrollPosition = window.scrollY + 200;

            for (const section of sections) {
                const element = section.ref.current;
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section.id);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 origin-left z-60"
                style={{ scaleX }}
            />

            {/* Navbar */}
            <WebNavbar activeSection={activeSection} />

            {/* Sections */}
            <main>
                <section ref={heroRef} id="hero">
                    <WebHero />
                </section>

                <section ref={aboutRef} id="about">
                    <WebAbout />
                </section>

                <section ref={projectsRef} id="projects">
                    <WebProjects />
                </section>

                <section ref={skillsRef} id="skills">
                    <WebSkills />
                </section>

                <section ref={contactRef} id="contact">
                    <WebContact />
                </section>
            </main>

            {/* Footer */}
            <WebFooter />
        </div>
    );
}