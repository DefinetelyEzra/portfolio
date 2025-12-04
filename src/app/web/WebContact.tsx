'use client';

import { motion, useInView } from 'framer-motion';
import { useState, useRef } from 'react';
import { Mail, Phone, MapPin, Calendar, Send, CheckCircle, Sparkles } from 'lucide-react';
import { FaBriefcase, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { useDesktopStore } from '@/store/desktopStore';

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
};

export default function WebContact() {
  const { currentTheme } = useDesktopStore();
  const isDark = currentTheme === 'dark';

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef);

  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setForm({
            name: '',
            email: '',
            subject: '',
            message: '',
            priority: 'medium',
          });
        }, 5000);
      }
    } catch (err) {
      console.error('Error sending message', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { id: 'email', icon: Mail, label: 'Email', value: 'ezraagun@gmail.com', href: 'mailto:ezraagun@gmail.com', color: 'from-blue-500 to-cyan-500' },
    { id: 'phone', icon: Phone, label: 'Phone', value: '+234 708 229 7108', href: 'tel:+2347082297108', color: 'from-green-500 to-emerald-500' },
    { id: 'location', icon: MapPin, label: 'Location', value: 'Lagos, Nigeria', href: null, color: 'from-purple-500 to-pink-500' },
    { id: 'availability', icon: Calendar, label: 'Availability', value: 'Available for opportunities', href: null, color: 'from-orange-500 to-red-500' },
  ];

  const socialLinks = [
    { id: 'github', icon: FaGithub, label: 'GitHub', url: 'https://github.com/DefinetelyEzra', gradient: 'from-gray-700 to-gray-900' },
    { id: 'linkedin', icon: FaLinkedinIn, label: 'LinkedIn', url: 'https://linkedin.com/in/odunayo-agunbiade-155440315', gradient: 'from-blue-600 to-blue-800' },
    { id: 'jobberman', icon: FaBriefcase, label: 'Jobberman', url: 'https://jobberman.com/profile/Odunayo-Agunbiade', gradient: 'from-purple-600 to-pink-600' },
  ];

  const getInputStyles = (fieldName: string) => {
    const isFocused = focusedField === fieldName;

    if (isFocused) {
      return 'border-purple-500 ring-2 ring-purple-500/20';
    }

    if (isDark) {
      return 'bg-gray-700 border-gray-600 text-white focus:border-purple-500';
    }

    return 'bg-white border-gray-300 text-gray-900 focus:border-purple-500';
  };

  const getLabelStyles = (fieldName: string) => {
    const isFocused = focusedField === fieldName;

    if (isFocused) {
      return 'text-purple-500';
    }

    if (isDark) {
      return 'text-gray-300';
    }

    return 'text-gray-700';
  };

  const getSelectStyles = () => {
    if (isDark) {
      return 'bg-gray-700 border-gray-600 text-white focus:border-purple-500';
    }

    return 'bg-white border-gray-300 text-gray-900 focus:border-purple-500';
  };

  const getButtonDisabledStyle = () => {
    return isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:from-purple-700 hover:to-pink-700';
  };

  const renderContactItem = (info: typeof contactInfo[0], index: number) => {
    const IconComponent = info.icon;

    return (
      <motion.div
        key={info.id}
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ delay: 0.1 * index }}
        whileHover={{ x: 5, scale: 1.02 }}
        className={`p-6 rounded-xl border relative overflow-hidden group ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
          }`}
      >
        <motion.div
          className={`absolute inset-0 bg-linear-to-br ${info.color} opacity-0`}
          whileHover={{ opacity: 0.05 }}
          transition={{ duration: 0.2 }}
        />

        <div className="flex items-center space-x-4 relative z-10">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className={`p-3 rounded-lg bg-linear-to-br ${info.color}`}
          >
            <IconComponent className="text-white" />
          </motion.div>

          <div>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{info.label}</p>
            {info.href ? (
              <motion.a
                href={info.href}
                whileHover={{ scale: 1.05 }}
                className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} hover:underline`}
              >
                {info.value}
              </motion.a>
            ) : (
              <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {info.value}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const renderSocialLink = (social: typeof socialLinks[0], index: number) => (
    <motion.a
      key={social.id}
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ delay: 0.6 + index * 0.1 }}
      whileHover={{ scale: 1.05, x: 5 }}
      className={`flex items-center space-x-3 p-3 rounded-lg transition bg-linear-to-r ${social.gradient} text-white`}
    >
      <social.icon className="w-5 h-5" />
      <span className="font-medium">{social.label}</span>
    </motion.a>
  );

  const renderFormInput = (field: keyof Omit<FormState, 'priority'>, label: string, type: string = 'text') => (
    <div className="relative">
      <label
        htmlFor={field}
        className={`block mb-1 font-medium transition-colors ${getLabelStyles(field)}`}
      >
        {label}
      </label>
      {type === 'textarea' ? (
        <motion.textarea
          id={field}
          value={form[field]}
          onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
          onFocus={() => setFocusedField(field)}
          onBlur={() => setFocusedField(null)}
          rows={6}
          whileFocus={{ scale: 1.01 }}
          className={`w-full px-4 py-2 rounded-lg border-2 transition-all ${getInputStyles(field)}`}
        />
      ) : (
        <motion.input
          id={field}
          type={type}
          value={form[field]}
          onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
          onFocus={() => setFocusedField(field)}
          onBlur={() => setFocusedField(null)}
          whileFocus={{ scale: 1.01 }}
          className={`w-full px-4 py-2 rounded-lg border-2 transition-all ${getInputStyles(field)}`}
        />
      )}
    </div>
  );

  const renderFormSelect = () => (
    <div>
      <label
        htmlFor="priority"
        className={`block mb-1 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
      >
        Priority
      </label>
      <select
        id="priority"
        value={form.priority}
        onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value as FormState['priority'] }))}
        className={`w-full px-4 py-2 rounded-lg border-2 transition-all ${getSelectStyles()}`}
      >
        <option value="low">Low Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="high">High Priority</option>
      </select>
    </div>
  );

  const renderSubmitButton = () => (
    <motion.button
      onClick={handleSubmit}
      disabled={isSubmitting}
      whileHover={isSubmitting ? {} : { scale: 1.05, y: -2 }}
      whileTap={isSubmitting ? {} : { scale: 0.95 }}
      className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition bg-linear-to-r from-purple-600 to-pink-600 text-white ${getButtonDisabledStyle()}`}
    >
      {isSubmitting ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Sending...</span>
        </>
      ) : (
        <>
          <Send className="w-5 h-5" />
          <span>Send Message</span>
        </>
      )}
    </motion.button>
  );

  return (
    <section
      ref={sectionRef}
      className={`py-20 relative overflow-hidden ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-4"
            >
              <Sparkles className="w-6 h-6 text-pink-500" />
              <span className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-pink-400' : 'text-pink-600'}`}>
                Let's Connect
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.2 }}
              className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              Get In Touch
            </motion.h2>

            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: '5rem' } : { width: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="h-1 bg-linear-to-r from-pink-500 to-purple-500 mx-auto mb-6"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.6 }}
              className={`text-lg max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
            >
              Let's discuss opportunities, collaborations, or just say hello.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {contactInfo.map(renderContactItem)}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.5 }}
                className={`p-6 rounded-xl border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}
              >
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Connect With Me
                </h3>

                <div className="space-y-3">
                  {socialLinks.map(renderSocialLink)}
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.6 }}
              className={`p-8 rounded-xl border shadow-xl relative overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}
            >
              <motion.div
                className="absolute inset-0 rounded-xl opacity-20"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.5), transparent)',
                }}
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-3 p-4 mb-6 rounded-lg bg-green-100 text-green-700 relative z-10"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Message sent successfully!</span>
                </motion.div>
              )}

              <div className="space-y-6 relative z-10">
                {renderFormInput('name', 'Your Name')}
                {renderFormInput('email', 'Email Address', 'email')}
                {renderFormInput('subject', 'Subject')}
                {renderFormSelect()}
                {renderFormInput('message', 'Message', 'textarea')}
                {renderSubmitButton()}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}